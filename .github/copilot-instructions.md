# Patrick McDavid's Blog - Copilot Instructions

## Project Overview
Static Jekyll blog hosted on S3 + CloudFront, optimized for performance and accessibility.

## Key Technologies & Decisions

### Build & Deployment
- **Jekyll 4.3.3** with SCSS (minified via `sass: style: compressed`)
- **GitHub Actions CI/CD** → S3 + CloudFront invalidation
- **Minification**: JS minified with Terser in workflow, CSS auto-minified
- **Image Processing**: `jekyll-picture-tag ~2.0` with libvips backend

### JavaScript
- **Single bundled file**: `/js/app.js` (combines dark-mode, archive-filter, journal)
- **Vanilla ES6 only** - No jQuery or external dependencies
- **All scripts use `defer` attribute** - Never blocks rendering
- **Pattern**: Direct execution with defer (no DOMContentLoaded wrappers)
- **Size goal**: ~8.7 KB unminified → 3.5 KB minified → 1.4 KB minified+gzipped

### CSS & Styling
- **SCSS architecture**: `_reset.scss`, `_basic.scss`, `_mixins.scss`, `_plugins.scss`
- **Includes structure**: Separate files for header, footer, content, blog, portfolio, syntax
- **Dark mode**: Fully implemented with system preference detection via `prefers-color-scheme`
- **Font**: Merriweather (titles) + Muli (body), async-loaded with display=swap
- **Colors**: Use SCSS variables from `_data/settings.yml` (background, text light/medium/dark, accent)

### Responsive Images
**Configuration** (`_config.yml`):
- Quality: 70 (WebP compression)
- Presets:
  - `default`: 400px, 600px, 700px, 800px (featured images, blog posts)
  - `archive`: 150px, 200px, 250px (deprecated - use default for related posts)
- Formats: WebP + original (JPEG/PNG)

**Usage**:
```liquid
{% picture {{featured_image }} alt="title" fetchpriority="high" %}  <!-- LCP images only -->
{% picture {{featured_image }} alt="title" %}                       <!-- Regular images -->
```

**Important**: 
- Add `fetchpriority="high"` ONLY to LCP candidates (first featured image on index.html, hero image)
- Use default preset for images displaying at 400px+ 
- Source images must already exist in `/images/` folder

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
- All pages must have `<meta name="description">` (frontmatter: `description:`)
- Use descriptive link text (not "Read More" alone)
- Include `preconnect` hints for third-party domains
- CSS preloaded: `<link rel="preload" as="style" href="/css/style.css">`
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
- Breakpoints: 400/600/700/800px (covers 95% of layouts)
- Archive preset: ONLY for thumbnails <250px display size
- Featured images: Use default preset

### Cache Headers (S3)
- Generated images: 1 year (content-hashed filenames)
- CSS/JS: 1 day
- HTML: 1 hour

## File Organization

```
_data/
  settings.yml          # Colors, fonts, metadata (no font_embed)
_includes/
  header.html          # <header><nav>
  footer.html          # <footer>
  related-posts.html   # Related posts grid
_layouts/
  default.html         # Base layout
  post.html           # Blog post layout
  page.html           # Static pages
_pages/                # About, Resume, Archive
_posts/               # Blog posts (all with featured_image)
_sass/
  _basic.scss         # Global styles
  _includes/          # Modular SCSS partials
js/
  app.js             # Single bundled file (dark-mode, archive-filter, journal)
css/
  style.scss         # Imports all SCSS, minified to CSS
```

## Common Tasks

### Add a Blog Post
1. Create `_posts/YYYY-MM-DD-slug.markdown`
2. Add frontmatter: `title`, `description`, `featured_image`, `tags`
3. Featured image must exist in `/images/` folder
4. Use markdown for content, Jekyll automatically generates excerpt

### Update Colors/Fonts
Edit `_data/settings.yml`, not CSS directly. SCSS variables auto-inject.

### Add a New Image Preset
Edit `_config.yml` under `picture: presets:`. Triggers rebuild.

### Change Performance Parameters
- **JS minification**: Edit `.github/workflows/jekyll.yml` (Terser step)
- **Image quality**: Edit `_config.yml` (`quality:`)
- **Cache headers**: Edit `.github/workflows/jekyll.yml` (S3 sync steps)

## Build & Deployment

### Local Development
```bash
bundle exec jekyll serve  # Unminified JS, full CSS
```

### Production (Automatic via GitHub Actions)
1. `git push` to master
2. GitHub Actions builds Jekyll
3. Minifies JS with Terser
4. Generates responsive images with jekyll-picture-tag
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

✅ **Do**:
- Use semantic HTML elements
- Add `fetchpriority="high"` to LCP images only
- Wrap metadata in appropriate classes (`.post-meta`, `.reading-time`)
- Test color contrast (WCAG AA: 4.5:1 minimum)
- Use jekyll-picture-tag for all featured images
- Keep JS files small and performant
- Document decisions in frontmatter comments

## References

- **Jekyll docs**: https://jekyllrb.com/
- **jekyll-picture-tag**: https://rbuchberger.github.io/jekyll_picture_tag/
- **Web.dev performance**: https://web.dev/
- **WCAG accessibility**: https://www.w3.org/WAI/WCAG21/quickref/
