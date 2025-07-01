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
    
    if (!currentTheme) {
        if (defaultTheme === 'auto') {
            // Use system preference
            currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            currentTheme = defaultTheme;
        }
    }
    
    // Function to update theme (CSS handles icon switching automatically)
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        console.log('Theme set to:', theme);
    }
    
    // Set initial theme
    setTheme(currentTheme);

    // Toggle theme function
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            setTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Add event listener to toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes (only if default is auto)
    if (window.matchMedia && defaultTheme === 'auto') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listen for changes in system theme preference
        mediaQuery.addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    setTheme('dark');
                } else {
                    setTheme('light');
                }
            }
        });
    }
});
