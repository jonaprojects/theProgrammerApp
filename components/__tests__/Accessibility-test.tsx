import * as React from "react";
import renderer from "react-test-renderer";
import { Pressable, StyleSheet, Text } from "react-native";

import { H2, P } from "../UI/typography/Typography";
import PrimaryButton from "../UI/buttons/PrimaryButton";
import HorizontalProgressBar from "../UI/horizontal_progress_bar/HorizontalProgressBar";

describe("shared accessibility foundations", () => {
  it("exposes headings and forwards live-region text props", () => {
    const heading = renderer.create(
      <H2 accessibilityLabel="כותרת נגישה">כותרת</H2>,
    ).root.findByType(Text);
    const status = renderer.create(
      <P accessibilityRole="alert" accessibilityLiveRegion="polite">שגיאה</P>,
    ).root.findByType(Text);

    expect(heading.props.accessibilityRole).toBe("header");
    expect(heading.props.accessibilityLabel).toBe("כותרת נגישה");
    expect(status.props.accessibilityRole).toBe("alert");
    expect(status.props.accessibilityLiveRegion).toBe("polite");
  });

  it("keeps primary actions large enough when text grows", () => {
    const root = renderer.create(<PrimaryButton>המשך</PrimaryButton>).root;
    const button = root.findByType(Pressable);
    const buttonStyle = StyleSheet.flatten(button.props.style({ pressed: false }));
    const label = root.findAllByType(Text).at(-1);
    const labelStyle = StyleSheet.flatten(label?.props.style);

    expect(button.props.accessibilityRole).toBe("button");
    expect(buttonStyle.minHeight).toBe(64);
    expect(buttonStyle.height).toBeUndefined();
    expect(labelStyle.color).toBe("#071A1D");
  });

  it("announces clamped progress values", () => {
    const root = renderer.create(
      <HorizontalProgressBar percentage={130} accessibilityLabel="התקדמות בקורס" />,
    ).root;
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
