import * as React from "react";
import renderer from "react-test-renderer";
import { StyleSheet, Text } from "react-native";

import { H2, P } from "../UI/typography/Typography";
import PrimaryButton from "../UI/buttons/PrimaryButton";
import HorizontalProgressBar from "../UI/horizontal_progress_bar/HorizontalProgressBar";

describe("shared accessibility foundations", () => {
  it("exposes headings and forwards live-region text props", () => {
    let headingRenderer: renderer.ReactTestRenderer;
    let statusRenderer: renderer.ReactTestRenderer;

    renderer.act(() => {
      headingRenderer = renderer.create(
        <H2 accessibilityLabel="כותרת נגישה">כותרת</H2>,
      );
      statusRenderer = renderer.create(
        <P accessibilityRole="alert" accessibilityLiveRegion="polite">שגיאה</P>,
      );
    });

    const heading = headingRenderer!.root.findByType(Text);
    const status = statusRenderer!.root.findByType(Text);

    expect(heading.props.accessibilityRole).toBe("header");
    expect(heading.props.accessibilityLabel).toBe("כותרת נגישה");
    expect(status.props.accessibilityRole).toBe("alert");
    expect(status.props.accessibilityLiveRegion).toBe("polite");
  });

  it("keeps primary actions large enough when text grows", () => {
    let component: renderer.ReactTestRenderer;
    renderer.act(() => {
      component = renderer.create(<PrimaryButton>המשך</PrimaryButton>);
    });
    const root = component!.root;
    const button = root.find(
      (node) =>
        node.props.accessibilityRole === "button" &&
        typeof node.props.style === "function",
    );
    const buttonStyle = StyleSheet.flatten(button.props.style({ pressed: false }));
    const label = root.findAllByType(Text).at(-1);
    const labelStyle = StyleSheet.flatten(label?.props.style);

    expect(button.props.accessibilityRole).toBe("button");
    expect(buttonStyle.minHeight).toBe(64);
    expect(buttonStyle.height).toBeUndefined();
    expect(labelStyle.color).toBe("#071A1D");
  });

  it("announces clamped progress values", () => {
    let component: renderer.ReactTestRenderer;
    renderer.act(() => {
      component = renderer.create(
        <HorizontalProgressBar percentage={130} accessibilityLabel="התקדמות בקורס" />,
      );
    });
    const root = component!.root;
    const progress = root.findByProps({ accessibilityRole: "progressbar" });

    expect(progress.props.accessibilityLabel).toBe("התקדמות בקורס");
    expect(progress.props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 100,
      text: "100%",
    });
  });
});
