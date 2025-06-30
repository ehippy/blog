---
title: All Posts
permalink: /archive/
featured_image: /images/heron.jpeg
---

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in posts_by_year %}
<h3>{{ year.name }}</h3>
<ul>
  {% for post in year.items %}
  <li class="archive-post">
    {% if post.featured_image %}
      <div class="archive-thumbnail">
        <a href="{{ post.url }}">
          <img src="{{ post.featured_image }}" alt="{{ post.title }}">
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
{% endfor %}
