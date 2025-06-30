---
title: Archive
permalink: /archive/
featured_image: /images/SunsetDesk.png
---

Below you\'ll find every post in reverse chronological order. Use your browser search to find topics that interest you.

<section class="blog single">
  <div class="wrap">
    {% for post in site.posts %}
    <article class="blog-post">
      <div class="blog-post__header">
        <h2 class="blog-post__title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
        <p class="blog-post__subtitle">{{ post.date | date_to_long_string }}</p>
        {% if post.tags %}
        <p class="blog-post__subtitle">{{ post.tags | join: ', ' }}</p>
        {% endif %}
      </div>
      {% if post.featured_image %}
      <a href="{{ post.url }}" class="blog-post__image" style="background-image: url({{ post.featured_image }});"></a>
      {% endif %}
      <div class="blog-post__content">
        <p>{{ post.excerpt }}</p>
        <p><a href="{{ post.url }}" class="button">Read More</a></p>
      </div>
    </article>
    {% endfor %}
  </div>
</section>
