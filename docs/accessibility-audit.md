# Accessibility audit

Audit date: 2026-08-30  
Target: WCAG 2.2 Level AA, with 44 px mobile touch targets as the project convention.

## Scope

The audit covered the shared React Native/Expo components and representative web flows: authentication, home navigation, course cards, tutorial navigation, question controls, interactive tutorial exercises, progress indicators, leaderboard, multiplayer controls, loading/error feedback, keyboard focus, and responsive text behavior.

The rendered web checks used the local Expo build at `http://localhost:8082`. Static checks covered the native Android/iOS component props as well. This is an engineering audit, not a third-party accessibility certification.

## Resolved findings

| Severity | Area | Finding | Resolution |
| --- | --- | --- | --- |
| Critical | Typography | Shared text wrappers discarded screen-reader props, including heading roles, alerts, and live regions. | All typography variants now forward `TextProps`; H1–H6 expose heading roles and correct web heading levels. |
| High | Contrast | White text on the cyan primary color did not meet minimum text contrast. | Primary actions, active leaderboard tabs, retry actions, and cyan number badges now use dark text. |
| High | Keyboard | Web controls had no consistent, high-visibility focus indicator. | Added a 3 px cyan `:focus-visible` ring with offset. |
| High | Controls | Several pressables had no role, accessible name, selected state, or expanded state. | Added semantics to chips, collapsibles, tasks, tutorial navigation, topic cards, and code-order controls. |
| High | Questions | Multiple-choice groups were exposed as unrelated controls. | Added radio-group labels and preserved checked/disabled/correct states on each option. |
| High | Progress | Visual progress bars had no programmatic value and accepted out-of-range values. | Added named `progressbar` roles, min/max/current values, and clamping from 0–100%. |
| Medium | Touch targets | Fixed button heights could clip scaled text; several actions were under the 44 px mobile convention. | Replaced fixed heights with minimum heights and enlarged small auth, chip, match, reset, and tutorial targets. |
| Medium | Images | Decorative icons inside actionable cards could add noise to screen-reader output. | Marked decorative task, course-card, and next-page icons as hidden from accessibility. |
| Medium | Motion | Web animation did not honor reduced-motion preferences. | Added a global `prefers-reduced-motion` fallback for CSS animation and transitions. |
| Medium | Functionality | Task cards accepted an `onPress` callback but never invoked it. | The full task card is now one named, keyboard-operable button. |

## Verification performed

- TypeScript strict typecheck passes.
- Shared accessibility tests cover heading/live-region prop forwarding, scalable primary button sizing/contrast, and progress value clamping.
- Rendered auth screen exposes a heading, two named text fields, and two named buttons.
- Rendered target measurements: inputs 52 px high, primary action 64 px, account-switch action 44 px.
- Keyboard focus on a rendered input computed to a solid cyan outline with visible offset.

## Follow-up manual checks

These require real assistive-technology/device testing before claiming full conformance:

1. Complete every major flow with TalkBack on Android and VoiceOver on iOS.
2. Test web at 200% browser zoom and native maximum system font size for clipping or hidden actions.
3. Run keyboard-only journeys through authenticated tutorials, exercises, leaderboard, and multiplayer.
4. Recheck every future illustration/background for meaningful alternative text versus decorative hiding.
5. Add an automated web accessibility scanner to CI once the app has a stable seeded test login.

## References

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [How to Meet WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
