# Utility Class Usage Rule

When modifying, refactoring, or creating any code in this Shopify theme, follow these rules strictly:

## Primary Rule

Always use the existing utility class system before writing new CSS.

### Required Workflow

1. First check whether an existing utility class can achieve the desired styling.
2. Prefer utility classes over component-specific CSS.
3. Combine multiple utility classes when possible instead of creating new CSS rules.
4. Reuse existing spacing, layout, typography, sizing, positioning, and display utilities.
5. Do not create duplicate CSS for styles already available through utilities.

## Allowed Cases for New CSS

New CSS may only be added when:

* The required style does not exist in the utility system.
* Complex component-specific styling is needed.
* Pseudo-elements (`::before`, `::after`) are required.
* Complex animations are required.
* State-based styling cannot be achieved with existing utilities.
* Shopify-specific dynamic behavior requires custom styling.

## Before Adding CSS

Always verify:

* No existing utility class provides the same result.
* No combination of existing utility classes can achieve the same result.
* The CSS is reusable and justified.

## Preferred Example

Good:

```html
<div class="flex items-center justify-between px-24 py-16">
```

Bad:

```scss
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}
```

## Component Styling Guidelines

Use custom CSS only for:

* Component structure
* Unique visual treatments
* Complex interactions
* Theme-specific functionality

Use utilities for:

* Spacing
* Display
* Flexbox
* Grid
* Width
* Height
* Position
* Typography
* Alignment
* Overflow
* Z-index
* Responsive behavior

## Code Review Requirements

For every code change:

1. Maximize utility class usage.
2. Minimize custom CSS.
3. Avoid duplicate declarations.
4. Keep CSS bundle size as small as possible.
5. Follow mobile-first development.
6. Maintain Shopify theme performance standards.

If a utility class exists, it MUST be used. Custom CSS should be considered a last resort.
