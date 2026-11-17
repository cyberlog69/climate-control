# ClimateSphere Design Direction

This file records the direction already present in the Android app, so changes stay inside it instead of inventing a new look. Source: `android/app/src/main/java/com/climatesphere/app/core/theme/` and the existing Compose screens.

**Reading this as:** a consumer weather instrument panel for Android users, in a skeuomorphic AMOLED instrument-cluster language, dial ENERGY 2 / RHYTHM 2 / MOTION 2.

## Identity

ClimateSphere presents weather as a physical instrument cluster, not a flat dashboard. Surfaces are machined panels, readouts sit in recessed wells, and status is signalled by small LEDs. The product should read as a field instrument that happens to be a phone app.

## Palette

Keep the active palette to these roles. Neutrals do not count against the limit.

| Role | Value | Use |
|---|---|---|
| Base | `#000000` | App background, AMOLED black |
| Surface | `#101726` gradient to `#0C1322` | Card bodies |
| Well | `#060A13` | Recessed metric wells |
| Readout | `#020914` | LCD panels |
| Accent | `#06B6D4` cyan | Primary accent, live status, focus |
| Neutral text | `#F8FAFC` / `#94A3B8` / `#7C8BA1` | Primary, secondary, tertiary text |
| Semantic | emerald `#10B981`, amber `#F59E0B`, red `#EF4444`, violet `#8B5CF6`, sky `#38BDF8` | Data meaning only, never decoration |
| Semantic text tints | red `#F87171`, violet `#A78BFA` | Same hues, lightened for text at 12sp or below on card surfaces |

Semantic colors are data encodings (air quality, risk, pressure trend, energy source). They are not a decorative rainbow and must not be assigned for variety. The two text tints exist only to clear 4.5:1 for small type; icons, borders and LCD accents keep the saturated values.

## Typography

Roboto through the Compose default family, because the app is a system-level utility and platform-native type keeps instrument labels legible. Sizes are fixed in `Type.kt`; do not fall back to Material defaults for `bodySmall`, `labelSmall`, `titleSmall`, `labelLarge`, or `headlineSmall`. The smallest type on screen is 10sp, used only for short instrument annotations.

Uppercase micro-labels with wide tracking are reserved for telemetry labels inside a well or LCD bay (for example `STATION PRESSURE`). They are not used for section headings outside those bays.

## Surfaces and depth

- `skeuoCard`: extruded card with a top bevel highlight and bottom shadow. One per content block.
- `skeuoRecessedWell`: sunken container for metrics and grouped values.
- `skeuoLcdPanel`: dark readout with an accent bezel. Only for the single most important number in a card.
- `skeuoPushButton`: the one action per card, or a selectable chip.
- `SkeuoLedDiode`: status light. Pulses only while something is genuinely live.

Depth encodes hierarchy: card equals block, well equals grouped data, LCD equals headline metric, button equals action. Never apply two depth treatments to the same element without a structural reason.

## Motion

`MOTION 2`: motion signals live data. The radar sweep, pulsing LEDs, and progress meters are the allowed motions. No entrance animations, no floating, no scale bounces. Anything that moves must mean "this is updating".

## Layout

`RHYTHM 2`: the home feed is a consistent vertical stack of cards with one hero at the top. Variation comes from card content type, not from changing the stack. Horizontal scrollers are limited to time series (hourly forecast) and item pickers (wildfire events).

## Rules for changes

1. No new colors. Use the roles above.
2. No new card style. Compose from the five surface modifiers.
3. Text must meet WCAG AA on the surface behind it. Tertiary text is `#7C8BA1` for that reason, and small red or violet text uses the lighter tints.
4. Every tappable target is at least 44dp tall.
5. Uppercase labels belong to instrument readouts, not to marketing copy.
6. Numbers are either measured, computed by a documented model and labelled as an estimate, or absent.
7. No em dashes in UI text.
8. A delta states a direction only when there is one. Zero difference reads "Same as ..." in neutral grey with a minus icon, never "+0" in green or red.
9. Numbers use thousands separators, carry their unit, and counts are pluralized ("1 saved city", "2 saved cities"). Negative values never double up with a word that already means negative.
10. Long content reflows before it truncates. Card titles, hazard titles, timestamps, and forecast conditions get the width they need or move to a second line; ellipsis is reserved for names the user can already infer.
11. Live status must be true. "Live" appears only when the current reading came from the network, and the timestamp under it is the real fetch time.
