# RTL (Right-to-Left) Support Rule

This Shopify theme MUST be built with full RTL support from the beginning. RTL compatibility is not an optional enhancement and must be considered for every new feature, section, snippet, component, utility class, and stylesheet.

## Core Requirements

1. All new code must be RTL-compatible by default.
2. Never assume a left-to-right layout.
3. Avoid hardcoded directional properties whenever possible.
4. Use CSS logical properties instead of physical properties.
5. Every component must function correctly in both LTR and RTL layouts without requiring duplicate markup.

---

## Required CSS Logical Properties

Always prefer:

```scss
margin-inline-start
margin-inline-end

padding-inline-start
padding-inline-end

inset-inline-start
inset-inline-end

border-inline-start
border-inline-end

text-align: start;
text-align: end;
```

Instead of:

```scss
margin-left
margin-right

padding-left
padding-right

left
right

border-left
border-right

text-align: left
text-align: right
```

---

## Utility System Requirements

All spacing utilities must generate logical properties.

Examples:

```scss
.ms-16 {
  margin-inline-start: 16px;
}

.me-16 {
  margin-inline-end: 16px;
}

.ps-16 {
  padding-inline-start: 16px;
}

.pe-16 {
  padding-inline-end: 16px;
}
```

Avoid generating utilities that depend on:

```scss
.ml-*
.mr-*
.pl-*
.pr-*
.left-*
.right-*
```

unless they are automatically mapped to logical properties internally.

---

## Flexbox Rules

Use:

```scss
justify-content
align-items
gap
```

whenever possible.

Avoid direction-specific spacing hacks.

Example:

Good:

```html
<div class="flex items-center gap-12">
```

Bad:

```scss
.item {
  margin-right: 12px;
}
```

---

## Positioning Rules

Prefer:

```scss
inset-inline-start
inset-inline-end
```

instead of:

```scss
left
right
```

Example:

```scss
.drawer {
  inset-inline-start: 0;
}
```

---

## Text Alignment Rules

Use:

```scss
text-align: start;
text-align: end;
```

instead of:

```scss
text-align: left;
text-align: right;
```

---

## Icon Rules

Icons that represent direction must automatically flip in RTL.

Examples:

* Chevron arrows
* Pagination arrows
* Breadcrumb arrows
* Slider navigation arrows
* Back buttons
* Next buttons

Example:

```scss
[dir='rtl'] .icon-directional {
  transform: scaleX(-1);
}
```

---

## Grid & Layout Rules

Do not rely on:

```scss
grid-column-start
left offsets
right offsets
```

unless RTL behavior has been verified.

Use logical layout patterns whenever possible.

---

## Shopify Implementation Requirements

RTL detection should use:

```html
<html dir="{{ request.locale.iso_code | in: rtl_locales ? 'rtl' : 'ltr' }}">
```

or an equivalent Shopify locale-based solution.

All theme components must respect:

```html
dir="rtl"
```

without requiring additional theme settings.

---

## Component Development Checklist

Before completing any component:

* Verify spacing works in RTL.
* Verify text alignment works in RTL.
* Verify drawers work in RTL.
* Verify sliders work in RTL.
* Verify navigation works in RTL.
* Verify icons flip correctly.
* Verify forms display correctly.
* Verify mobile layout works in RTL.

---

## Code Review Rule

Before introducing any of the following:

```scss
left
right
margin-left
margin-right
padding-left
padding-right
border-left
border-right
```

verify that a logical-property alternative cannot be used.

Logical properties must always be the first choice.

RTL support is a mandatory requirement for all future code changes and should be treated as a core theme feature, not as a later enhancement.
