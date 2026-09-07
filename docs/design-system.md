# Opportunity Board — Design System

> Extracted from the official Stitch project: "Opportunity Board UI/UX Design"

## Brand & Style

The design system embodies a modern, focused, and empowering digital environment for students and early-career professionals. The aesthetic converges clean SaaS utility with modern editorial discovery: purposeful whitespace, precise typographic hierarchies, subtle ambient light cues, and crisp micro-surfaces.

**Emotional Tone:** High-trust institutional credibility balanced with vibrant student enthusiasm. Absolute clarity through scannable card patterns, distinct urgency cues, and tactile interactive feedback.

---

## Colors

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#3525CD` | Brand anchor, primary buttons, active states |
| `primary-container` | `#4F46E5` | Button fills, CTA backgrounds, active navigation |
| `on-primary` | `#FFFFFF` | Text/icons on primary surfaces |
| `on-primary-container` | `#DAD7FF` | Text on primary container |
| `primary-fixed` | `#E2DFFF` | Light tint backgrounds for badges |
| `primary-fixed-dim` | `#C3C0FF` | Dimmed primary tint |

### Secondary (Success / Open Status)

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#006C49` | Verified badges, open/active status |
| `secondary-container` | `#6CF8BB` | Success badge backgrounds, saved count |
| `on-secondary` | `#FFFFFF` | Text on secondary |
| `secondary-fixed-dim` | `#4EDEA3` | Online indicators |

### Tertiary (Informational)

| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary` | `#004D70` | Informational callouts, mentorship tags |
| `tertiary-container` | `#006693` | Tertiary badge backgrounds |
| `tertiary-fixed` | `#C9E6FF` | Light informational backgrounds |

### Error & Urgency

| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#BA1A1A` | Deadline urgency, critical alerts |
| `error-container` | `#FFDAD6` | Urgent badge backgrounds |
| `on-error` | `#FFFFFF` | Text on error |

### Urgency Accent Colors (Functional)

| Context | Background | Text | Usage |
|---------|-----------|------|-------|
| Closing Soon (7 days) | Amber `#FFFBEB` | `#B45309` | Warning deadline badges |
| Immediate (24-48h) | Rose `#FEF2F2` | `#B91C1C` | Critical deadline badges |

### Neutral & Surface System

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#FAF8FF` | App canvas background |
| `surface-container-lowest` | `#FFFFFF` | Card backgrounds, elevated surfaces |
| `surface-container-low` | `#F2F3FF` | Input backgrounds, section fills |
| `surface-container` | `#EAEDFF` | Chip backgrounds, dividers |
| `surface-container-high` | `#E2E7FF` | Hover states, tag backgrounds |
| `surface-container-highest` | `#DAE2FD` | Strong surface emphasis |
| `on-surface` | `#131B2E` | Primary text, headings |
| `on-surface-variant` | `#464555` | Secondary text, metadata |
| `outline` | `#777587` | Placeholder text, borders |
| `outline-variant` | `#C7C4D8` | Subtle dividers |

---

## Typography

**Font Family:** Plus Jakarta Sans (all weights: 400, 600, 700, 800)

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display-hero` | 3.5rem (56px) | 800 | 4.25rem | -0.03em | Landing page hero |
| `display-hero-mobile` | 2.25rem (36px) | 800 | 2.75rem | -0.025em | Mobile hero |
| `headline-xl` | 2.25rem (36px) | 700 | 2.75rem | -0.02em | Page titles |
| `headline-xl-mobile` | 1.75rem (28px) | 700 | 2.25rem | -0.02em | Mobile page titles |
| `headline-lg` | 1.5rem (24px) | 700 | 2rem | -0.015em | Section headings |
| `headline-md` | 1.25rem (20px) | 600 | 1.75rem | -0.01em | Card section headers |
| `headline-sm` | 1.125rem (18px) | 600 | 1.5rem | -0.005em | Card titles, sub-headers |
| `body-lg` | 1.125rem (18px) | 400 | 1.75rem | — | Descriptions, long text |
| `body-md` | 1rem (16px) | 400 | 1.5rem | — | Body text, form inputs |
| `body-sm` | 0.875rem (14px) | 400 | 1.25rem | — | Metadata, helper text |
| `label-lg` | 0.875rem (14px) | 600 | 1.25rem | 0.01em | Navigation, button labels |
| `label-md` | 0.75rem (12px) | 600 | 1rem | 0.02em | Badges, counts |
| `label-caps` | 0.6875rem (11px) | 700 | 0.875rem | 0.08em | Uppercase section labels |

---

## Spacing (8-point Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-3xs` | 0.125rem (2px) | Micro gaps, badge padding |
| `space-2xs` | 0.25rem (4px) | Tight gaps, icon spacing |
| `space-xs` | 0.5rem (8px) | Chip padding, compact gaps |
| `space-sm` | 0.75rem (12px) | Button padding, card gaps |
| `space-md` | 1rem (16px) | Standard component spacing |
| `space-lg` | 1.5rem (24px) | Section padding, card padding |
| `space-xl` | 2rem (32px) | Major section gaps |
| `space-2xl` | 3rem (48px) | Page section spacing |
| `space-3xl` | 4rem (64px) | Hero spacing |

### Layout Margins

