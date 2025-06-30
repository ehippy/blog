---
title: Archive
permalink: /archive/
featured_image: /images/SunsetDesk.png
---

Below you\'ll find every post in reverse chronological order. Use your browser search to find topics that interest you.

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in posts_by_year %}
<h3>{{ year.name }}</h3>
<ul>
  {% for post in year.items %}
  <li>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </li>
  {% endfor %}
</ul>
{% endfor %}
