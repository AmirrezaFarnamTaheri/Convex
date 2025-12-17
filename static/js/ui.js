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
    initBackToTop();
    if (typeof feather !== 'undefined') feather.replace();
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
    // Initially explicit height handling often helps smooth transitions,
    // but CSS typically handles max-height: 0 vs scrollHeight.
    
    while (box.firstChild) {
        contentWrapper.appendChild(box.firstChild);
    }
    box.appendChild(contentWrapper);

    // Toggle Button
    const btn = document.createElement('button');
    btn.className = 'env-toggle-btn';
    // Use feather icons if available, else text fallback
    btn.innerHTML = defaultCollapsed ? '<i data-feather="chevron-down"></i>' : '<i data-feather="chevron-up"></i>';
    btn.setAttribute('aria-label', 'Toggle ' + label);
    btn.setAttribute('title', 'Toggle ' + label);
    // Style adjustments for the button are in CSS (absolute top-right)

    box.appendChild(btn);

    if (defaultCollapsed) {
        box.classList.add('env-collapsed');
        contentWrapper.style.display = 'none'; // Hard hide initially to prevent layout jumps
    } else {
        contentWrapper.style.display = 'block';
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = box.classList.toggle('env-collapsed');
        
        // Handling display for animation
        if (isCollapsed) {
            contentWrapper.style.display = 'none';
            btn.innerHTML = '<i data-feather="chevron-down"></i>';
        } else {
            contentWrapper.style.display = 'block';
            btn.innerHTML = '<i data-feather="chevron-up"></i>';
        }
        
        if (typeof feather !== 'undefined') feather.replace();
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
        card.classList.add('hierarchical-section'); 
        h2.style.cursor = 'pointer';
        h2.classList.add('section-toggle');
        
        const originalText = h2.innerHTML;
        // Check if icon already exists to avoid duplication on re-run
        if (!h2.querySelector('.toggle-icon')) {
            h2.innerHTML = `<span class="toggle-icon" style="margin-right:8px; display:inline-block;"><i data-feather="chevron-down"></i></span><span class="header-text">${originalText}</span>`;
        }

        h2.addEventListener('click', () => {
            const isCollapsed = card.classList.toggle('collapsed');
            const icon = h2.querySelector('.toggle-icon');
            
            if (isCollapsed) {
                 contentWrapper.classList.add('hidden');
            } else {
                 contentWrapper.classList.remove('hidden');
            }

            if (icon) {
                icon.innerHTML = isCollapsed ? '<i data-feather="chevron-right"></i>' : '<i data-feather="chevron-down"></i>';
                if (typeof feather !== 'undefined') feather.replace();
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
            h3.innerHTML = `<span class="toggle-icon" style="margin-right:8px; display:inline-block;"><i data-feather="chevron-down"></i></span>${originalText}`;

            currentContent = document.createElement('div');
            currentContent.className = 'hierarchical-content';

            h3.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCollapsed = currentSubsection.classList.toggle('collapsed');
                
                if (isCollapsed) {
                    currentContent.classList.add('hidden');
                } else {
                    currentContent.classList.remove('hidden');
                }

                const icon = h3.querySelector('.toggle-icon');
                if (icon) {
                    icon.innerHTML = isCollapsed ? '<i data-feather="chevron-right"></i>' : '<i data-feather="chevron-down"></i>';
                    if (typeof feather !== 'undefined') feather.replace();
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
    // Deprecated in new design - font size control moved to settings panel
    // Keeping function structure if called, but implementation merged into initPageSettings
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
    panel.className = 'section-card'; // Reusing card style for consistent look
    panel.style.position = 'fixed';
    panel.style.bottom = '80px';
    panel.style.left = '20px';
    panel.style.width = '300px';
    panel.style.zIndex = '1032';
    panel.style.display = 'none';
    panel.style.padding = 'var(--space-4)';
    panel.style.margin = '0';

    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-4); border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-2);">
            <h4 style="margin:0; font-size:var(--text-base);">Settings</h4>
            <button class="btn btn-ghost btn-xs" id="close-settings"><i data-feather="x"></i></button>
        </div>

        <div class="control-group" style="margin-bottom: var(--space-4);">
            <label>Font Size</label>
            <div style="display:flex; gap:8px;">
                <button class="btn btn-secondary btn-sm" id="font-dec" style="flex:1;"><i data-feather="minus"></i></button>
                <button class="btn btn-ghost btn-sm" id="font-reset" style="flex:1;">Reset</button>
                <button class="btn btn-secondary btn-sm" id="font-inc" style="flex:1;"><i data-feather="plus"></i></button>
            </div>
        </div>

        <div class="control-group" style="margin-bottom: var(--space-4);">
            <label>View Mode</label>
            <button class="btn btn-secondary btn-sm" id="toggle-fullscreen" style="width: 100%;"><i data-feather="maximize"></i> Full Screen</button>
        </div>

        <div class="control-group" style="margin-bottom: var(--space-4);">
            <label>Content Expansion</label>
            <div style="display:flex; gap:8px;">
                <button class="btn btn-secondary btn-sm" id="sections-expand" style="flex:1;">Expand All</button>
                <button class="btn btn-secondary btn-sm" id="sections-collapse" style="flex:1;">Collapse</button>
            </div>
        </div>
    `;

    // Resizable logic could be added here if needed, but fixed width is cleaner for settings
    
    document.body.appendChild(panel);

    // 3. Event Listeners

    // Toggle Panel
    triggerBtn.addEventListener('click', () => {
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            triggerBtn.classList.add('active');
        } else {
            panel.style.display = 'none';
            triggerBtn.classList.remove('active');
        }
    });
    
    document.getElementById('close-settings').addEventListener('click', () => {
        panel.style.display = 'none';
        triggerBtn.classList.remove('active');
    });

    // Font Size Logic
    const root = document.documentElement;
    const sizes = ['0.875rem', '0.9375rem', '1rem', '1.125rem', '1.25rem', '1.375rem', '1.5rem'];
    const defaultIndex = 2; // 1rem
    let currentIndex = defaultIndex;

    // Load saved font size
    const savedFont = localStorage.getItem('font-size-index');
    if (savedFont !== null) {
        currentIndex = parseInt(savedFont, 10);
        root.style.setProperty('--text-base', sizes[currentIndex]);
    }

    const updateFont = () => {
        root.style.setProperty('--text-base', sizes[currentIndex]);
        localStorage.setItem('font-size-index', currentIndex);
        document.getElementById('font-reset').textContent = (currentIndex === defaultIndex) ? 'Reset' : sizes[currentIndex];
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
            if (typeof feather !== 'undefined') feather.replace();
        });
    }

    // Global Toggles
    const toggleSections = (expand) => {
        document.querySelectorAll('.hierarchical-section').forEach(sec => {
            const h = sec.querySelector('h2, h3');
            const icon = h ? h.querySelector('.toggle-icon') : null;
            const content = sec.querySelector('.hierarchical-content');

            if (expand) {
                sec.classList.remove('collapsed');
                if (content) content.classList.remove('hidden');
                if (icon) icon.innerHTML = '<i data-feather="chevron-down"></i>';
            } else {
                sec.classList.add('collapsed');
                if (content) content.classList.add('hidden');
                if (icon) icon.innerHTML = '<i data-feather="chevron-right"></i>';
            }
        });
        
        // Also toggle Proofs/Boxes
        const selector = '.proof-box, .solution-box, .recap-box, .answer';
        document.querySelectorAll(selector).forEach(box => {
            const btn = box.querySelector('.env-toggle-btn');
            const content = box.querySelector('.env-collapsible-content');
            
            if (expand) {
                box.classList.remove('env-collapsed');
                if (content) content.style.display = 'block';
                if (btn) btn.innerHTML = '<i data-feather="chevron-up"></i>';
            } else {
                box.classList.add('env-collapsed');
                if (content) content.style.display = 'none';
                if (btn) btn.innerHTML = '<i data-feather="chevron-down"></i>';
            }
        });

        if (typeof feather !== 'undefined') feather.replace();
    };

    document.getElementById('sections-expand').addEventListener('click', () => toggleSections(true));
    document.getElementById('sections-collapse').addEventListener('click', () => toggleSections(false));
}


/* =========================================
   4. SIDEBAR TOGGLE
   ========================================= */
function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    if (document.getElementById('sidebar-toggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebar-toggle';
    toggleBtn.className = 'btn btn-secondary';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '80px'; 
    toggleBtn.style.left = '20px';
    toggleBtn.style.zIndex = '1030';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.width = '48px';
    toggleBtn.style.height = '48px';
    toggleBtn.style.padding = '0';
    toggleBtn.style.display = 'none'; // Hidden by default, shown via media query typically
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.title = 'Toggle Sidebar';

    toggleBtn.innerHTML = '<i data-feather="menu"></i>';

    document.body.appendChild(toggleBtn);

    // Show button only on smaller screens via JS check
    const checkSize = () => {
        if (window.innerWidth <= 1024) {
            toggleBtn.style.display = 'flex';
        } else {
            toggleBtn.style.display = 'none';
            sidebar.classList.remove('active'); // Reset sidebar on large screens
        }
    };
    
    window.addEventListener('resize', checkSize);
    checkSize();

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        // We might need CSS to handle .sidebar.active for mobile slide-in
        if (sidebar.classList.contains('active')) {
             sidebar.style.position = 'fixed';
             sidebar.style.top = '70px';
             sidebar.style.left = '0';
             sidebar.style.height = 'calc(100vh - 70px)';
             sidebar.style.width = '80%';
             sidebar.style.maxWidth = '300px';
             sidebar.style.zIndex = '2000';
             sidebar.style.background = 'var(--bg-surface-1)';
             sidebar.style.borderRight = '1px solid var(--border-subtle)';
             sidebar.style.padding = 'var(--space-4)';
             sidebar.style.display = 'block';
        } else {
             sidebar.style = ''; // Reset inline styles
        }
    });
}

/* =========================================
   5. BACK TO TOP BUTTON
   ========================================= */
function initBackToTop() {
    if (document.getElementById('back-to-top')) return;

    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'btn btn-primary';
    btn.innerHTML = '<i data-feather="arrow-up"></i>';
    btn.title = 'Back to Top';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '1020';
    btn.style.borderRadius = '50%';
    btn.style.width = '48px';
    btn.style.height = '48px';
    btn.style.padding = '0';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.boxShadow = 'var(--shadow-lg)';
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(20px)';
    btn.style.transition = 'all 0.3s ease';
    btn.style.pointerEvents = 'none';

    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
            btn.style.pointerEvents = 'all';
        } else {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            btn.style.pointerEvents = 'none';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