| Token | Value | Usage |
|-------|-------|-------|
| `margin-mobile` | 1rem | Mobile page margins |
| `margin-tablet` | 2rem | Tablet page margins |
| `margin-desktop` | 3rem | Desktop page margins |
| `gutter-mobile` | 1rem | Mobile grid gutters |
| `gutter-desktop` | 1.5rem | Desktop grid gutters |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `DEFAULT` | 0.25rem (4px) | Micro elements |
| `rounded` | 0.5rem (8px) | Buttons, inputs, badges |
| `rounded-lg` | 0.75rem (12px) | Navigation pills |
| `rounded-xl` | 1rem (16px) | Cards, panels |
| `rounded-2xl` | 1.5rem (24px) | Modal dialogs, hero sections |
| `rounded-full` | 9999px | Avatars, pill badges, status dots |

---

## Elevation & Shadows

| Level | Usage | Shadow |
|-------|-------|--------|
| **L0** (Base) | App canvas | Flat `#F8FAFC` |
| **L1** (Cards) | Opportunity cards, panels | `0 1px 3px rgba(15,23,42,0.04), 0 1px 2px -1px rgba(15,23,42,0.02)` |
| **L2** (Hover) | Card hover, interactive focus | `0 10px 25px -3px rgba(79,70,229,0.08), 0 4px 6px -4px rgba(15,23,42,0.04)` |
| **L3** (Flyouts) | Filter drawers, dropdowns | `0 20px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.03)` |
| **L4** (Modals) | Dialog overlays | `0 25px 50px -12px rgba(15,23,42,0.2)` with `backdrop-blur(8px)` |

---

## Buttons

### Primary Button
- Background: `#4F46E5` (primary-container)
- Text: `#FFFFFF` (on-primary)
- Radius: `0.75rem` (rounded-xl)
- Height: 40px desktop / 44px touch
- Hover: `#3525CD` (primary)
- Active: `scale(0.98)`
- Shadow: `0 2px 8px rgba(79,70,229,0.25)`

### Secondary / Ghost Button
- Background: `#F2F3FF` (surface-container-low)
- Text: `#4F46E5`
- Hover: `#EAEDFF` (surface-container)

### Outline / Filter Button
- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Text: `#131B2E`
- Hover: `#F8FAFC`

### Bookmark Toggle
- Size: 36px circle
- Unselected: stroke `#64748B`
- Selected: fill `#4F46E5` with micro-bounce

---

## Inputs

### Standard Text Input
- Height: 48px (h-12)
- Background: `surface-container-lowest` (#FFFFFF)
- Border: implicit via shadow-sm
- Radius: `rounded-lg` (8px)
- Placeholder: `outline` color at 60% opacity
- Focus: `ring-2 ring-primary-container`, background shifts to `surface-bright`

### Hero Search Input
- Height: 52px
- Background: `#FFFFFF`
- Left icon: search lens in `#94A3B8`
- Focus: `3px rgba(79,70,229,0.2)` ring with `#6366F1` border

---

## Cards

### Opportunity Card
- Background: `#FFFFFF` (surface-container-lowest)
- Radius: `1rem` (rounded-2xl)
- Border: `1px solid #E2E8F0`
- Padding: `space-lg` (24px)
- **Header:** 44px circular org avatar + title + org name + bookmark toggle
- **Meta Row:** Horizontal tag chips (location, stipend, field)
- **Footer:** Deadline pill + "View Details" CTA
- **Hover:** `translateY(-2px)`, border → `#C7D2FE`, shadow → L2

---

## Status Badges & Chips

| Type | Background | Text | Icon |
|------|-----------|------|------|
| Open / Active | `#ECFDF5` | `#047857` | 6px pulsing green dot |
| Closing Soon | `#FFFBEB` | `#B45309` | Clock icon |
| Deadline Immediate | `#FEF2F2` | `#B91C1C` | Alarm icon |
| New | `#EEF2FF` | `#4338CA` | — |
| Category (selected) | `#4F46E5` | `#FFFFFF` | Dismiss ✕ |
| Category (default) | `#F1F5F9` | `#475569` | — |

---

## Responsive Breakpoints

| Breakpoint | Width | Grid | Gutters | Margins |
|-----------|-------|------|---------|---------|
| Mobile | 320px–767px | 4-column | 16px | 16px |
| Tablet | 768px–1023px | 8-column | 20px | 32px |
| Desktop | 1280px+ | 12-column | 24px | 48px |

### Layout Rules
- **Desktop:** 12-col grid, max-width `1280px` (max-w-7xl). Discover uses 4:8 split (filters : feed)
- **Tablet:** Filters collapse to slide-over drawer. Cards in 2-col grid
- **Mobile:** Single-column cards. Category chips in horizontal scroll. Sticky mobile nav

---

## Icons

**Icon Library:** Google Material Symbols Outlined
- Weight: 400
- Fill: 0
- Size: 18px–24px depending on context
- Color: Inherits from text color token

---

## Accessibility Considerations

- WCAG AA contrast ratios for all text/background combinations
- Focus rings: `2px solid #6366F1` with 2px offset
- Touch targets: minimum 44px on mobile
- Semantic HTML: proper heading hierarchy, ARIA labels on icon buttons
- Keyboard navigation: all interactive elements focusable
- Screen reader: descriptive alt text, aria-labels on icon-only buttons
