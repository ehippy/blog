---
title: All Posts
permalink: /archive/
featured_image: heron.jpeg
---

<!-- Tag Cloud -->
<div class="tag-cloud-section">
  <div class="tag-cloud">
    <button type="button" class="tag-cloud-item active" data-tag="all" onclick="filterByTag('all', this)">All Posts</button>
    {% assign all_tags = site.posts | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
    {% for tag in all_tags %}
      {% if tag != '' %}
        <button type="button" class="tag-cloud-item" data-tag="{{ tag | downcase | strip }}" onclick="filterByTag('{{ tag | downcase | strip }}', this)">{{ tag | strip }}</button>
      {% endif %}
    {% endfor %}
  </div>
</div>

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in posts_by_year %}
<div class="year-section">
<h3>{{ year.name }}</h3>
<ul>
  {% for post in year.items %}
  <li class="archive-post" data-tags="{% for tag in post.tags %}{{ tag | downcase | strip }}{% unless forloop.last %}|{% endunless %}{% endfor %}">
    {% if post.featured_image %}
      <div class="archive-thumbnail">
        <a href="{{ post.url }}">
          {% picture "archive" {{post.featured_image}} alt="{{ post.title }}" %}
        </a>
      </div>
    {% endif %}
    <div class="archive-content">
      <a href="{{ post.url }}">{{ post.title }}</a>
      {% if post.tags and post.tags.size > 0 %}
        <div class="tag-pills">
          {% for tag in post.tags %}
            <span class="tag-pill">{{ tag | capitalize }}</span>
          {% endfor %}
        </div>
      {% endif %}
    </div>
  </li>
  {% endfor %}
</ul>
</div>
{% endfor %}
