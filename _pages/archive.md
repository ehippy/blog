---
title: All Posts
permalink: /archive/
featured_image: /images/heron.jpeg
---

<!-- Tag Cloud -->
<div class="tag-cloud-section">
  <div class="tag-cloud">
    <button class="tag-cloud-item active" data-tag="all" onclick="filterByTag('all', this)">All Posts</button>
    {% assign all_tags = site.posts | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
    {% for tag in all_tags %}
      {% if tag != '' %}
        <button class="tag-cloud-item" data-tag="{{ tag | downcase | strip }}" onclick="filterByTag('{{ tag | downcase | strip }}', this)">{{ tag | strip }}</button>
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
  <li class="archive-post" data-tags="{% for tag in post.tags %}{{ tag | downcase | strip }}{% unless forloop.last %} {% endunless %}{% endfor %}">
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
</div>
{% endfor %}

<script>
function filterByTag(selectedTag, clickedButton) {
  const tagButtons = document.querySelectorAll('.tag-cloud-item');
  const yearSections = document.querySelectorAll('.year-section');
  
  // Update active button
  tagButtons.forEach(btn => btn.classList.remove('active'));
  clickedButton.classList.add('active');
  
  // Filter posts
  yearSections.forEach(section => {
    const postsInYear = section.querySelectorAll('.archive-post');
    let hasVisiblePosts = false;
    
    postsInYear.forEach(post => {
      const postTags = post.dataset.tags;
      
      if (selectedTag === 'all' || postTags.includes(selectedTag)) {
        post.style.display = 'flex';
        hasVisiblePosts = true;
      } else {
        post.style.display = 'none';
      }
    });
    
    // Hide/show year section based on whether it has visible posts
    if (hasVisiblePosts) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
}
</script>
