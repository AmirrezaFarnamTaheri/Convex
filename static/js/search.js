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
        this.buildIndex();
        this.bindEvents();
    }

    injectSearchBar() {
        const headerContainer = document.querySelector('.site-header .container');
        if (!headerContainer) return;

        // Create Search Container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'header-search';

        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <i data-feather="search" class="search-icon"></i>
                <input type="text" placeholder="Search... (Ctrl+K)" id="global-search-input" autocomplete="off">
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
        // We prioritize headers, then definitions, then normal text
        const content = document.querySelector('.lecture-content') || document.querySelector('main');
        if (content) {
            // Headers
            content.querySelectorAll('h1, h2, h3, h4').forEach((el, idx) => {
                this.addToIndex(el, 'header', 10);
            });

            // Definitions
            content.querySelectorAll('.definition-term, strong, b').forEach((el) => {
                this.addToIndex(el, 'term', 5);
            });

            // Text blocks
            content.querySelectorAll('p, li').forEach((el) => {
                this.addToIndex(el, 'content', 1);
            });
        }

        // 2. Index Notes (from LocalStorage)
        // Format: kw-notes-{lectureId}
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
                        element: null // No direct DOM element, will handle differently
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
        // Find the nearest preceding header
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

                // Boost for exact match or starts with
                if (text.startsWith(term)) score += 5;
            });

            return { item, score };
        }).filter(r => r.score > 0);

        // Sort by score
        scored.sort((a, b) => b.score - a.score);

        this.results = scored.slice(0, this.options.maxResults).map(r => r.item);
        this.selectedIndex = -1; // Reset selection
        this.renderResults(query);
        this.showResults();
    }

    renderResults(query) {
        this.resultsContainer.innerHTML = '';

        if (this.results.length === 0) {
            this.resultsContainer.innerHTML = '<div class="search-empty">No results found.</div>';
            return;
        }

        const ul = document.createElement('ul');
        this.results.forEach((res, idx) => {
            const li = document.createElement('li');
            li.className = 'search-result-item';
            li.dataset.index = idx;

            const icon = this.getIconForType(res.type);
            const snippet = this.highlightText(this.getSnippet(res.text, query), query);
            const title = res.type === 'note' ? 'My Note' : res.context;

            li.innerHTML = `
                <div class="result-icon">${icon}</div>
                <div class="result-content">
                    <div class="result-title">
                        ${title}
                        ${res.type === 'header' ? '<span class="badge">Section</span>' : ''}
                        ${res.type === 'note' ? '<span class="badge badge-note">Note</span>' : ''}
                    </div>
                    <div class="result-snippet">${snippet}</div>
                </div>
            `;

            li.addEventListener('click', () => this.selectResult(res));
            ul.appendChild(li);
        });

        this.resultsContainer.appendChild(ul);
        if (typeof feather !== 'undefined') feather.replace();
    }

    getIconForType(type) {
        if (type === 'note') return '<i data-feather="edit-3"></i>';
        if (type === 'header') return '<i data-feather="hash"></i>';
        if (type === 'term') return '<i data-feather="book"></i>';
        return '<i data-feather="align-left"></i>';
    }

    getSnippet(text, query) {
        if (this.options.snippetLength > text.length) return text;

        // Find first occurrence of query
        // Simple case: use first term
        const term = query.toLowerCase().split(' ')[0];
        const idx = text.toLowerCase().indexOf(term);

        if (idx === -1) return text.substring(0, this.options.snippetLength) + '...';

        const start = Math.max(0, idx - 20);
        const end = Math.min(text.length, idx + this.options.snippetLength);

        return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
    }

    highlightText(text, query) {
        const terms = query.toLowerCase().split(/\s+/).filter(t => t);
        let html = text;

        // Very basic highlighting (warning: not HTML safe if text contains HTML, but text usually plain here)
        // Ideally use a safer approach or escape text first.
        // Assuming text is plain text from innerText.

        // Sort terms by length desc to handle overlapping
        terms.sort((a, b) => b.length - a.length);

        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            html = html.replace(regex, '<mark>$1</mark>');
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
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    selectResult(res) {
        if (res.type === 'note') {
            // Open Notes Widget
            if (window.knowledgeWidget) {
                window.knowledgeWidget.panel.classList.remove('hidden');
                window.knowledgeWidget.switchTab('notes');
                // Could scroll to note if implemented
            } else {
                alert('Notes widget not available.');
            }
        } else if (res.element) {
            res.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Flash effect
            res.element.classList.add('highlight-flash');
            setTimeout(() => res.element.classList.remove('highlight-flash'), 2000);
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
    window.globalSearch = new GlobalSearch();
});
