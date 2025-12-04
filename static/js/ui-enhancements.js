/**
 * UI Enhancements for Convex Optimization Course
 * Handles:
 * - Collapsible Environment Boxes (Proofs, Solutions)
 * - Sidebar/TOC Toggling
 * - Theme Switching
 */

document.addEventListener('DOMContentLoaded', () => {
    initCollapsibleEnvironments();
    initSidebarToggle();
    initThemeSwitcher();
});

function initCollapsibleEnvironments() {
    // Select all environment boxes that should be collapsible
    // Proofs, Solutions, Answers are collapsed by default.
    // Examples, Theorems, Definitions are generally expanded but can be toggled.

    const collapsibleSelectors = [
        { selector: '.proof-enhanced', defaultCollapsed: true, label: 'Proof' },
        { selector: '.solution-enhanced', defaultCollapsed: true, label: 'Solution' },
        { selector: '.answer', defaultCollapsed: true, label: 'Answer' },
        { selector: '.example-enhanced', defaultCollapsed: false, label: 'Example' }
    ];

    collapsibleSelectors.forEach(config => {
        document.querySelectorAll(config.selector).forEach(box => {
            makeCollapsible(box, config.defaultCollapsed, config.label);
        });
    });
}

function makeCollapsible(box, defaultCollapsed, label) {
    // Check if already initialized
    if (box.querySelector('.env-toggle-btn')) return;

    // Create wrapper for content if not already wrapped
    // We assume the box contains content directly.
    // We need to move children to a wrapper, except for the "header" or pseudo-element logic.
    // Since pseudo-elements are on the box itself, we can just wrap inner HTML.

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'env-collapsible-content';

    // Move all children to wrapper
    while (box.firstChild) {
        contentWrapper.appendChild(box.firstChild);
    }
    box.appendChild(contentWrapper);

    // Create Toggle Button
    const btn = document.createElement('button');
    btn.className = 'env-toggle-btn';
    btn.innerHTML = defaultCollapsed ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-up"></i>';
    btn.setAttribute('aria-label', 'Toggle ' + label);

    // Add button to top-right of box
    box.appendChild(btn); // Position absolute handles placement

    // Set initial state
    if (defaultCollapsed) {
        box.classList.add('env-collapsed');
    }

    // Toggle Logic
    btn.addEventListener('click', () => {
        const isCollapsed = box.classList.toggle('env-collapsed');
        btn.innerHTML = isCollapsed ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-up"></i>';
        if (typeof feather !== 'undefined') feather.replace();
    });
}

function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Check if toggle already exists (from toc.js maybe, but we are replacing that logic)
    if (document.getElementById('sidebar-toggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebar-toggle';
    toggleBtn.className = 'btn btn-ghost';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '20px';
    toggleBtn.style.left = '20px';
    toggleBtn.style.zIndex = '1030';
    toggleBtn.style.backgroundColor = 'var(--surface-1)';
    toggleBtn.style.boxShadow = 'var(--shadow-md)';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.width = '40px';
    toggleBtn.style.height = '40px';
    toggleBtn.style.padding = '0';
    toggleBtn.style.display = 'flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';

    toggleBtn.innerHTML = '<i data-feather="sidebar"></i>';

    document.body.appendChild(toggleBtn);

    // Load state
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', collapsed);

        // Trigger resize for widgets
        window.dispatchEvent(new Event('resize'));
    });

    if (typeof feather !== 'undefined') feather.replace();
}

function initThemeSwitcher() {
    // We can expose a global function or look for a UI element
    // Let's look for a theme button in the nav, if not found, create a floating one or append to Nav

    const nav = document.querySelector('.nav');
    if (!nav) return;

    // Check if already exists
    if (document.getElementById('theme-dropdown-trigger')) return;

    const container = document.createElement('div');
    container.style.position = 'relative';

    const btn = document.createElement('button');
    btn.id = 'theme-dropdown-trigger';
    btn.className = 'btn btn-ghost';
    btn.innerHTML = '<i data-feather="droplet"></i> Theme';

    const dropdown = document.createElement('div');
    dropdown.className = 'glass';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.right = '0';
    dropdown.style.padding = '8px';
    dropdown.style.borderRadius = '8px';
    dropdown.style.display = 'none';
    dropdown.style.flexDirection = 'column';
    dropdown.style.gap = '4px';
    dropdown.style.minWidth = '120px';
    dropdown.style.zIndex = '1050';

    const themes = [
        { id: 'default', name: 'Ocean (Default)' },
        { id: 'emerald', name: 'Emerald' },
        { id: 'amethyst', name: 'Amethyst' },
        { id: 'sunset', name: 'Sunset' }
    ];

    themes.forEach(theme => {
        const tBtn = document.createElement('button');
        tBtn.className = 'btn btn-ghost';
        tBtn.style.justifyContent = 'flex-start';
        tBtn.style.fontSize = '0.85rem';
        tBtn.textContent = theme.name;
        tBtn.addEventListener('click', () => {
            setTheme(theme.id);
            dropdown.style.display = 'none';
        });
        dropdown.appendChild(tBtn);
    });

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', () => {
        dropdown.style.display = 'none';
    });

    container.appendChild(btn);
    container.appendChild(dropdown);
    nav.appendChild(container);

    // Init theme from storage
    const savedTheme = localStorage.getItem('theme') || 'default';
    setTheme(savedTheme);

    if (typeof feather !== 'undefined') feather.replace();
}

function setTheme(themeId) {
    if (themeId === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', themeId);
    }
    localStorage.setItem('theme', themeId);
}
