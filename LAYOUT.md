# Project Page Layout — Specification

This document defines the layout system for **project pages** only. It does not modify the landing page or project list. An implementing agent should treat the values below as authoritative.

The structural inspiration is the AP (`ap.ltd`) landing list (fixed left column + fluid right). The behavior of how images scale is **inverted** from AP: rather than image width filling the right column and height following aspect ratio, **image height stays consistent across rows and width is driven by aspect ratio**.

---

## 1. Scope

Apply this layout to **project detail pages** only. Each project page is a vertical stack of "project rows" (one per featured media item / section). Other pages (landing, about, etc.) are out of scope.

---

## 2. Design tokens

```
--col-left-width:       420px           /* left text column, fixed on desktop */
--col-gap:              8px             /* gap between left and right columns */
--row-gap:              24px            /* vertical spacing between project rows */
--page-pad-x-desktop:   24px            /* outer horizontal page padding (>=1024px) */
--page-pad-x-tablet:    16px            /* outer horizontal page padding (769–1023px) */
--page-pad-x-mobile:    12px            /* outer horizontal page padding (<=768px) */

--font-mono:            "Prestige 12 Pitch", "Courier 10 Pitch", monospace
--font-size-base:       12px
--line-height-base:     1.25
--text-color:           #000
--bg-color:             #fff
```

Breakpoints:

```
desktop:    >= 1024px
tablet:     769px – 1023px
mobile:     <= 768px
```

---

## 3. Row structure (the unit)

Each project section is a **row**. The row is a horizontal flex container with two children: the left text column and the right media column.

```
┌──────────── ROW ────────────────────────────────────────────────────┐
│  ┌── LEFT (420px) ──┐  ┌── RIGHT (calc(100% − 420px − 8px)) ─────┐ │
│  │ TOP META         │  │                                          │ │
│  │ 01 PROJECT NAME  │  │  ┌───────────────────────┐               │ │
│  │ SUBTITLE         │  │  │                       │               │ │
│  │ LOCATION/DATE    │  │  │       MEDIA           │               │ │
│  │                  │  │  │   (image / video)     │               │ │
│  │                  │  │  │                       │               │ │
│  │                  │  │  └───────────────────────┘               │ │
│  │                  │  │  ↑ left-aligned in column                │ │
│  │ BOTTOM DESC      │  │  ↑ height is the row height              │ │
│  │ (paragraph)      │  │  ↑ width = height × aspect ratio          │ │
│  └──────────────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Rules

- The row uses `display: flex; align-items: stretch;` so left and right columns share the same height.
- The row's height is **set by the media** in the right column (see §5).
- Successive rows are separated by `var(--row-gap)` (24px) of vertical spacing.

---

## 4. Left column

### Width
- Desktop: `width: 420px; flex-shrink: 0;`
- Tablet & mobile: `width: 100%`. Row collapses to a single column (see §6).

### Internal layout
The left column has two children: **top meta block** and **bottom description block**. They must be vertically separated so meta sits at the top of the row and description sits at the bottom of the row, aligned with the bottom edge of the media.

```css
.left-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

### Top meta block (always at top)
Three lines, monospace, no margin between lines (line-height 1.25). Format:

```
01 PROJECT NAME
SUBTITLE
LAUNCHED 2023 LOCATION
```

- The leading number (`01`, `02`, `03`...) is zero-padded and incremented per row. Implement with a CSS counter or pre-rendered.
- All text uppercase.
- All lines share the same monospace font, weight 700, 12px, line-height 1.25.

### Bottom description block (always at bottom)
A single paragraph (or short stack of paragraphs), monospace, same type spec as meta. No indentation. Width is the full 420px column. The block is anchored to the **bottom of the row** (which equals the bottom of the media on the right).

If the description is shorter than the row height, the gap appears between the meta block and the description (this is desired — see reference image).

---

## 5. Right column (media)

This is the section that differs most from AP. The behavior is:

- **Height of the media is consistent across all rows on the page.**
- **Width of the media depends on the media's intrinsic aspect ratio** (`width = height × aspect-ratio`).
- The media is **left-aligned** within the right column. If the media is narrower than the right column (e.g. portrait), whitespace fills the remaining right side.

### Implementation

```css
.right-column {
  width: calc(100% - 420px - 8px);
  display: flex;
  align-items: flex-start;   /* media sits at the top of the column */
  justify-content: flex-start; /* left-aligned, per spec */
}

.right-column .media {
  height: var(--media-height);
  width: auto;               /* width follows aspect ratio */
  max-width: 100%;           /* never overflow the column */
  display: block;
}
```

`.media` is the `<img>`, `<video>`, or `<iframe>`. For `<iframe>` you'll need a wrapper with explicit `aspect-ratio`.

### What is `--media-height`?

The height should approximate what AP's landing layout naturally produces: `right_column_width ÷ aspect_ratio` for a typical 4:3 landscape image. With a 420px left column at 1440px viewport, AP's image height comes out to roughly 720–780px. We encode this as a viewport-driven value so it scales:

```css
:root {
  /* Approximation of AP-style row height; tune the multiplier (0.75) to taste.
     Equivalent to "what a 4:3 image would be if it filled the right column". */
  --media-height: calc((100vw - 420px - 8px - var(--page-pad-x-desktop) * 2) * 0.75);
}

@media (max-width: 1023px) {
  :root { --media-height: auto; }   /* see responsive section */
}
```

