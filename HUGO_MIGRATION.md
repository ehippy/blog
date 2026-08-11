# Hugo Migration Task List

Branch: `hugo-migration`

## Branch & scaffolding
1. Create a branch (e.g. `hugo-migration`)
2. Run `hugo new site` (in place or a temp dir) to scaffold Hugo config/layouts
3. Verify `hugo` is installed locally (add `hugo` to the GitHub Actions workflow later)

## Content
4. Move `_posts/*` → `content/post/`
5. Move `_pages/*` → `content/` (about, archive, resume, 404)
6. Move `_drafts/*` → `content/` with `draft: true`
7. Move `_data/*.yml` → `data/`
8. Move `images/` → `static/`
9. Clean up front matter: drop `layout:` lines, add `date:` where missing

## Templates
10. Port `_layouts/` → `layouts/` (default, post, page, index)
11. Port `_includes/` → `layouts/partials/` (header, footer, socials, related-posts, reading-time)
12. Move `css/style.scss` + `_sass/` into Hugo's asset pipeline

## Config & features
13. Write `hugo.toml` (site title/URL, pagination, menus from `settings.yml`)
14. Set up RSS + sitemap (Hugo built-in; drop jekyll-feed/sitemap)
15. Handle the picture/responsive-image pipeline (`_data/picture.yml` + `jekyll_picture_tag`)
16. Port the JSON-LD snippets (index, post, about)

## Build & deploy
17. Update GitHub Actions: swap `jekyll build` for `hugo`, output `public/` instead of `_site/`
18. Update deploy script paths (`_site` → `public`, `generated` handling)
19. Update Lighthouse + HTML validation workflows if they reference `_site`

## Verification
20. Build locally, diff against current site, check posts/pages/pagination/images
21. Deploy from the branch and eyeball the live site
