---
name: WiNGHacks
description: University of Florida's premier gender-focused hackathon celebrating inclusivity, creativity, and technology.
colors:
  primary: "#43683e"
  primary-deep: "#294c39"
  muted: "#52634a"
  cream-bg: "#f7f7e5"
  surface-card: "#fffefb"
  surface-subtle: "#fffbed"
  sidebar-bg: "#edf0d8"
  peach: "#f3b6aa"
  lavender: "#d5c1ec"
  sage: "#dce7c7"
  buttercup: "#f6d98d"
  sky: "#acd1e8"
  rose: "#ebb4c9"
  border-line: "rgba(41, 76, 57, 0.15)"
  ink: "#203628"
typography:
  display:
    fontFamily: "MeadowBubble, sans-serif"
    fontSize: "clamp(36px, 4.5vw, 64px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "MeadowFriendly, MeadowSans, sans-serif"
    fontSize: "clamp(26px, 2.8vw, 36px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "26px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "28px 32px"
---

# Design System: WiNGHacks

## Overview

**Creative North Star: "The Pastel Meadow Sanctuary"**

WiNGHacks is designed as an inviting, organic digital meadow: warm, handcrafted, and welcoming to hackers of all experience levels. It moves away from cold, corporate developer conventions and sterile dark-mode dashboards, replacing them with a sunlit, earthy aesthetic anchored by deep forest greens, soft cream canvases, and playful wildflower pastel accents.

The design embodies gentle authority. Forms and review portals are crisp, scannable, and robust, while brand touchpoints remain playful and approachable. High visual contrast between dark pine ink (`#203628`) and warm paper surfaces (`#fffefb` / `#f7f7e5`) ensures accessibility without losing whimsy.

**Key Characteristics:**
- **Warm & Organic Palette:** Deep woodland evergreen paired with soft meadow creams, wildflower lavenders, and peaches.
- **Friendly Geometry:** Softly curved cards (20–26px border radius) and tactile pill buttons (999px radius).
- **Dual-Voice Typography:** Expressive, bubbly letterforms (`MeadowBubble`, `MeadowFriendly`) for hero brand moments; clean, high-legibility native system fonts for forms, reviews, and data tables.
- **Tonal Layering Over Heavy Shadows:** Subtle 1px borders and gentle ambient depth instead of heavy, dramatic drop shadows.

---

## Colors

The WiNGHacks palette is inspired by a sunny wildflower meadow surrounded by a pine forest canopy.

### Primary
- **Forest Pine** (`#294c39` / `#203628`): Core ink and brand mark text. Grounding, high-contrast, and organic.
- **Evergreen Accent** (`#43683e` / `#385d45`): Action color for primary buttons, active links, and confirmed progress indicators.

### Pastels & Accents
- **Meadow Peach** (`#f3b6aa`): Used for warning highlights, playful wordmark letters, and warm accents.
- **Wildflower Lavender** (`#d5c1ec` / `#e6ddf0`): Selection highlights, review status tags, and decorative badges.
- **Spring Sage** (`#dce7c7`): Soft container backgrounds, accepted status badges, and interactive hovers.
- **Buttercup Yellow** (`#f6d98d` / `#fffbed`): Highlight banners, pending decision chips, and warm card tints.
- **Sky Blue** (`#acd1e8` / `#e0f2fe`): Informational chips, waitlisted tags, and cool contrast accents.

### Neutral
- **Sunny Meadow Canvas** (`#f7f7e5` / `#f5f5cf`): Root background color for the application shell and portals.
- **Warm Paper Surface** (`#fffefb`): Main card backgrounds, modal containers, and elevated surfaces.
- **Sidebar Sage** (`#edf0d8`): Grounded container background for the portal navigation sidebar.
- **Forest Boundary Line** (`rgba(41, 76, 57, 0.15)` / `#e5ebe2`): 1px subtle separation for card edges, dividers, and inputs.
- **Muted Sage Text** (`#52634a` / `#5c6e59`): Secondary descriptions, input captions, and metadata labels.

### Named Rules
**The Natural Light Rule.** Backgrounds are warm and light (`#f7f7e5` / `#fffefb`), and text is dark evergreen pine (`#203628`). Never use pure pitch black (`#000000`) or harsh stark white (`#ffffff`) as un-tinted slabs.

**The Pastel Wordmark Rule.** The "WiNGHacks" bubble wordmark cycles across 9 distinct pastel character hues, outlined with a 1px forest green stroke and 2px drop-offset shadow.

---

## Typography

**Display Font:** `MeadowBubble` (custom bubbly bold display face)  
**Brand Headline Font:** `MeadowFriendly` / `MeadowSans` (`SourGummy-Variable.ttf`)  
**Functional Body & Form Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

**Character:** Playful, rounded, and celebratory in headlines; clear, neutral, and effortlessly legible in forms, reviews, and data tables.

### Hierarchy
- **Display** (800 weight, `clamp(36px, 4.5vw, 64px)`, line-height 1.1): Hero headlines, welcome headers, wordmark.
- **Headline** (800 weight, `clamp(24px, 2.5vw, 36px)`, line-height 1.2): Section titles, modal headers, major card headings.
- **Title** (650 weight, 18px–22px, line-height 1.35): Subsection titles, applicant names, accordion headers.
- **Body** (400–500 weight, 14px–16px, line-height 1.65): Explanatory text, essay reading blocks, form hints. Max line length 65–75ch.
- **Label** (700 weight, 11px–12px, letter-spacing 0.12em, uppercase): Field labels, kicker breadcrumbs, status chips.