If the implementing agent wants a hard ceiling so very wide viewports don't blow rows up, wrap with `min()`:

```css
--media-height: min(
  85vh,
  calc((100vw - 420px - 8px - 48px) * 0.75)
);
```

### Edge cases

- **Very wide media (panorama):** `max-width: 100%` clamps it to the column width. Height becomes `column_width ÷ aspect_ratio` and may end up shorter than `--media-height` for that one row. Acceptable.
- **Very tall media (portrait):** width becomes `--media-height × aspect_ratio` and is naturally narrower than the column — left-aligned, whitespace to the right. This matches the reference image (row 2 / Instagram screenshot).
- **Video / iframe:** wrap in a container with `aspect-ratio: <w> / <h>; height: var(--media-height); width: auto;`.

---

## 6. Responsive behavior

### Tablet (769–1023px) and mobile (<=768px)

The row collapses to a single column:

```css
@media (max-width: 1023px) {
  .row {
    flex-direction: column;
    gap: 8px;
  }
  .left-column,
  .right-column {
    width: 100%;
  }
  .left-column {
    /* meta on top, description below; no need for space-between when stacked */
    display: block;
  }
  .right-column .media {
    height: auto;
    width: 100%;            /* fills column on small screens */
    max-width: 100%;
  }
}
```

Page padding follows the tokens in §2 (`16px` tablet, `12px` mobile).

Row gap stays at `24px` across breakpoints unless explicitly changed.

---

## 7. Reference HTML (canonical)

Use this structure as the contract. Class names can be renamed as long as the structure and computed styles match.

```html
<article class="project-page">
  <section class="row">
    <div class="left-column">
      <header class="meta">
        <p>01 META REALITY LABS</p>
        <p>META STORE</p>
        <p>LAUNCHED 2023 BURLINGAME, CA</p>
      </header>
      <p class="description">
        I like the challenge. I like a good, meaty experience…
      </p>
    </div>

    <div class="right-column">
      <img class="media" src="…" alt="…" />
    </div>
  </section>

  <section class="row"> … </section>
  <section class="row"> … </section>
</article>
```

---

## 8. Reference CSS (canonical)

```css
:root {
  --col-left-width: 420px;
  --col-gap: 8px;
  --row-gap: 24px;
  --page-pad-x: 24px;
  --media-height: min(85vh, calc((100vw - var(--col-left-width) - var(--col-gap) - var(--page-pad-x) * 2) * 0.75));

  --font-mono: "Prestige 12 Pitch", "Courier 10 Pitch", monospace;
  --font-size-base: 12px;
  --line-height-base: 1.25;
}

.project-page {
  padding: 0 var(--page-pad-x);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: 700;
  color: #000;
}

.row {
  display: flex;
  align-items: stretch;
  gap: var(--col-gap);
  margin-bottom: var(--row-gap);
}
.row:last-child { margin-bottom: 0; }

.left-column {
  width: var(--col-left-width);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.left-column .meta p,
.left-column .description {
  margin: 0;
  text-transform: uppercase; /* meta only — remove from .description if body copy should remain mixed-case */
}

.left-column .description {
  text-transform: none; /* body copy stays as authored */
}

.right-column {
  width: calc(100% - var(--col-left-width) - var(--col-gap));
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.right-column .media {
  height: var(--media-height);
  width: auto;
  max-width: 100%;
  display: block;
}

@media (min-width: 769px) and (max-width: 1023px) {
  :root { --page-pad-x: 16px; }
}
@media (max-width: 768px) {
  :root { --page-pad-x: 12px; }
}

@media (max-width: 1023px) {
  .row { flex-direction: column; gap: 8px; }
  .left-column,
  .right-column { width: 100%; }
  .left-column { display: block; }
  .right-column .media {
    height: auto;
    width: 100%;
  }
}
```

---

## 9. Acceptance checklist

An implementation is correct when **all** of the following are true on a desktop viewport (>=1024px):

1. The left column of every project row is exactly **420px** wide and does not shrink.
2. The right column starts **428px from the left edge of the row** (`420px + 8px gap`).
3. Inside the left column, the meta block sits at the **top** and the description sits at the **bottom**, with the description's bottom edge aligned to the media's bottom edge.
4. Each row's media has the **same height** as every other row on the page (within ±1px), regardless of intrinsic aspect ratio.
5. A portrait/narrow image leaves visible whitespace on the **right** side of the right column (image is left-aligned).
6. A landscape image whose natural width would exceed the right column is clamped to the column width (and that row's height may be shorter than other rows).
7. Vertical gap between rows is **24px**.
8. At ≤1023px the row stacks vertically, both columns become 100% width, and media reverts to `width: 100%; height: auto`.

---

## 10. Notes for the implementing agent

- Don't introduce a CSS framework (Tailwind, Bootstrap, etc.) just to satisfy this layout — plain CSS / CSS Modules / Sass is enough.
- Don't use `position: absolute` to anchor the description to the bottom — use the flex `space-between` pattern in §4 so it stays in document flow and remains accessible.
- Don't set `object-fit: cover` on the media — it would crop content. `width: auto; height: …` preserves the full image.
- The `0.75` multiplier in `--media-height` is the only knob to tune row height. Increase it for taller rows, decrease for shorter. Do not hardcode a pixel height per row.
- If you add a hover/transition state for the media, keep the transitioned property to `opacity` — do not animate `width` or `height` (would jitter the row).
