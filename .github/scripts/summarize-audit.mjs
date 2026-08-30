import { readFile } from "node:fs/promises";

const [reportPath, scope = "dependency"] = process.argv.slice(2);
if (!reportPath) throw new Error("Usage: node summarize-audit.mjs REPORT_PATH [SCOPE]");

function commandValue(value) {
  return String(value)
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A")
    .slice(0, 1_000);
}

function legacyEntries(report) {
  return Object.values(report.advisories ?? {}).map((advisory) => ({
    name: advisory.module_name ?? "unknown",
    severity: advisory.severity ?? "unknown",
    direct: false,
    range: advisory.vulnerable_versions ?? "unknown",
    title: advisory.title ?? "Published security advisory",
    fix: advisory.patched_versions ? `patched in ${advisory.patched_versions}` : "review required",
  }));
}

function modernEntries(report) {
  return Object.values(report.vulnerabilities ?? {}).map((vulnerability) => {
    const advisory = (vulnerability.via ?? []).find((item) => typeof item === "object");
    const fix = vulnerability.fixAvailable === true
      ? "automatic fix available"
      : typeof vulnerability.fixAvailable === "object"
        ? `update to ${vulnerability.fixAvailable.name}@${vulnerability.fixAvailable.version}`
        : "no automatic fix available";
    return {
      name: vulnerability.name ?? advisory?.name ?? "unknown",
      severity: vulnerability.severity ?? advisory?.severity ?? "unknown",
      direct: Boolean(vulnerability.isDirect),
      range: vulnerability.range ?? advisory?.range ?? "unknown",
      title: advisory?.title ?? "Dependency is affected by a published advisory",
      fix,
    };
  });
}

let report;
try {
  report = JSON.parse(await readFile(reportPath, "utf8"));
} catch (error) {
  console.log(`::error title=${commandValue(`${scope} audit unavailable`)}::${commandValue(error.message)}`);
  process.exit(0);
}

const entries = report.vulnerabilities ? modernEntries(report) : legacyEntries(report);
const serious = entries.filter(({ severity }) => severity === "high" || severity === "critical");
for (const entry of serious.slice(0, 20)) {
  const relationship = entry.direct ? "direct" : "transitive";
  const title = commandValue(`${scope} audit: ${entry.name}`);
  const message = commandValue(`${entry.severity} ${relationship} dependency; affected ${entry.range}; ${entry.title}; ${entry.fix}`);
  console.log(`::error title=${title}::${message}`);
}
if (serious.length > 20) {
  console.log(`::error title=${commandValue(`${scope} audit`)}::${serious.length - 20} additional high/critical dependencies omitted`);
}
console.log(`${scope} audit summary: ${serious.length} high/critical vulnerable dependencies.`);
