---
title: About Me
subtitle: Software engineering leader, architect, father and philosopher
featured_image: toothbrushers.webp
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "{{ site.data.settings.basic_settings.site_title }}",
  "url": "{{ site.url }}",
  "description": "{{ site.data.settings.basic_settings.site_tagline }}",
  "sameAs": [
    {% if site.data.settings.social_settings.github_url %}"{{ site.data.settings.social_settings.github_url }}"{% if site.data.settings.social_settings.linkedin_url or site.data.settings.social_settings.twitter_url %},{% endif %}{% endif %}
    {% if site.data.settings.social_settings.linkedin_url %}"{{ site.data.settings.social_settings.linkedin_url }}"{% if site.data.settings.social_settings.twitter_url %},{% endif %}{% endif %}
    {% if site.data.settings.social_settings.twitter_url %}"{{ site.data.settings.social_settings.twitter_url }}"{% endif %}
  ]
}
</script>

I've spent the better part of two decades leading engineering work that scales. I've played key roles in guiding products from early-stage scrappiness to long-term viability — including one that became [a killer, high-growth product](https://bombbomb.com){:target="_blank"}. My work tends to sit at the intersection of systems, people, and thoughtful progress.

I've built across the stack, [led teams through high-growth phases](/twosliceteams/), and recently focused on using large language models to improve developer experience and product impact. These days, I think a lot about how the tools we make ripple out into the world—not just in terms of performance and reliability, but [sustainability](/accidentally-carbon-neutral/), clarity, and human impact.

I live in Colorado Springs with my two kids, where we spend a lot of time outdoors. You'll find us getting dirty camping, hiking, or swimming. My nine-year-old is getting into cooking, which means our kitchen experiments are getting more interesting (and messier).

This site is where I write about technology, [philosophy](/my-thesis/), [parenting](/childs-choices/), and whatever else catches my attention. It's also [open source](https://github.com/ehippy/blog){:target="_blank"} and [accidentally carbon-neutral](/accidentally-carbon-neutral/).

## Nerdy site details




[![Build Status](https://github.com/ehippy/blog/actions/workflows/jekyll.yml/badge.svg)](https://github.com/ehippy/blog/actions/workflows/jekyll.yml){:target="_blank"} [![HTML Validation](https://github.com/ehippy/blog/actions/workflows/validate.yml/badge.svg)](https://github.com/ehippy/blog/actions/workflows/validate.yml){:target="_blank"} [![Lighthouse Performance](https://img.shields.io/badge/lighthouse-run_report-blue?logo=lighthouse)](https://github.com/ehippy/blog/actions/workflows/jekyll.yml){:target="_blank"} 