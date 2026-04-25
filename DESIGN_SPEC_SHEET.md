# Website Design Spec Sheet (Reusable Context)

This spec captures the visual and layout system used in the current site so another agent can reproduce the same feel in a new build.

## 1) Design System Specifics

### Foundations
- **Styling model:** utility-first CSS (Tachyons-like), with project-specific utility extensions
- **Layout engine:** Flexbox + percentage width classes (not CSS Grid)
- **Box model:** `box-sizing: border-box` globally
- **Root sizing:** `html { font-size: 10px; overflow: hidden; }`
- **Base body type:** `html body { font-family: Quadrant, Courier New, serif; font-size: 1.6rem; line-height: 1.2; }`

### Typography
- **Primary typeface:** `Quadrant` (custom font-face), fallback `Courier New, serif`
- **Secondary typeface:** `Roma` (custom font-face), fallback `Helvetica, serif`
- **Default running text utility:** `.def-text { font-family: Quadrant; font-size: 1.6rem; line-height: 1.2; }`
- **Secondary/emphasis utility:** `.secondary-text { font-family: Roma; font-size: 2.7rem; line-height: 1.2; }`

### Type Scale (utility classes)
Using root `10px`, these map to:

- `.f1` = `3rem` (30px)
- `.f2` = `2.25rem` (22.5px)
- `.f3` = `1.5rem` (15px)
- `.f4` = `1.25rem` (12.5px)
- `.f5` = `1rem` (10px)
- `.f6` = `0.875rem` (8.75px)
- `.f7` = `0.75rem` (7.5px)

### Color System
Core palette is intentionally minimal:

- **Primary text:** black (`#000`)
- **Base background:** white (`#fff`)
- **Accent/action:** red (`red`)
- **Muted text:** light grey (`#c4c4c4`)
- **Neutral placeholder tone:** `#e6e6e6` (seen in loading/placeholder states)

Behavioral cues:
- Desktop hover uses red accent for links
- Inputs/caret and some cursor indicators use red

### Spacing Scale
Global spacing uses utility steps:

- `1 = 0.25rem` (2.5px)
- `2 = 0.5rem` (5px)
- `3 = 1rem` (10px)
- `4 = 2rem` (20px)
- `5 = 4rem` (40px)
- `6 = 8rem` (80px)
- `7 = 16rem` (160px)

Project-specific defaults:
- `*-def` classes are **1.5rem** (15px), e.g. `.pa-def`, `.ph-def`
- `*-font-size` classes are **1.6rem** (16px), used where spacing aligns to body text rhythm

## 2) Guidance on Overall Aesthetics

### Visual Direction
- **Editorial / studio portfolio feel**
- **Sparse, high-contrast composition:** mostly black text on white space
- **Minimal color:** accent red appears selectively for interaction and emphasis
- **Typography-led identity:** custom serif fonts carry brand personality

### Composition Rules
- Favor generous negative space, especially vertically
- Keep component chrome minimal (few heavy borders/background blocks)
- Use motion sparingly (small opacity/translate transitions around nav and media)
- Preserve a "quiet UI": typography and image content should dominate over UI decoration

### Interaction Feel
- Cursor and hover interactions should feel deliberate, not playful/noisy
- Transitional timings are short (~0.3s is common in source)
- Scroll areas and fixed nav behavior should feel smooth and restrained

## 3) Layout Specifics

### Responsive Breakpoints
This codebase mixes two breakpoint families:

- **Tachyons-style:** `30em`, `60em`
- **Project overrides:** `480px`, `768px`, `992px`

Most major desktop switches happen at **`992px`**.

### Grid / Column System
- **Core paradigm:** width utilities + flex containers
- **Fraction utilities:** `.w-third` (33.333%), `.w-two-thirds` (66.667%)
- **12-column utilities present:** `.w-1-12`, `.w-2-12`, `.w-5-12`, `.w-7-12`, `.w-10-12`, `.w-11-12`
- **Offset utilities present:** `.offset-1-12`, `.offset-2-12`, etc.

### Canonical Page Split
The key desktop shell uses:

- Parent wrapper: `page-wrap w-100 flex`
- Left panel: `w-100 w-two-thirds-l`
- Right panel: `w-100 w-third-l`

Interpretation:
- **Mobile/tablet:** stacked full-width sections
- **Large desktop:** persistent **2/3 : 1/3 split**

### Section Spacing / Gutters
Observed panel spacing:

- Left panel mobile: `padding: 5rem 1.5rem 10rem`
- Right panel mobile: `padding: 5rem 1.5rem 20rem`
- At `>= 992px`, both normalize to `padding: 1.5rem`

Use this pattern as guidance:
- Big top/bottom breathing room on small screens
- Tight, consistent desktop gutters (15px)

### Content + Navigation Behavior
- Left and right panels are scrollable regions (`max-height: 100vh`)
- Fixed nav bars slide in/out via translateY
- Some mobile-specific bottom padding is removed at desktop breakpoint

## 4) Additional Implementation Details (Important)

### Do This in a Rebuild
- Use a utility class architecture rather than deeply nested component CSS
- Keep root font-size at 10px if you want identical rem-to-px behavior
- Implement the 2/3 + 1/3 desktop shell first; stack to 100% widths on small screens
- Keep color palette tightly constrained (black, white, red, light grey)
- Recreate the `1.5rem` default gutter as a first-class spacing token

### Avoid
- Avoid introducing colorful UI surfaces or gradients; it breaks the aesthetic
- Avoid dense card-based layouts with heavy boxes/shadows
- Avoid over-animated interactions; keep transitions subtle and fast
- Avoid replacing utility spacing with many one-off pixel values

### Suggested Token Contract (for another agent)
If recreating in Tailwind/CSS variables, define:

- `--color-text: #000`
- `--color-bg: #fff`
- `--color-accent: red`
- `--color-muted: #c4c4c4`
- `--space-default: 1.5rem`
- `--space-text-rhythm: 1.6rem`
- `--layout-left-desktop: 66.6667%`
- `--layout-right-desktop: 33.3333%`
- `--bp-desktop: 992px`

### Quick Build Recipe
1. Create root shell with a flex wrapper and two panels.
2. Make both panels `width: 100%` below desktop; switch to `2/3 + 1/3` at desktop.
3. Apply `1.5rem` horizontal padding as default gutter.
4. Set typography defaults to Quadrant-style primary, Roma-style secondary.
5. Restrict palette to monochrome + red accent.
6. Add minimal transitions (~0.3s) for nav visibility/media loading.

---

This spec is intentionally implementation-oriented so another coding agent can reproduce the style system quickly with high visual fidelity.
