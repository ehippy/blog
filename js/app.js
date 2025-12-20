//
// App JS - Combined and Minified
// Consolidates: dark-mode, archive-filter, journal
//

// ============================================================================
// DARK MODE
// ============================================================================

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Get default theme from data attribute or fallback to auto
const getDefaultTheme = () => {
    const bodyElement = document.body;
    return bodyElement ? bodyElement.getAttribute('data-default-theme') || 'auto' : 'auto';
};

const defaultTheme = getDefaultTheme();

// Check for saved theme preference or use default
let currentTheme = localStorage.getItem('theme');
let isAutoMode = !currentTheme;

if (!currentTheme) {
    if (defaultTheme === 'auto') {
        // Use system preference
        currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        currentTheme = defaultTheme;
    }
}

// Function to update theme and icon
function setTheme(theme, auto = false) {
    html.setAttribute('data-theme', theme);
    updateToggleIcon(auto ? 'auto' : theme);
}

// Function to update the toggle icon based on current mode
function updateToggleIcon(mode) {
    if (!themeToggle) return;
    
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    // Remove existing auto icon if present
    const existingAutoIcon = themeToggle.querySelector('.fa-adjust');
    if (existingAutoIcon) existingAutoIcon.remove();
    
    if (mode === 'auto') {
        // Hide sun/moon icons and show auto icon
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'none';
        
        // Add auto icon
        const autoIcon = document.createElement('i');
        autoIcon.className = 'fas fa-adjust';
        autoIcon.setAttribute('aria-hidden', 'true');
        themeToggle.appendChild(autoIcon);
        
        themeToggle.setAttribute('title', 'Auto light/dark mode - click for light mode');
    } else {
        // Show appropriate sun/moon icon for current mode
        if (moonIcon) moonIcon.style.display = mode === 'dark' ? 'inline' : 'none';
        if (sunIcon) sunIcon.style.display = mode === 'light' ? 'inline' : 'none';
        
        if (mode === 'light') {
            themeToggle.setAttribute('title', 'Light mode - click for dark mode');
        } else if (mode === 'dark') {
            themeToggle.setAttribute('title', 'Dark mode - click for auto mode');
        }
    }
}

// Set initial theme
setTheme(currentTheme, isAutoMode);

// Toggle theme function - cycles through light → dark → auto
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme) {
        // Currently auto → switch to light
        setTheme('light');
        localStorage.setItem('theme', 'light');
    } else if (savedTheme === 'light') {
        // light → dark
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        // dark → auto
        localStorage.removeItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light', true);
    }
}

// Add event listener to toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        toggleTheme();
    });
}

// Listen for system theme changes (only if default is auto)
if (window.matchMedia && defaultTheme === 'auto') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for changes in system theme preference
    mediaQuery.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                setTheme('dark', true);
            } else {
                setTheme('light', true);
            }
        }
    });
}


// ============================================================================
// ARCHIVE FILTERING
// ============================================================================

(function() {
    'use strict';

    // Global filtering function
    window.filterByTag = function(selectedTag, clickedButton, updateUrl = true) {
        const tagButtons = document.querySelectorAll('.tag-cloud-item');
        const yearSections = document.querySelectorAll('.year-section');
        
        // Normalize the selected tag
        const normalizedSelectedTag = selectedTag.toLowerCase().trim();
        // Escape for use in selector
        const escapedTagSelector = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(normalizedSelectedTag) : normalizedSelectedTag.replace(/([ #;?%&,.+*~\':!^$\[\]()=>|\/])/g, '\\$1');
        
        // Update active button
        tagButtons.forEach(btn => btn.classList.remove('active'));
        if (clickedButton) {
            clickedButton.classList.add('active');
        } else {
            // Find and activate the correct button when called from URL parameter
            const targetButton = document.querySelector(`[data-tag="${escapedTagSelector}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        }
        
        // Update URL with query parameter
        if (updateUrl) {
            const url = new URL(window.location);
            if (normalizedSelectedTag === 'all') {
                url.searchParams.delete('tag');
            } else {
                url.searchParams.set('tag', normalizedSelectedTag);
            }
            history.pushState(null, null, url);
        }
        
        // Filter posts
        yearSections.forEach(section => {
            const postsInYear = section.querySelectorAll('.archive-post');
            let hasVisiblePosts = false;
            
            postsInYear.forEach(post => {
                const postTags = post.dataset.tags || '';
                // Split tags by pipe character and normalize each one for comparison
                const postTagArray = postTags.split('|').map(tag => tag.toLowerCase().trim());
                
                if (normalizedSelectedTag === 'all' || postTagArray.includes(normalizedSelectedTag)) {
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
    };

    // Handle initial page load with query parameter
    function handleInitialQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        if (tag) {
            // Decode and normalize the tag from URL
            const decodedTag = decodeURIComponent(tag).toLowerCase().trim();
            // Escape for use in selector
            const escapedTagSelector = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(decodedTag) : decodedTag.replace(/([ #;?%&,.+*~\':!^$\[\]()=>|\/])/g, '\\$1');
            // Check if the tag corresponds to a valid tag
            const targetButton = document.querySelector(`[data-tag="${escapedTagSelector}"]`);
            if (targetButton) {
                window.filterByTag(decodedTag, null, false);
            }
        }
    }

    // Check if we're on the archive page and initialize filtering
    function initializeArchiveFiltering() {
        // Only run if we're on a page with tag cloud items
        const tagButtons = document.querySelectorAll('.tag-cloud-item');
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        const decodedTag = tag ? decodeURIComponent(tag) : null;
        
        
        if (tagButtons.length > 0) {
            handleInitialQuery();
            return true;
        }
        return false;
    }

    // Initialize archive filtering
    initializeArchiveFiltering();

})();


// ============================================================================
// JOURNAL
// ============================================================================

function pageFunctions() {
	// Active links - highlight current page
	document.querySelectorAll('.active-link').forEach(el => el.classList.remove('active-link'));
	const currentPath = window.location.pathname;
	const currentLink = document.querySelector(`a[href="${currentPath}"]`);
	if (currentLink) currentLink.classList.add('active-link');

	// Images - extract from paragraphs and wrap
	document.querySelectorAll('.single p > img').forEach(img => {
		const p = img.parentElement;
		const wrap = document.createElement('div');
		wrap.className = 'image-wrap';
		p.parentElement.insertBefore(wrap, p.nextSibling);
		wrap.appendChild(img);
		p.remove();
	});
}

// Run on load
pageFunctions();

// Menu toggle
document.addEventListener('click', function(e) {
	if (e.target.closest('.js-menu-toggle')) {
		document.body.classList.toggle('menu--open');
	}

	if (e.target.closest('.menu__list__item__link') && document.body.classList.contains('menu--open')) {
		document.body.classList.remove('menu--open');
	}
});
