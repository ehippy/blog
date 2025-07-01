// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    console.log('Dark mode script loaded. Toggle:', !!themeToggle);

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
        console.log('Theme set to:', theme, auto ? '(auto)' : '(manual)');
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
});
