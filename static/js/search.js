/**
 * Global Search Widget
 * A centralized search bar in the header that indexes page content and user notes.
 */

class GlobalSearch {
    constructor() {
        this.searchIndex = [];
        this.isOpen = false;
        this.selectedIndex = -1;
        this.results = [];

        // Configuration
        this.options = {
            snippetLength: 60,
            maxResults: 15
        };

        this.init();
    }

    init() {
        this.injectSearchBar();
        // Wait briefly for content to render? Or trust DOMContentLoaded
        this.buildIndex();
        this.bindEvents();
    }

    injectSearchBar() {
        const headerContainer = document.querySelector('.site-header .container');
        if (!headerContainer) return;

        // Check if already injected
        if (headerContainer.querySelector('.header-search')) return;

        // Create Search Container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'header-search';

        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <i data-feather="search" class="search-icon"></i>
                <input type="text" placeholder="Search... (Cmd+K)" id="global-search-input" autocomplete="off" aria-label="Search">
                <div class="search-shortcut">⌘K</div>
            </div>
            <div class="search-results-dropdown hidden" id="search-results"></div>
        `;

        // Insert after Brand, before Nav
        const nav = headerContainer.querySelector('.nav');
        headerContainer.insertBefore(searchContainer, nav);

        this.input = searchContainer.querySelector('input');
        this.resultsContainer = searchContainer.querySelector('#search-results');

        if (typeof feather !== 'undefined') feather.replace();
    }

    buildIndex() {
        this.searchIndex = [];

        // 1. Index Page Content
        const content = document.querySelector('.lecture-content') || document.querySelector('main');
        if (content) {
            // Headers
            content.querySelectorAll('h1, h2, h3, h4').forEach((el) => {
                this.addToIndex(el, 'header', 10);
            });

            // Definitions & Important Terms
            content.querySelectorAll('.definition-term, strong, b, .definition-link').forEach((el) => {
                this.addToIndex(el, 'term', 5);
            });

            // Text blocks (Paragraphs, List Items)
            content.querySelectorAll('p, li').forEach((el) => {
                // Avoid indexing short nav items or controls
                if (el.innerText.length > 20) {
                    this.addToIndex(el, 'content', 1);
                }
            });
        }

        // 2. Index Notes (from LocalStorage)
        const lectureId = window.location.pathname;
        const notesJson = localStorage.getItem(`kw-notes-${lectureId}`);
        if (notesJson) {
            try {
                const notes = JSON.parse(notesJson);
                notes.forEach(note => {
                    this.searchIndex.push({
                        type: 'note',
                        text: note.text,
                        tags: note.tags || [],
                        weight: 3,
                        id: note.id,
                        timestamp: note.timestamp,
                        element: null,
                        context: 'My Note'
                    });
                });
            } catch (e) {
                console.error('Error loading notes for search', e);
            }
        }
    }

    addToIndex(el, type, weight) {
        const text = el.innerText.trim();
        if (!text) return;

        // Ensure ID for scrolling
        if (!el.id) {
             el.id = `search-ref-${Math.random().toString(36).substr(2, 9)}`;
        }

        this.searchIndex.push({
            type: type,
            text: text,
            weight: weight,
            element: el,
            id: el.id,
            context: this.findContext(el)
        });
    }

    findContext(el) {
        // Find the nearest preceding header to give context
        let curr = el;
        while (curr && curr !== document.body) {
            if (/^H[1-6]$/.test(curr.tagName)) return curr.innerText;
            const prev = curr.previousElementSibling;
            if (prev && /^H[1-6]$/.test(prev.tagName)) return prev.innerText;
            curr = curr.parentElement;
        }
        return 'General';
    }

    bindEvents() {
        if (!this.input) return;

        // Input events
        this.input.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.input.addEventListener('focus', () => {
            if (this.input.value.trim()) this.showResults();
        });

        // Keyboard navigation
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.input.focus();
            }
            if (e.key === 'Escape') {
                this.hideResults();
                this.input.blur();
            }
        });

        // Click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header-search')) {
                this.hideResults();
            }
        });
    }

    handleSearch(query) {
        if (!query || query.length < 2) {
            this.results = [];
            this.renderResults();
            this.hideResults();
            return;
        }

        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

        // Scoring and Filtering
        const scored = this.searchIndex.map(item => {
            let score = 0;
            const text = item.text.toLowerCase();
            const tags = item.tags ? item.tags.join(' ').toLowerCase() : '';

            terms.forEach(term => {
                if (text.includes(term)) score += (item.weight * 10);
                if (tags.includes(term)) score += (item.weight * 15);

                // Boost for starts with
                if (text.startsWith(term)) score += 5;
            });

            return { item, score };
        }).filter(r => r.score > 0);

        // Sort by score
        scored.sort((a, b) => b.score - a.score);

        // De-duplicate (if multiple p tags are same content)
        // Not strictly necessary but good for quality.
        const seen = new Set();
        this.results = [];
        for (let r of scored) {
            if (this.results.length >= this.options.maxResults) break;
            if (!seen.has(r.item.id)) { // using ID or text hash
                 seen.add(r.item.id);
                 this.results.push(r.item);
            }
        }

        this.selectedIndex = -1; // Reset selection
        this.renderResults(query);
        this.showResults();
    }

    renderResults(query) {
        this.resultsContainer.innerHTML = '';

        if (this.results.length === 0) {
            this.resultsContainer.innerHTML = '<div style="padding:12px; text-align:center; color:var(--text-tertiary); font-size:var(--text-sm);">No results found.</div>';
            return;
        }

        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';

        this.results.forEach((res, idx) => {
            const li = document.createElement('li');
            li.className = 'search-result-item'; // CSS handles styling (hover, selected)
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid var(--border-subtle)';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.gap = '10px';
            li.dataset.index = idx;

            const icon = this.getIconForType(res.type);
            const snippet = this.highlightText(this.getSnippet(res.text, query), query);
            
            // Badge logic
            let badge = '';
            if (res.type === 'header') badge = '<span style="font-size:0.65rem; padding:2px 6px; border-radius:4px; background:rgba(255,255,255,0.1); margin-left:8px;">SECTION</span>';
            if (res.type === 'note') badge = '<span style="font-size:0.65rem; padding:2px 6px; border-radius:4px; background:rgba(59,130,246,0.1); color:var(--primary-400); margin-left:8px;">NOTE</span>';

            li.innerHTML = `
                <div style="color:var(--text-tertiary); padding-top:2px;">${icon}</div>
                <div style="flex:1; min-width:0;">
                    <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary); margin-bottom:2px; display:flex; align-items:center;">
                        ${res.context}
                        ${badge}
                    </div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4;">${snippet}</div>
                </div>
            `;

            li.addEventListener('click', () => this.selectResult(res));
            ul.appendChild(li);
        });

        this.resultsContainer.appendChild(ul);
        if (typeof feather !== 'undefined') feather.replace();
    }

    getIconForType(type) {
        if (type === 'note') return '<i data-feather="edit-3" style="width:16px; height:16px;"></i>';
        if (type === 'header') return '<i data-feather="hash" style="width:16px; height:16px;"></i>';
        if (type === 'term') return '<i data-feather="book" style="width:16px; height:16px;"></i>';
        return '<i data-feather="align-left" style="width:16px; height:16px;"></i>';
    }

    getSnippet(text, query) {
        if (this.options.snippetLength > text.length) return text;

        // Find first occurrence of query
        const term = query.toLowerCase().split(' ')[0];
        const idx = text.toLowerCase().indexOf(term);

        if (idx === -1) return text.substring(0, this.options.snippetLength) + '...';

        const start = Math.max(0, idx - 20);
        const end = Math.min(text.length, idx + this.options.snippetLength);

        return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
    }

    highlightText(text, query) {
        const terms = query.toLowerCase().split(/\s+/).filter(t => t);
        let html = text; // Assumed safe plain text

        // Sort terms by length desc to handle overlapping
        terms.sort((a, b) => b.length - a.length);

        terms.forEach(term => {
            // Escape special regex chars
            const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${safeTerm})`, 'gi');
            html = html.replace(regex, '<mark style="background:rgba(251,191,36,0.2); color:var(--warning); padding:0 1px; border-radius:2px;">$1</mark>');
        });
        return html;
    }

    handleKeydown(e) {
        if (this.results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
            this.updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
            this.updateSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedIndex >= 0) {
                this.selectResult(this.results[this.selectedIndex]);
            }
        }
    }

    updateSelection() {
        const items = this.resultsContainer.querySelectorAll('.search-result-item');
        items.forEach((item, idx) => {
            if (idx === this.selectedIndex) {
                item.style.background = 'var(--bg-surface-2)';
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.style.background = 'transparent';
            }
        });
    }

    selectResult(res) {
        if (res.type === 'note') {
            if (window.knowledgeWidget) {
                if (window.knowledgeWidget.panel.style.display === 'none') {
                    window.knowledgeWidget.togglePanel();
                }
                window.knowledgeWidget.switchTab('notes');
            } else {
                alert('Notes widget not available.');
            }
        } else if (res.element) {
            res.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Visual Flash
            const originalBg = res.element.style.backgroundColor;
            res.element.style.transition = 'background-color 0.5s';
            res.element.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
            setTimeout(() => {
                res.element.style.backgroundColor = originalBg;
            }, 1500);
        }

        this.hideResults();
        this.input.blur();
    }

    showResults() {
        this.resultsContainer.classList.remove('hidden');
        this.isOpen = true;
    }

    hideResults() {
        this.resultsContainer.classList.add('hidden');
        this.isOpen = false;
        this.selectedIndex = -1;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only init if header exists
    if (document.querySelector('.site-header')) {
        window.globalSearch = new GlobalSearch();
    }
});
