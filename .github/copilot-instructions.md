# Patrick McDavid's Blog - Copilot Instructions

## Project Overview
Static Hugo blog hosted on S3 + CloudFront, optimized for performance and accessibility.

## Key Technologies & Decisions

### Build & Deployment
- **Hugo (extended)** with SCSS compiled via Hugo Pipes (`toCSS` + dart-sass, `outputStyle: compressed`)
- **GitHub Actions CI/CD** → S3 + CloudFront invalidation
- **Minification**: `hugo --minify` handles HTML/CSS/JSON/XML; `js/app.js` (a static passthrough file, not run through Hugo Pipes) is minified with Terser in the workflow
- **Image Processing**: `tools/generate_images.sh` (libvips + cwebp/gif2webp) — a from-scratch replacement for jekyll-picture-tag, driven by `data/picture.yml`

### JavaScript
- **Single bundled file**: `/js/app.js` (combines dark-mode, archive-filter, journal)
- **Vanilla ES6 only** - No jQuery or external dependencies
- **All scripts use `defer` attribute** - Never blocks rendering
- **Pattern**: Direct execution with defer (no DOMContentLoaded wrappers)
- **Size goal**: ~8.7 KB unminified → 3.5 KB minified → 1.4 KB minified+gzipped

### CSS & Styling
- **SCSS architecture**: `assets/css/_sass/_reset.scss`, `_basic.scss`, `_mixins.scss`
- **Includes structure**: `assets/css/_sass/_includes/` — separate files for header, footer, content, blog, portfolio, syntax
- **Dark mode**: Fully implemented with system preference detection via `prefers-color-scheme`
- **Font**: Merriweather (titles) + Muli (body), async-loaded with display=swap
- **Colors**: `assets/css/style.scss` is executed as a Hugo template first (`resources.ExecuteAsTemplate`) so its SCSS variables can pull from `data/settings.yml` (`$.Site.Data.settings...`), then piped through `toCSS`

### Responsive Images
**Configuration** (`data/picture.yml`):
- Quality: 70 (WebP compression, set in `tools/generate_images.sh`)
- Presets:
  - `default`: 400px, 600px, 800px, 1000px (featured images, blog posts)
  - `archive`: 150px, 200px, 250px (related-posts thumbnails)
- Formats: WebP + original (JPEG/PNG/GIF)

**Usage** (in layouts, via the `picture.html` partial):
```go-html-template
{{ partial "picture.html" (dict "page" . "preset" "default" "fetchpriority" "high") }}  {{/* LCP images only */}}
{{ partial "picture.html" (dict "page" . "preset" "default") }}                          {{/* Regular images */}}
```

**Important**:
- Add `fetchpriority="high"` ONLY to LCP candidates (first featured image on index.html, hero image)
- Use `default` preset for images displaying at 400px+
- Source images must already exist in `static/images/`
- Sized variants are NOT committed — `tools/generate_images.sh [output_dir]` (default `./public`) generates them into `<output_dir>/generated/` as a build step, mirroring the old S3 "generated" pipeline. Run it locally after `hugo` if you need working `<picture>` sources.

## HTML & Semantic Standards

### Document Structure
```html
<header>           <!-- Navigation, logo -->
<nav>             <!-- Menu items only -->
<main>            <!-- Primary content -->
<section>         <!-- Content sections -->
<article>         <!-- Blog posts, items -->
<footer>          <!-- Site footer -->
```

### Meta & Performance
- All pages must have `<meta name="description">` (front matter: `description:`)
- Use descriptive link text (not "Read More" alone)
- Include `preconnect` hints for third-party domains
- CSS preloaded: `<link rel="preload" as="style" href="...">`
- Fonts async-loaded: `rel="preload"` + `media="print" onload="this.media='all'"`

## Color & Contrast

### Light Mode Palette
- Background: #ffffff
- Text dark (headings): #2A2F36
- Text medium (metadata): #6C7A89
- Text light (secondary): #ABB7B7 ← Use sparingly, contrast issues
- Accent (links, buttons): #0f9d57

### Accessibility Requirements
- **WCAG AA minimum**: 4.5:1 contrast ratio for text
- `.blog-post__subtitle`, `.reading-time`, `.post-meta`, `.archive-meta` use `$text-medium-color`
- `.post-date` explicitly set to `$text-medium-color`
- Avoid `$text-light-color` for body copy (insufficient contrast)

## Performance Targets

