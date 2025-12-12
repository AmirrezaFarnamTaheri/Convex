/**
 * UI Enhancements for Convex Optimization Course
 * Handles:
 * - Collapsible Environment Boxes (Proofs, Examples, Solutions)
 * - Hierarchical Section/Subsection Toggling
 * - Page Settings (Font Size, Global Toggles, Layout)
 * - Sidebar/TOC Toggling & Resizing
 * - Theme Switching (via theme-switcher.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    initCollapsibleEnvironments();
    initHierarchicalSections();
    initPageSettings();
    initHeaderFontSize();
    initSidebarToggle();
    // initThemeSwitcher(); // Moved to theme-switcher.js
    feather.replace();
});

/* =========================================
   1. COLLAPSIBLE ENVIRONMENTS
   ========================================= */
function initCollapsibleEnvironments() {
    const collapsibleSelectors = [
        { selector: '.theorem-box', defaultCollapsed: false, label: 'Theorem' },
        { selector: '.proof-box', defaultCollapsed: true, label: 'Proof' },
        { selector: '.solution-box', defaultCollapsed: true, label: 'Solution' },
        { selector: '.answer', defaultCollapsed: true, label: 'Answer' },
        { selector: '.recap-box', defaultCollapsed: true, label: 'Recap' },
        { selector: '.example', defaultCollapsed: false, label: 'Example' },
        { selector: '.example-box', defaultCollapsed: false, label: 'Example' },
        { selector: '.intuition-box', defaultCollapsed: false, label: 'Intuition' },
        { selector: '.interpretation-box', defaultCollapsed: false, label: 'Interpretation' }
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
function initHeaderFontSize() {
    const header = document.querySelector('.site-header');
    if (header && typeof Resizable !== 'undefined') {
        new Resizable(header, {
            saveKey: 'site-header',
            handles: ['s'],
            minHeight: 60,
            onResize: () => {
                // Adjust main content padding to match header height
                // Default padding is 32px 0 60px.
                // But sticky sidebar logic relies on top offset.
                // .sidebar top: 100px.
                // We should probably update that dynamically if we were thorough.
                // For now, visual resizing is the main goal.
            }
        });
    }

    const nav = document.querySelector('.site-header .nav');
    if (!nav) return;
    if (document.getElementById('header-font-controls')) return;

    const container = document.createElement('div');
    container.id = 'header-font-controls';
    container.className = 'header-font-controls';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.marginLeft = '16px';
    container.style.gap = '8px';

    const btnDec = document.createElement('button');
    btnDec.className = 'btn btn-ghost btn-sm';
    btnDec.innerHTML = '<i data-feather="minus"></i>';
    btnDec.title = 'Decrease Font Size';
    btnDec.style.padding = '4px 8px';

    const btnInc = document.createElement('button');
    btnInc.className = 'btn btn-ghost btn-sm';
    btnInc.innerHTML = '<i data-feather="plus"></i>';
    btnInc.title = 'Increase Font Size';
    btnInc.style.padding = '4px 8px';

    // Logic
    const root = document.documentElement;
    const sizes = ['0.875rem', '0.9375rem', '1rem', '1.125rem', '1.25rem', '1.375rem', '1.5rem'];
    let currentIndex = 2; // Default 1rem

    // Sync with existing settings if any
    const saved = localStorage.getItem('font-size-index');
    if (saved !== null) {
        currentIndex = parseInt(saved, 10);
        root.style.setProperty('--font-size-base', sizes[currentIndex]);
    }

    const update = () => {
        root.style.setProperty('--font-size-base', sizes[currentIndex]);
        localStorage.setItem('font-size-index', currentIndex);
    };

    btnDec.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            update();
        }
    });

    btnInc.addEventListener('click', () => {
        if (currentIndex < sizes.length - 1) {
            currentIndex++;
            update();
        }
    });

    container.appendChild(btnDec);
    container.appendChild(btnInc);
    nav.appendChild(container);
}

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
            <span class="setting-label">Sidebar Width (<span id="sidebar-width-label">85%</span>)</span>
            <input type="range" id="toc-width-slider" min="70" max="115" value="85" style="width: 100%">
        </div>

        <div class="setting-group">
            <span class="setting-label">View</span>
            <button class="setting-btn" id="toggle-fullscreen" style="width: 100%; margin-bottom: 8px;"><i data-feather="maximize"></i> Full Screen</button>
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

    // Resizable (Initialize AFTER innerHTML)
    if (typeof Resizable !== 'undefined') {
        new Resizable(panel, {
            saveKey: 'page-settings-panel',
            handles: ['n', 'e', 'ne'],
            minWidth: 260,
            minHeight: 200
        });
    }

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

    // Sidebar Resizer
    initTocResizer();

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


function initTocResizer() {
    const slider = document.getElementById('toc-width-slider');
    const label = document.getElementById('sidebar-width-label');
    if (!slider) return;

    // Load saved width
    const savedWidth = localStorage.getItem('toc-width-percent');
    if (savedWidth) {
        slider.value = savedWidth;
        updateTocWidth(savedWidth);
    } else {
        // Default 85%
        slider.value = 85;
        updateTocWidth(85);
    }

    if (label) label.textContent = slider.value + '%';

    slider.addEventListener('input', (e) => {
        const percent = e.target.value;
        if (label) label.textContent = percent + '%';
        updateTocWidth(percent);
        localStorage.setItem('toc-width-percent', percent);
    });

    // Fullscreen toggle
    const fsBtn = document.getElementById('toggle-fullscreen');
    if (fsBtn) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                fsBtn.innerHTML = '<i data-feather="minimize"></i> Exit Full Screen';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    fsBtn.innerHTML = '<i data-feather="maximize"></i> Full Screen';
                }
            }
            feather.replace();
        });
    }
}

function updateTocWidth(percent) {
    // Base width is approx 330px (280px + padding/margins) or we define 100% as 330px
    // Let's assume 100% = 330px.
    // Actually, user said "70% of current version to 115%". Current is 280px.
    const baseWidth = 330; // 280px roughly
    const newWidth = (percent / 100) * baseWidth;
    document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
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
