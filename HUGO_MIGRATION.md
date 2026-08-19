# Hugo Migration Task List

Branch: `hugo-migration`

## Branch & scaffolding
1. [x] Create a branch (e.g. `hugo-migration`)
2. [x] Run `hugo new site` (in place or a temp dir) to scaffold Hugo config/layouts
3. [x] Verify `hugo` is installed locally (added to the GitHub Actions workflow via `peaceiris/actions-hugo`)

## Content
4. [x] Move `_posts/*` → `content/post/`
5. [x] Move `_pages/*` → `content/` (about, archive, resume; 404 is served by `layouts/404.html` directly, no content file needed)
6. [x] Move `_drafts/*` → `content/post/` with `draft: true`
7. [x] Move `_data/*.yml` → `data/`
8. [x] Move `images/` → `static/`
9. [x] Clean up front matter: drop `layout:` lines, add `date:` where missing

## Templates
10. [x] Port `_layouts/` → `layouts/` (default, post, page, index) — old `_layouts/` removed
11. [x] Port `_includes/` → `layouts/partials/` (header, footer, socials, related-posts, reading-time, picture) — old `_includes/` removed
12. [x] Move `css/style.scss` + `_sass/` into Hugo's asset pipeline (`assets/css/`, compiled via `resources.ExecuteAsTemplate` + `toCSS`)

## Config & features
13. [x] Write `hugo.toml` (site title/URL, pagination, menus from `settings.yml`)
14. [x] Set up RSS + sitemap (Hugo built-in; dropped jekyll-feed/sitemap; disabled unused taxonomy/term output)
15. [x] Handle the picture/responsive-image pipeline (`data/picture.yml` + `tools/generate_images.sh` + `picture.html` partial)
16. [x] Port the JSON-LD snippets (index → Organization, post → BlogPosting, about → Person via `jsonld: person` front matter)

## Build & deploy
17. [x] Update GitHub Actions: swapped `jekyll build` for `hugo --minify` (renamed `jekyll.yml` → `hugo.yml`), output `public/` instead of `_site/`
18. [x] Update deploy script paths (`_site` → `public`, `generated/` populated by `tools/generate_images.sh` as a build step)
19. [x] Update Lighthouse + HTML validation workflows (`lighthouserc.json`, `lighthouse.yml`) to reference `public/` instead of `_site/`

## Verification
20. [x] Build locally, diff against current site, check posts/pages/pagination/images — `hugo --minify -D` builds clean with no warnings; spot-checked home, about, archive, resume, 404, and post pages; verified generated `<picture>` variants via a live `hugo server` smoke test
21. [ ] Deploy from the branch and eyeball the live site — not done yet, needs a push + real S3/CloudFront deploy
