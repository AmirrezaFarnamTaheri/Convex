/**
 * UI Enhancements for Convex Optimization Course
 * Handles:
 * - Collapsible Environment Boxes
 * - Sidebar/TOC Toggling
 * - Theme Switching (Refined)
 */

document.addEventListener('DOMContentLoaded', () => {
    initCollapsibleEnvironments();
    initSidebarToggle();
    initThemeSwitcher();
});

function initCollapsibleEnvironments() {
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
    if (box.querySelector('.env-toggle-btn')) return;

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'env-collapsible-content';

    while (box.firstChild) {
        contentWrapper.appendChild(box.firstChild);
    }
    box.appendChild(contentWrapper);

    const btn = document.createElement('button');
    btn.className = 'env-toggle-btn';
    btn.innerHTML = defaultCollapsed ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-up"></i>';
    btn.setAttribute('aria-label', 'Toggle ' + label);

    box.appendChild(btn);

    if (defaultCollapsed) {
        box.classList.add('env-collapsed');
    }

    btn.addEventListener('click', () => {
        const isCollapsed = box.classList.toggle('env-collapsed');
        btn.innerHTML = isCollapsed ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-up"></i>';
        if (typeof feather !== 'undefined') feather.replace();
    });
}

function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
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

    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', collapsed);
        window.dispatchEvent(new Event('resize'));
    });

    if (typeof feather !== 'undefined') feather.replace();
}

function initThemeSwitcher() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    if (document.getElementById('theme-dropdown-trigger')) return;

    const container = document.createElement('div');
    container.style.position = 'relative';

    // Trigger Button
    const btn = document.createElement('button');
    btn.id = 'theme-dropdown-trigger';
    btn.className = 'btn btn-ghost';
    btn.innerHTML = '<i data-feather="droplet"></i> Theme';

    // Dropdown Menu
    const dropdown = document.createElement('div');
    dropdown.className = 'theme-dropdown hidden';

    const themes = [
        { id: 'default', name: 'Ocean', color: '#1890ff' },
        { id: 'emerald', name: 'Emerald', color: '#10b981' },
        { id: 'amethyst', name: 'Amethyst', color: '#8b5cf6' },
        { id: 'sunset', name: 'Sunset', color: '#f97316' }
    ];

    // Current Theme
    const currentTheme = localStorage.getItem('theme') || 'default';

    themes.forEach(theme => {
        const option = document.createElement('button');
        option.className = `theme-option ${currentTheme === theme.id ? 'active' : ''}`;

        // Color preview dot
        const dot = document.createElement('span');
        dot.className = 'theme-color-preview';
        dot.style.backgroundColor = theme.color;

        const label = document.createElement('span');
        label.textContent = theme.name;

        option.appendChild(dot);
        option.appendChild(label);

        option.addEventListener('click', () => {
            setTheme(theme.id);
            // Update active state in UI
            dropdown.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            dropdown.classList.add('hidden');
        });

        dropdown.appendChild(option);
    });

    // Toggle Logic
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    // Close on click outside
    document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
    });

    container.appendChild(btn);
    container.appendChild(dropdown);
    nav.appendChild(container);

    // Apply initial theme
    setTheme(currentTheme);

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
