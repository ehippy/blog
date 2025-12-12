// Archive page tag filtering functionality
// This script handles tag filtering on the archive page regardless of how the page is loaded

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
        
        console.log('Archive filtering check:', { 
            tagButtonsFound: tagButtons.length, 
            tagFromUrl: tag,
            decodedTag: decodedTag,
            currentPath: window.location.pathname,
            currentUrl: window.location.href 
        });
        
        if (tagButtons.length > 0) {
            handleInitialQuery();
            return true;
        }
        return false;
    }

    // Handle popstate (back/forward navigation)
    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        if (tag) {
            const decodedTag = decodeURIComponent(tag).toLowerCase().trim();
            setTimeout(() => window.filterByTag(decodedTag, null, false), 50);
        } else {
            setTimeout(() => window.filterByTag('all', null, false), 50);
        }
    });

    // Observer to detect when archive content is loaded (for AJAX navigation)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if tag cloud elements were added
            if (mutation.addedNodes) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        if (node.querySelector && node.querySelector('.tag-cloud-item')) {
                            console.log('Archive content detected via AJAX, initializing...');
                            setTimeout(initializeArchiveFiltering, 50);
                            return;
                        }
                        // Also check if the node itself is a tag cloud item
                        if (node.classList && node.classList.contains('tag-cloud-item')) {
                            console.log('Tag cloud items detected, initializing...');
                            setTimeout(initializeArchiveFiltering, 50);
                            return;
                        }
                    }
                }
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialize on DOM ready
    function initialize() {
        initializeArchiveFiltering();
    }

    // Try multiple initialization approaches
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also try with delays for various timing scenarios
    setTimeout(initialize, 50);
    setTimeout(initialize, 100);
    setTimeout(initialize, 200);

})();
