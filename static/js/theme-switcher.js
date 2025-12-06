/**
 * Theme Switcher Widget
 * Handles:
 * - Color Schemes (Default, Emerald, Amethyst, Sunset, Midnight, Forest)
 * - Typography (Inter, Serif, Mono, Lato, Merriweather)
 * - Header Widget Injection
 */

class ThemeSwitcher {
    constructor() {
        this.themes = {
            color: {
                label: 'Theme',
                icon: 'droplet',
                options: [
                    { id: 'default', name: 'Ocean', color: '#1890ff' },
                    { id: 'emerald', name: 'Emerald', color: '#10b981' },
                    { id: 'amethyst', name: 'Amethyst', color: '#8b5cf6' },
                    { id: 'sunset', name: 'Sunset', color: '#f97316' },
                    { id: 'midnight', name: 'Midnight', color: '#0ea5e9' },
                    { id: 'forest', name: 'Forest', color: '#22c55e' }
                ]
            },
            font: {
                label: 'Typography',
                icon: 'type',
                options: [
                    { id: 'sans', name: 'Inter (Sans)', font: "'Inter', sans-serif" },
                    { id: 'serif', name: 'Crimson Pro (Serif)', font: "'Crimson Pro', serif" },
                    { id: 'mono', name: 'Source Code Pro', font: "'Source Code Pro', monospace" },
                    { id: 'lato', name: 'Lato', font: "'Lato', sans-serif" },
                    { id: 'merriweather', name: 'Merriweather', font: "'Merriweather', serif" }
                ]
            }
        };

        this.init();
    }

    init() {
        this.injectStyles();
        this.createUI();
        this.loadPreferences();
    }

    injectStyles() {
        // Ensure fonts are loaded (Google Fonts import is in CSS, assume CSS is updated)
        // Add specific styles for the switcher if not in main CSS
        if (document.getElementById('theme-switcher-styles')) return;

        const style = document.createElement('style');
        style.id = 'theme-switcher-styles';
        style.textContent = `
            .theme-widget { position: relative; margin-left: 16px; }
            .theme-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
            .theme-btn:hover { background: var(--surface-2); color: var(--text-primary); border-color: var(--primary-500); }
            .theme-dropdown-panel { position: absolute; top: calc(100% + 8px); right: 0; width: 280px; background: var(--surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); padding: 12px; z-index: 1100; backdrop-filter: blur(10px); }
            .theme-dropdown-panel.hidden { display: none; }
            .theme-section { margin-bottom: 16px; }
            .theme-section:last-child { margin-bottom: 0; }
            .theme-section-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); margin-bottom: 8px; font-weight: 600; }
            .theme-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
            .theme-option-btn { display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid var(--border-subtle); background: var(--surface-2); border-radius: var(--radius-md); cursor: pointer; color: var(--text-secondary); font-size: 0.85rem; text-align: left; transition: all 0.1s; }
            .theme-option-btn:hover { background: var(--surface-3); color: var(--text-primary); }
            .theme-option-btn.active { border-color: var(--primary-500); background: rgba(24, 144, 255, 0.1); color: var(--primary-500); }
            .color-preview { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        `;
        document.head.appendChild(style);
    }

    createUI() {
        const nav = document.querySelector('.site-header .nav');
        if (!nav) return;

        // Remove old trigger if exists
        const old = document.getElementById('theme-widget-container');
        if (old) old.remove();

        const container = document.createElement('div');
        container.id = 'theme-widget-container';
        container.className = 'theme-widget';

        container.innerHTML = `
            <button class="theme-btn" id="theme-trigger">
                <i data-feather="sliders"></i> <span>Appearance</span>
            </button>
            <div class="theme-dropdown-panel hidden" id="theme-panel">
                <div class="theme-section">
                    <div class="theme-section-title">Color Theme</div>
                    <div class="theme-grid" id="color-options"></div>
                </div>
                <div class="theme-section">
                    <div class="theme-section-title">Typography</div>
                    <div class="theme-grid" id="font-options"></div>
                </div>
            </div>
        `;

        // Populate Colors
        const colorGrid = container.querySelector('#color-options');
        this.themes.color.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'theme-option-btn';
            btn.dataset.id = opt.id;
            btn.dataset.type = 'color';
            btn.innerHTML = `<span class="color-preview" style="background:${opt.color}"></span>${opt.name}`;
            btn.onclick = () => this.setTheme(opt.id);
            colorGrid.appendChild(btn);
        });

        // Populate Fonts
        const fontGrid = container.querySelector('#font-options');
        this.themes.font.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'theme-option-btn';
            btn.dataset.id = opt.id;
            btn.dataset.type = 'font';
            btn.style.fontFamily = opt.font;
            btn.textContent = opt.name;
            btn.onclick = () => this.setFont(opt.id);
            fontGrid.appendChild(btn);
        });

        nav.appendChild(container);

        // Events
        const trigger = container.querySelector('#theme-trigger');
        const panel = container.querySelector('#theme-panel');

        trigger.onclick = (e) => {
            e.stopPropagation();
            panel.classList.toggle('hidden');
        };

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                panel.classList.add('hidden');
            }
        });

        if (typeof feather !== 'undefined') feather.replace();
    }

    loadPreferences() {
        const savedTheme = localStorage.getItem('theme') || 'default';
        const savedFont = localStorage.getItem('font') || 'sans';

        this.setTheme(savedTheme, false);
        this.setFont(savedFont, false);
    }

    setTheme(id, save = true) {
        // Update DOM
        if (id === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', id);
        }

        // Update UI
        document.querySelectorAll('[data-type="color"]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.id === id);
        });

        if (save) localStorage.setItem('theme', id);
    }

    setFont(id, save = true) {
        const fontConfig = this.themes.font.options.find(o => o.id === id);
        if (fontConfig) {
            document.documentElement.style.setProperty('--font-sans', fontConfig.font);
        }

        // Update UI
        document.querySelectorAll('[data-type="font"]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.id === id);
        });

        if (save) localStorage.setItem('font', id);
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSwitcher();
});
