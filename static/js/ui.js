/**
 * UI Enhancements for Convex Optimization Course
 * Handles:
 * - Collapsible Environment Boxes (Proofs, Examples, Solutions)
 * - Hierarchical Section/Subsection Toggling
 * - Page Settings (Font Size, Global Toggles)
 * - Sidebar/TOC Toggling
 * - Theme Switching
 */

document.addEventListener('DOMContentLoaded', () => {
    initCollapsibleEnvironments();
    initHierarchicalSections();
    initPageSettings();
    initSidebarToggle();
    initThemeSwitcher();
    feather.replace();
});

/* =========================================
   1. COLLAPSIBLE ENVIRONMENTS
   ========================================= */
function initCollapsibleEnvironments() {
    const collapsibleSelectors = [
        { selector: '.proof-box', defaultCollapsed: true, label: 'Proof' },
        { selector: '.solution-box', defaultCollapsed: true, label: 'Solution' },
        { selector: '.answer', defaultCollapsed: true, label: 'Answer' },
        { selector: '.recap-box', defaultCollapsed: true, label: 'Recap' },
        { selector: '.example-box', defaultCollapsed: false, label: 'Example' }
    ];

    collapsibleSelectors.forEach(config => {
        document.querySelectorAll(config.selector).forEach(box => {
            makeCollapsible(box, config.defaultCollapsed, config.label);
        });
    });
}

function makeCollapsible(box, defaultCollapsed, label) {
    if (box.querySelector('.env-toggle-btn')) return;

    // Wrap content
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'env-collapsible-content';

    while (box.firstChild) {
        contentWrapper.appendChild(box.firstChild);
    }
    box.appendChild(contentWrapper);

    // Toggle Button
    const btn = document.createElement('button');
    btn.className = 'env-toggle-btn';
    btn.innerHTML = defaultCollapsed ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-up"></i>';
    btn.setAttribute('aria-label', 'Toggle ' + label);
    btn.setAttribute('title', 'Toggle ' + label);

    box.appendChild(btn);

    if (defaultCollapsed) {
        box.classList.add('env-collapsed');
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = box.classList.toggle('env-collapsed');
        btn.innerHTML = isCollapsed ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-up"></i>';
        feather.replace();
    });
}


/* =========================================
   2. HIERARCHICAL SECTIONS
   ========================================= */
function initHierarchicalSections() {
    // Process Level 1: Sections (.section-card with h2)
    const cards = document.querySelectorAll('.section-card');

    cards.forEach(card => {
        if (card.classList.contains('lecture-header')) return;

        const h2 = card.querySelector('h2');
        if (!h2) return;

        // Group content after H2
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'hierarchical-content';

        let next = h2.nextSibling;
        const toMove = [];
        while (next) {
            toMove.push(next);
            next = next.nextSibling;
        }
        toMove.forEach(el => contentWrapper.appendChild(el));
        card.appendChild(contentWrapper);

        // Setup H2 Toggle
        card.classList.add('hierarchical-section'); // For styling hooks
        h2.style.cursor = 'pointer';
        h2.classList.add('section-toggle');

        const originalText = h2.innerHTML;
        // Check if icon already exists to avoid duplication on re-run
        if (!h2.querySelector('.toggle-icon')) {
            h2.innerHTML = `<span class="toggle-icon" style="margin-right:8px;"><i data-feather="chevron-down"></i></span><span class="header-text">${originalText}</span>`;
        }

        h2.addEventListener('click', () => {
            const isCollapsed = card.classList.toggle('collapsed');
            const icon = h2.querySelector('.toggle-icon');
            if (icon) {
                icon.innerHTML = isCollapsed ? '<i data-feather="chevron-right"></i>' : '<i data-feather="chevron-down"></i>';
                feather.replace();
            }
        });

        // Process Level 2: Subsections (h3 inside contentWrapper)
        groupSubsections(contentWrapper);
    });
}

function groupSubsections(container) {
    const children = Array.from(container.childNodes);
    if (children.length === 0) return;

    // Check if there are any H3s to group
    const hasH3 = children.some(c => c.nodeType === 1 && c.tagName === 'H3');
    if (!hasH3) return;

    // Create a new fragment to rebuild content
    const fragment = document.createDocumentFragment();
    let currentSubsection = null;
    let currentContent = null;

    children.forEach(child => {
        if (child.nodeType === 1 && child.tagName === 'H3') {
            // New Subsection Found
            const h3 = child;

            currentSubsection = document.createElement('div');
            currentSubsection.className = 'hierarchical-section hierarchical-subsection';

            // Setup H3 Toggle
            h3.style.cursor = 'pointer';
            const originalText = h3.innerHTML;
            h3.innerHTML = `<span class="toggle-icon" style="margin-right:8px;"><i data-feather="chevron-down"></i></span>${originalText}`;

            currentContent = document.createElement('div');
            currentContent.className = 'hierarchical-content';

            h3.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCollapsed = currentSubsection.classList.toggle('collapsed');
                const icon = h3.querySelector('.toggle-icon');
                if (icon) {
                    icon.innerHTML = isCollapsed ? '<i data-feather="chevron-right"></i>' : '<i data-feather="chevron-down"></i>';
                    feather.replace();
                }
            });

            currentSubsection.appendChild(h3);
            currentSubsection.appendChild(currentContent);
            fragment.appendChild(currentSubsection);

        } else {
            // Content node
            if (currentContent) {
                currentContent.appendChild(child);
            } else {
                // Orphan content before first H3
                fragment.appendChild(child);
            }
        }
    });

    // Replace container content
    container.innerHTML = '';
    container.appendChild(fragment);
}


