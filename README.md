# Personal Homepage

A modular personal homepage template built with Vue 3, Vite, and TypeScript.

This project is designed for a clean single-page landing experience with:

- responsive layout for desktop, tablet, and mobile
- light and dark theme support
- shared top navigation and mobile drawer
- animated hero section with image gallery
- standalone `About` page
- modular data and style organization for long-term maintenance

## Preview

- Home: `/`
- About: `/about.html`

## Features

- Vue 3 + Vite + TypeScript
- Multi-entry build (`index.html` and `about.html`)
- Shared app shell for header, drawer, footer, and layout metrics
- Split data modules for profile, links, media, and site settings
- Layered CSS structure with tokens, base, layout, components, and pages
- Configurable hero gallery with local assets or remote image URLs

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Lucide Vue

## Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```text
src/
├─ assets/                 Static assets
│  └─ gallery/             Hero gallery images
├─ components/
│  ├─ site/                Shared site-level UI
│  ├─ HeroGallery.vue      Hero gallery component
│  └─ ThemeToggle.vue      Theme switch button
├─ composables/
│  ├─ useLayoutMetrics.ts  Sync header/footer height to CSS variables
│  ├─ useRevealOnScroll.ts Reveal animation helper
│  └─ useTheme.ts          Theme state and persistence
├─ data/
│  ├─ index.ts             Aggregated exports
│  ├─ links.ts             Navigation and button links
│  ├─ media.ts             Hero gallery source config
│  ├─ profile.ts           Profile text content
│  ├─ site.ts              Footer / site-level settings
│  └─ types.ts             Shared types
├─ layout/
│  └─ AppShell.vue         Shared page shell
├─ sections/
│  └─ HeroSection.vue      Home hero content
├─ styles/
│  ├─ tokens.css
│  ├─ base.css
│  ├─ layout/
│  ├─ components/
│  └─ pages/
├─ AboutPage.vue
├─ App.vue
├─ about.ts
├─ main.ts
└─ style.css
```

## Configuration

Most customization happens in the `src/data` directory.

### Profile Content

Edit:

- `src/data/profile.ts`

Common fields:

- `profile.name`
- `profile.title`
- `profile.subtitle`
- `profile.description`
- `aboutParagraphs`

### Navigation and Buttons

Edit:

- `src/data/links.ts`

Used by:

- desktop top navigation
- mobile drawer
- home action buttons

### Hero Images

Edit:

- `src/data/media.ts`

Default behavior:

- auto-detect images from `src/assets/gallery/`

Supported local file patterns:

- `png`
- `jpg`
- `jpeg`
- `webp`
- `avif`
- `svg`

You can also switch to manual image sources in `manualHeroPhotos` inside `src/data/media.ts`.

Supported manual sources:

- files under `public/images/...`
- remote image-bed direct URLs such as `https://example.com/demo-image.webp`

Notes:

- browser-deployed sites should not use raw local OS paths like `C:/...`
- if you have local images, move them into `src/assets/gallery/` or `public/images/`

### Footer

Edit:

- `src/data/site.ts`

Current footer values are placeholder examples to avoid exposing real filing data.

## Styling

Global style entry:

- `src/style.css`

Layered style files:

- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/layout/*`
- `src/styles/components/*`
- `src/styles/pages/*`

This structure keeps layout, component, and page styles isolated for easier maintenance.

## Build Output

Production files are generated in:

```text
dist/
```

Expected main outputs:

- `dist/index.html`
- `dist/about.html`

## Extend the Project

To add a new page:

1. Create a new page component in `src/`
2. Add a new entry file like `src/your-page.ts`
3. Add a corresponding HTML entry file
4. Register the new build input in `vite.config.ts`
5. Reuse `src/layout/AppShell.vue` for shared navigation and footer

## Scripts

```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "preview": "vite preview --host",
  "type-check": "vue-tsc --noEmit"
}
```

## Notes

- The project currently uses a multi-entry static setup instead of Vue Router.
- Theme mode supports `light` and `dark`.
- On first load, the theme follows the system preference.
- Afterwards, the selected theme is stored locally.

## License

Use this template as a starting point for your own homepage and adjust content, assets, and branding as needed.
