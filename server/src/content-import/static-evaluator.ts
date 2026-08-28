import ts from "typescript";

export type StaticValue = string | number | boolean | null | StaticValue[] | {
  [key: string]: StaticValue;
};

export function evaluateStaticExpression(
  expression: ts.Expression,
  variables: ReadonlyMap<string, StaticValue> = new Map(),
): StaticValue {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }
  if (ts.isNumericLiteral(expression)) return Number(expression.text);
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (expression.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(expression)) {
    const value = variables.get(expression.text);
    if (value === undefined) throw new Error(`Unknown static identifier: ${expression.text}`);
    return value;
  }
  if (ts.isParenthesizedExpression(expression)) {
    return evaluateStaticExpression(expression.expression, variables);
  }
  if (ts.isSatisfiesExpression(expression) || ts.isAsExpression(expression)) {
    return evaluateStaticExpression(expression.expression, variables);
  }
  if (ts.isArrayLiteralExpression(expression)) {
    return expression.elements.map((element) => {
      if (ts.isSpreadElement(element)) throw new Error("Spread elements are not supported");
      return evaluateStaticExpression(element, variables);
    });
  }
  if (ts.isObjectLiteralExpression(expression)) {
    const result: Record<string, StaticValue> = {};
    for (const property of expression.properties) {
      if (!ts.isPropertyAssignment(property)) {
        throw new Error("Only property assignments are supported in static objects");
      }
      const name = property.name;
      const key =
        ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)
          ? name.text
          : null;
      if (!key) throw new Error("Computed property names are not supported");
      result[key] = evaluateStaticExpression(property.initializer, variables);
    }
    return result;
  }
  if (ts.isTemplateExpression(expression)) {
    let value = expression.head.text;
    for (const span of expression.templateSpans) {
      const substitution = evaluateStaticExpression(span.expression, variables);
      if (typeof substitution !== "string" && typeof substitution !== "number") {
        throw new Error("Template substitutions must be strings or numbers");
      }
      value += substitution + span.literal.text;
    }
    return value;
  }
  throw new Error(`Unsupported static expression: ${ts.SyntaxKind[expression.kind]}`);
}

export function collectStaticVariables(sourceFile: ts.SourceFile): Map<string, StaticValue> {
  const variables = new Map<string, StaticValue>();

  function visit(node: ts.Node): void {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      try {
        variables.set(node.name.text, evaluateStaticExpression(node.initializer, variables));
      } catch {
        // Runtime values such as navigation hooks are intentionally ignored.
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return variables;
}