/* =========================================
   3. PAGE SETTINGS (Font Size, Global Toggles)
   ========================================= */
function initPageSettings() {
    if (document.getElementById('page-settings-panel')) return;

    // 1. Create Trigger Button
    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'btn btn-primary';
    triggerBtn.style.position = 'fixed';
    triggerBtn.style.bottom = '20px';
    triggerBtn.style.left = '20px';
    triggerBtn.style.zIndex = '1031';
    triggerBtn.style.borderRadius = '50%';
    triggerBtn.style.width = '48px';
    triggerBtn.style.height = '48px';
    triggerBtn.style.padding = '0';
    triggerBtn.style.display = 'flex';
    triggerBtn.style.alignItems = 'center';
    triggerBtn.style.justifyContent = 'center';
    triggerBtn.style.boxShadow = 'var(--shadow-lg)';
    triggerBtn.title = 'Page Settings';
    triggerBtn.innerHTML = '<i data-feather="settings"></i>';
    document.body.appendChild(triggerBtn);

    // 2. Create Panel
    const panel = document.createElement('div');
    panel.id = 'page-settings-panel';
    panel.className = 'page-settings-panel';
    panel.innerHTML = `
        <div class="page-settings-header">
            <span>Page Settings</span>
            <button class="btn btn-ghost btn-xs" id="close-settings"><i data-feather="x"></i></button>
        </div>

        <div class="setting-group">
            <span class="setting-label">Font Size</span>
            <div class="setting-controls">
                <button class="setting-btn" id="font-dec"><i data-feather="minus"></i></button>
                <button class="setting-btn" id="font-reset">Default</button>
                <button class="setting-btn" id="font-inc"><i data-feather="plus"></i></button>
            </div>
        </div>

        <div class="setting-group">
            <span class="setting-label">Sections</span>
            <div class="setting-controls">
                <button class="setting-btn" id="sections-expand">Expand All</button>
                <button class="setting-btn" id="sections-collapse">Collapse All</button>
            </div>
        </div>

        <div class="setting-group">
            <span class="setting-label">Proofs & Solutions</span>
            <div class="setting-controls">
                <button class="setting-btn" id="proofs-expand">Show All</button>
                <button class="setting-btn" id="proofs-collapse">Hide All</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 3. Event Listeners

    // Toggle Panel
    triggerBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
    });
    document.getElementById('close-settings').addEventListener('click', () => {
        panel.classList.remove('active');
    });

    // Font Size Logic
    const root = document.documentElement;
    let currentSizeLevel = 0; // 0 = Default (1rem)
    const sizes = ['0.875rem', '0.9375rem', '1rem', '1.125rem', '1.25rem', '1.375rem', '1.5rem'];
    const defaultIndex = 2; // 1rem
    let currentIndex = defaultIndex;

    const updateFont = () => {
        root.style.setProperty('--font-size-base', sizes[currentIndex]);
        // Visual feedback
        document.getElementById('font-reset').textContent = (currentIndex === defaultIndex) ? 'Default' : sizes[currentIndex];
    };

    document.getElementById('font-dec').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateFont();
        }
    });

    document.getElementById('font-inc').addEventListener('click', () => {
        if (currentIndex < sizes.length - 1) {
            currentIndex++;
            updateFont();
        }
    });

    document.getElementById('font-reset').addEventListener('click', () => {
        currentIndex = defaultIndex;
        updateFont();
    });

    // Global Toggles: Sections
    const toggleSections = (expand) => {
        document.querySelectorAll('.hierarchical-section').forEach(sec => {
            if (expand) {
                sec.classList.remove('collapsed');
            } else {
                sec.classList.add('collapsed');
            }
            // Update icon
            const h = sec.querySelector('h2, h3');
            const icon = h ? h.querySelector('.toggle-icon') : null;
            if (icon) {
                icon.innerHTML = expand ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-right"></i>';
            }
        });
        feather.replace();
    };

    document.getElementById('sections-expand').addEventListener('click', () => toggleSections(true));
    document.getElementById('sections-collapse').addEventListener('click', () => toggleSections(false));

    // Global Toggles: Proofs/Environments
    const toggleEnvs = (expand) => {
        const selector = '.proof-box, .solution-box, .recap-box, .answer';
        document.querySelectorAll(selector).forEach(box => {
            if (expand) {
                box.classList.remove('env-collapsed');
            } else {
                box.classList.add('env-collapsed');
            }
            // Update icon btn
            const btn = box.querySelector('.env-toggle-btn');
            if (btn) {
                btn.innerHTML = expand ? '<i data-feather="chevron-up"></i>' : '<i data-feather="chevron-down"></i>';
            }
        });
        feather.replace();
    };

    document.getElementById('proofs-expand').addEventListener('click', () => toggleEnvs(true));
    document.getElementById('proofs-collapse').addEventListener('click', () => toggleEnvs(false));
}


/* =========================================
   4. SIDEBAR & THEME (Legacy/Existing)
   ========================================= */
function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    if (document.getElementById('sidebar-toggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebar-toggle';
    toggleBtn.className = 'btn btn-ghost';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '80px'; // Shifted up
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
    toggleBtn.title = 'Toggle Sidebar';

    toggleBtn.innerHTML = '<i data-feather="layout"></i>'; // Changed icon to distinguish from sidebar icon

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
}

function setTheme(themeId) {
    if (themeId === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', themeId);
    }
    localStorage.setItem('theme', themeId);
}
