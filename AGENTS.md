# Patrick McDavid's Blog - Agent Instructions

## Project Overview
Static Hugo blog hosted on S3 + CloudFront, optimized for performance and accessibility.

## Key Technologies & Decisions

### Build & Deployment
- **Hugo (extended)** with SCSS compiled via Hugo Pipes (`toCSS` + dart-sass, `outputStyle: compressed`)
- **GitHub Actions CI/CD** → S3 + CloudFront invalidation
- **Minification**: `hugo --minify` handles HTML/CSS/JSON/XML; `js/app.js` (a static passthrough file, not run through Hugo Pipes) is minified with Terser in the workflow
- **Image Processing**: Hugo's native image pipeline (Hugo Extended's built-in libwebp — `resources.Get` + `.Resize` in `layouts/partials/picture-core.html`), driven by `data/picture.yml` — a from-scratch replacement for jekyll-picture-tag

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
- Quality: 70 (WebP compression + JPEG re-encode, set in `layouts/partials/picture-core.html`)
- Presets:
  - `default`: 400px, 600px, 800px, 1000px (featured images, blog posts)
  - `archive`: 150px, 200px, 250px (related-posts thumbnails)
- Formats: WebP + original (JPEG/PNG/GIF)

**Usage**:
- Featured images (in layouts, via the `picture.html` partial):
  ```go-html-template
  {{ partial "picture.html" (dict "page" . "preset" "default" "fetchpriority" "high") }}  {{/* LCP images only */}}
  {{ partial "picture.html" (dict "page" . "preset" "default") }}                          {{/* Regular images */}}
  ```
- In-body post images (markdown content, via the `picture` shortcode):
  ```
  {{< picture src="foo.jpg" alt="..." >}}                {{/* default preset */}}
  {{< picture src="foo.jpg" alt="..." preset="archive" >}}
  ```

**Important**:
- Add `fetchpriority="high"` ONLY to LCP candidates (first featured image on index.html, hero image)
- Use `default` preset for images displaying at 400px+
- Source images must already exist in `static/images/` — the `static/images` → `assets/images` module mount in `hugo.toml` is what makes them available to Hugo Pipes; don't remove it
- **Animated GIFs are never resized/converted** — Hugo's native `.Resize` flattens GIF animation to a single frame and can't encode animated WebP, so `picture-core.html` detects `.gif` and serves it unprocessed via a plain `<img>`. This is a Hugo limitation ([gohugoio/hugo#5030](https://github.com/gohugoio/hugo/issues/5030)), not a bug — don't try to route GIFs through the normal resize path
- Sized variants are NOT committed — `hugo --minify` alone generates them at build time into `public/images/<name>_hu_<hash>.<ext>`, content-hashed by Hugo, alongside the unprocessed original at `public/images/<name>.<ext>`. Just run `hugo` locally; no separate script step

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
- Generated image variants (`/images/*_hu_*`): 1 year, immutable (content-hashed filenames via Hugo's image pipeline)
- Unprocessed image originals (`/images/*`, not hashed): 1 hour, same as HTML
- CSS: 1 day
- JS: 1 day

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
    picture.html          # Featured-image wrapper around picture-core.html
    picture-core.html     # Shared responsive <picture> rendering (Hugo native Resize/webp)
    related-posts.html    # Related posts grid
    reading-time.html
  shortcodes/
    picture.html          # In-body responsive image: {{< picture src="foo.jpg" alt="..." >}}
content/
  post/                   # Blog posts (all with featured_image)
  about.md, archive.md, resume.md
assets/css/
  style.scss              # Imports all SCSS, templated + compiled by Hugo Pipes
  _sass/                   # Modular SCSS partials
static/
  images/                 # Source images (originals, not resized; also mounted as assets/images/ for Hugo Pipes — see hugo.toml)
  js/app.js               # Single bundled file (dark-mode, archive-filter, journal)
```

## Common Tasks

### Add a Blog Post
1. Create `content/post/YYYY-MM-DD-slug.md`
2. Add front matter: `title`, `description`, `date`, `slug` (date-free — this is what drives the URL, via `permalinks.post = "/:slug/"` in hugo.toml), `featured_image`, `tags`
3. Featured image must exist in `static/images/`
4. Use markdown for content; Hugo automatically generates a summary/excerpt

### Update Colors/Fonts
Edit `data/settings.yml`, not CSS directly. SCSS variables auto-inject via `resources.ExecuteAsTemplate` in `layouts/_default/baseof.html` / `layouts/404.html`.

### Add a New Image Preset
Edit `data/picture.yml` under `presets:`. No other changes needed — `picture-core.html` reads presets by name at build time.

### Change Performance Parameters
- **JS minification**: Edit `.github/workflows/hugo.yml` (Terser step)
- **Image quality**: Edit `layouts/partials/picture-core.html` (`q70` in the `.Resize` spec strings)
- **Cache headers**: Edit `.github/workflows/hugo.yml` (S3 sync steps)

## Build & Deployment

### Local Development
```bash
hugo server -D                        # Live-reload dev server, drafts included — <picture> sources work out of the box
```

### Production (Automatic via GitHub Actions)
1. `git push` to main
2. GitHub Actions builds with `hugo --minify` (Hugo Extended's native image pipeline produces every resized/webp variant as part of this one step)
3. Minifies `js/app.js` with Terser
4. Syncs to S3 with cache headers
5. Invalidates CloudFront

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
