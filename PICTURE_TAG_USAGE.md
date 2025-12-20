# jekyll-picture-tag Usage Guide

jekyll-picture-tag is now configured to automatically generate responsive images.

## Configuration

- **Configuration file**: `_config.yml`
- **Image source**: `images/` directory
- **Generated variants**: `generated/` directory (added to .gitignore)
- **Formats**: original, WebP, and JPEG at 80% quality
- **Preset**: `default` with responsive breakpoints at 300px, 600px, 900px, 1200px

## How to Use in Templates

Instead of plain `<img>` tags, use the Jekyll Liquid picture tag:

### Basic Usage
```liquid
{% picture "default" path/to/image.jpg alt="Image description" %}
```

### In Posts/Pages (example)
```liquid
{% picture "default" path/to/image.jpg alt="Post title" %}
```

## Workflow

1. Drop original images in the `images/` folder
2. Reference them in templates using the `{% picture %}` tag
3. Run `jekyll build` - jekyll-picture-tag will:
   - Generate responsive variants (300px, 600px, 900px, 1200px widths)
   - Create WebP versions for modern browsers
   - Output everything to `generated/`
   - Automatically add srcset to the HTML
4. The responsive image will be served with proper fallbacks

## Output HTML Example

The tag generates semantic HTML5 with automatic srcset:

```html
<picture class="lazy-load">
  <source type="image/webp" srcset="...">
  <img class="lazy-load" src="..." srcset="..." alt="...">
</picture>
```

## Updating Archive/Blog Templates

To convert existing images to use responsive variants:

**Old:**
```liquid
<img src="/images/post-image.jpg" alt="description">
```

**New:**
```liquid
{% picture "default" images/post-image.jpg alt="description" %}
```

## Directory Structure

```
blog/
├── images/                  # Drop original images here
├── generated/              # Auto-generated variants (git-ignored)
├── _config.yml             # Contains picture tag config
└── [posts, layouts, etc.]
```

## Next Steps

1. Test with `jekyll build`
2. Convert key templates (archive, post layouts) to use `{% picture %}` tags
3. Batch convert existing image references
4. The 53MB image library will be auto-optimized on next build