### Critical Rendering Path
- LCP images: `fetchpriority="high"`
- CSS: Preloaded (reduces chain from 312ms to ~150ms)
- Fonts: Async-loaded (saves ~750ms)
- JS: Deferred (never blocks rendering)

### Image Optimization
- Quality: 70% WebP (balances file size vs visual fidelity)
- Breakpoints: 400/600/800/1000px (covers 95% of layouts)
- Archive preset: ONLY for thumbnails <250px display size
- Featured images: Use default preset

### Cache Headers (S3)
- Generated images: 1 year (content-hashed filenames)
- CSS/JS: 1 day
- HTML: 1 hour

## File Organization

```
data/
  settings.yml          # Colors, fonts, menu, metadata
  picture.yml            # Responsive-image presets (sizes, formats)
layouts/
  _default/baseof.html   # Base layout (head, <html> shell)
  _default/single.html   # Static pages (about, resume, archive)
  post/single.html       # Blog post layout
  index.html              # Home / paginated post list
  404.html
  partials/
    header.html           # <header><nav>
    footer.html           # <footer>
    socials.html
    picture.html          # Responsive <picture> partial
    related-posts.html    # Related posts grid
    reading-time.html
content/
  post/                   # Blog posts (all with featured_image)
  about.md, archive.md, resume.md
assets/css/
  style.scss              # Imports all SCSS, templated + compiled by Hugo Pipes
  _sass/                   # Modular SCSS partials
static/
  images/                 # Source images (originals, not resized)
  js/app.js               # Single bundled file (dark-mode, archive-filter, journal)
tools/
  generate_images.sh      # Responsive image variant generator (build step, not committed output)
```

## Common Tasks

### Add a Blog Post
1. Create `content/post/slug.md`
2. Add front matter: `title`, `description`, `date`, `featured_image`, `tags`
3. Featured image must exist in `static/images/`
4. Use markdown for content; Hugo automatically generates a summary/excerpt

### Update Colors/Fonts
Edit `data/settings.yml`, not CSS directly. SCSS variables auto-inject via `resources.ExecuteAsTemplate` in `layouts/_default/baseof.html` / `layouts/404.html`.

### Add a New Image Preset
Edit `data/picture.yml` under `presets:`. Update `tools/generate_images.sh` output if you add a new preset name beyond `default`/`archive`.

### Change Performance Parameters
- **JS minification**: Edit `.github/workflows/hugo.yml` (Terser step)
- **Image quality**: Edit `tools/generate_images.sh` (`-q 70` flags)
- **Cache headers**: Edit `.github/workflows/hugo.yml` (S3 sync steps)

## Build & Deployment

### Local Development
```bash
hugo server -D                        # Live-reload dev server, drafts included
./tools/generate_images.sh ./public   # Populate /generated/ if you need working <picture> sources
```

### Production (Automatic via GitHub Actions)
1. `git push` to main
2. GitHub Actions builds with `hugo --minify`
3. Runs `tools/generate_images.sh` to produce responsive image variants
4. Minifies `js/app.js` with Terser
5. Syncs to S3 with cache headers
6. Invalidates CloudFront

## Anti-Patterns to Avoid

❌ **Don't**:
- Add external JS libraries (keep vanilla)
- Use `display: none` for responsive design (use CSS breakpoints)
- Set `<link rel="stylesheet">` without `rel="preload"` first
- Use `$text-light-color` for body text (contrast issues)
- Use archive preset for large displayed images
- Add jQuery or heavy frameworks
- Wrap JS in DOMContentLoaded (defer handles it)
- Lazy-load LCP images
- Use `jsonify` inside a `<script type="application/ld+json">` block without piping through `| safeJS` — Hugo's contextual JS autoescaping will double-encode the string otherwise

✅ **Do**:
- Use semantic HTML elements
- Add `fetchpriority="high"` to LCP images only
- Wrap metadata in appropriate classes (`.post-meta`, `.reading-time`)
- Test color contrast (WCAG AA: 4.5:1 minimum)
- Use the `picture.html` partial for all featured images
- Keep JS files small and performant
- Document decisions in front matter comments

## References

- **Hugo docs**: https://gohugo.io/documentation/
- **Hugo Pipes (asset processing)**: https://gohugo.io/hugo-pipes/
- **Web.dev performance**: https://web.dev/
- **WCAG accessibility**: https://www.w3.org/WAI/WCAG21/quickref/
