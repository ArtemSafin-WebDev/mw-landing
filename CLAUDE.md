# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # TypeScript check + Vite build
npm run preview    # Preview production build
npm run format     # Format with Prettier
npm run format:check  # Check formatting
```

## Architecture

This is a **Vite + Handlebars + TypeScript + SCSS** static multi-page landing site (Russian-language, for a digital agency).

### Page rendering
- Each `.html` file in the root is a separate page (auto-discovered by `glob.sync("*.html")` in `vite.config.ts`)
- Pages use Handlebars templating — partials live in `partials/`, page-specific data in `pages-data/`
- `pages.config.ts` maps page paths to their data context; `pages-data/globalContext.ts` provides shared data

### JS structure
- Single entry point: `src/js/main.ts` — initializes all modules on `DOMContentLoaded`
- Each feature is a module that exports a default function (e.g., `intro()`, `header()`, `forms()`)
- Animations use **GSAP** (ScrollTrigger for scroll-based effects, `gsap.matchMedia()` for responsive animations)
- Smooth scrolling via **Lenis** (`src/js/smoothScrolling.ts`)
- Lightbox/modal via **Fancybox** (`@fancyapps/ui`)
- Sliders via **Swiper**
- Forms use `axios` POST + a custom `Validator` class (`src/js/classes/Validator`)

### SCSS structure
- All partials imported in `src/scss/style.scss`
- `_media.scss` defines two mixins: `breakpoint($class)` (max-width) and `breakpointMF($class)` (min-width)
- `_utils.scss` defines layout mixins: `blockWrapper` (named-grid centering container) and `blockContent` (inner content column)
- `_variables.scss` defines CSS custom properties (colors, fonts, spacing)

### Breakpoints
| Name | Max-width |
|---|---|
| `large-desktop` | 1600px |
| `desktop` | 1400px |
| `tablet` | 1024px |
| `small-tablet` | 768px |
| `mobile` | 640px |
| `small-mobile` | 576px |

### Layout convention
Always use a **12-column grid** for layouts: each column `minmax(0, 1fr)`, gap equal to `--column-gap`.

### SVG icons
Icons placed in `src/icons/` are registered via `vite-plugin-svg-icons` with symbol ID `[name]` (no prefix).

### Key CSS variables
- `--primary-color: #ffdf58` — yellow accent
- `--text-color: #212121`
- `--column-gap: 2rem` (1rem on mobile)
- `--content-padding: 2rem`
- `--container-width: 180rem`
- `--dewi` and `--inter-display` — font family variables
