# HTTT UEL UX Architecture Blueprint

## Status

- Owner: Product + Engineering
- Last update: 2026-04-17
- Scope: UX foundation for homepage, module navigation, article reading mode, and simulation mode

## Non-negotiable dependency order

1. Install typography foundation (Be Vietnam Pro + Geist Mono)
2. Define CSS theme tokens (light + dark)
3. Implement dark mode toggle + localStorage persistence
4. Apply article layout on top of tokens
5. Apply homepage/module layout on top of tokens

This order must not be inverted.

## Mandatory color tokens

Minimum required tokens for all new UI:

- `--color-bg`: `#F5F3EE` (light), `#0B1220` (dark)
- `--color-surface`: `#FFFFFF` (light), `#121A2A` (dark)
- `--color-text-primary`: `#111827` (light), `#E2E8F0` (dark)
- `--color-text-secondary`: `#475569` (light), `#94A3B8` (dark)
- `--color-accent`: `#0F766E` (light), `#14B8A6` (dark)

Optional support token:

- `--color-border`: `#D4D4D8` (light), `#243247` (dark)

## URL structure standard

Primary structure is subject-first:

- Subject hub: `/hoc-phan/[subject-slug]`
- Article: `/hoc-phan/[subject-slug]/[post-slug]`
- Simulation: `/hoc-phan/[subject-slug]/sim/[simulation-slug]`

Current legacy route `/articles/[slug]` can remain temporarily, but should redirect to subject-first URLs once subject mapping is complete.

## Measurement and KPI updates

### Replace weak KPI

- Do not use bounce rate as quality proxy for long-form study pages.
- Use custom engagement metrics:
  - `scroll_depth_80`
  - `time_on_page_120s`
  - `toc_click`
  - `module_expand_click`

### Tooling requirement

- Add session replay and heatmap for module discovery UX:
  - Preferred: Microsoft Clarity (free)
  - Alternative: Hotjar free tier

### UX metric clarification

- Metric "find correct subject in <= 5s" is validated via replay sampling and usability sessions, not plain analytics dashboards.

## Simulation mobile fallback rule

Every simulation page must include a fallback block before release:

- Required component: `MobileStaticFallback`
- Required behavior:
  - Show static diagram/image on small screens
  - Show message: full interaction recommended on desktop
  - Keep access to conceptual explanation on mobile

Simulation page is not "done" without this fallback.

## Delivery split

### Phase A1 (foundation)

- Fonts only
- Tokens only
- Theme toggle only
- No structural layout changes

### Phase A2 (layout)

- Article one-column reading layout
- Homepage module-first IA
- Subject page expansion flow

Each phase must be deployed and validated independently before moving to the next.