### Named Rules
**The Dual-Voice Rule.** Expressive rounded display fonts belong to public-facing brand moments and dashboard welcome headers. All data-entry inputs, essays, applicant review records, and admin tables must strictly use the native system sans-serif stack to maintain maximum legibility and zero cognitive fatigue.

---

## Layout

- **Shell:** Sidebar layout with sticky 250px left navigation and fluid responsive main canvas (max-width 1440px).
- **Responsive Breakpoint (640px):** On mobile devices, the sidebar collapses into a compact vertical icon bar (76px width), and grids transition to a single-column stack.
- **Card Rhythm:** Vertical stack of cards with 24px–32px gap. Generous internal padding (`clamp(20px, 3.5vw, 36px)`).
- **Form Grid:** 2-column responsive layout for compact fields (Names, Location, Discord); single-column wide layout for URLs and textareas.

---

## Elevation & Depth

WiNGHacks embraces **tonal layering** rather than aggressive multi-tier drop shadows. Depth is communicated primarily through distinct pastel surface fills and subtle 1px border outlines.

### Shadow Vocabulary
- **Card Resting** (`box-shadow: 0 4px 20px rgba(32, 54, 40, 0.04)`): Diffuse, barely-there ambient lift on paper cards against the cream background.
- **Interactive Hover** (`box-shadow: 0 6px 24px rgba(32, 54, 40, 0.08)`): Gentle rise when hovering interactive cards or buttons.
- **Bubble Wordmark 3D Accent** (`text-shadow: 0 2px 0 #466340`): Tactile sticker effect for brand lettering.

### Named Rules
**The Tactile Sticker Rule.** Elevated components feel like soft paper cutouts resting on meadow grass, bounded by fine 1px organic lines rather than heavy dark drop shadows.

---

## Shapes

- **Pill Silhouette:** Badges, tags, filter chips, and primary buttons always use full pill radius (`border-radius: 999px`).
- **Soft Containers:** Cards, modal dialogs, and sections use generous rounded corners (`border-radius: 20px` to `26px`).
- **Form Controls:** Inputs, selects, and textareas use a tactile medium radius (`border-radius: 12px` to `14px`).

---

## Components

### Buttons
- **Shape:** Full pill (`999px`) for action buttons; soft rounded (`12px`) for utility/table action buttons.
- **Primary:** Forest green background (`#43683e`), white text, 12px 24px padding. Hover: `#294c39`.
- **Secondary:** White/paper background, 1px border (`rgba(32, 54, 40, 0.2)`), dark pine text. Hover: `#f4f6f2`.
- **Destructive:** Soft rose background (`#fdf2f2`), red text (`#a82a2a`), border `#e2b3b3`.

### Cards
- **Corner Style:** `border-radius: 20px` to `26px`.
- **Background:** Warm Paper (`#fffefb`).
- **Border:** `1px solid rgba(32, 54, 40, 0.12)`.
- **Padding:** 28px to 36px.

### Inputs & Fields
- **Style:** 1px border (`rgba(32, 54, 40, 0.18)`), background `#ffffff`, radius `12px`, padding `12px 14px`.
- **Focus Ring:** 3px soft green glow (`box-shadow: 0 0 0 3px rgba(56, 93, 69, 0.15)`), border `#385d45`.
- **Error State:** Border `#a53c30` with inline descriptive error text positioned directly below the input container.

### Status Badges & Chips
- **Accepted:** Background `#dcfce7`, text `#166534`.
- **In Review:** Background `#ede9fe`, text `#5b21b6`.
- **Pending:** Background `#fef3c7`, text `#92400e`.
- **Waitlisted:** Background `#e0f2fe`, text `#0369a1`.
- **Rejected:** Background `#fee2e2`, text `#991b1b`.

### Accordion Review Rows
- **Header:** Full-width clickable strip with subtitle, incomplete status pill, and chevron indicator.
- **Items:** Two-column definition list (`dt` label, `dd` response) with inline edit trigger icon.
- **Essays:** Full-width spacious reading card with question title, character counter, and multi-line reading block.

---

## Do's and Don'ts

### Do:
- **Do** use warm cream (`#f7f7e5`) as the main canvas background and warm paper (`#fffefb`) for cards.
- **Do** render status badges as rounded pill chips (`border-radius: 999px`) with matched pastel backgrounds and dark readable text.
- **Do** position error messages directly beneath the respective form container or input element.
- **Do** use native sans-serif typography for dense forms, review workspaces, tables, and long-form responses.
- **Do** provide clear character counts and enforce input character bounds on text fields and textareas.

### Don't:
- **Don't** use generic dark-mode palettes, cold slate grays, or neon blues.
- **Don't** use sharp rectangular corners (`border-radius: 0`) for buttons, cards, or inputs.
- **Don't** render non-boolean expressions like `{count && ...}` in JSX that can accidentally render `0` as visible text on the page.
- **Don't** place global draft error alerts floating outside the main card container.
- **Don't** use decorative display fonts for long-form answers, table text, or administrative forms.

