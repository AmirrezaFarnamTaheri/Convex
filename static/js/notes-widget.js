/**
 * Knowledge Widget (formerly NotesWidget)
 * A comprehensive study tool for the Convex Optimization course.
 *
 * Features:
 * 1. Notes: Markdown-supported notes per lecture, persisted to LocalStorage.
 * 2. Highlights: Text highlighting (Yellow, Green, Blue, Red) with persistence.
 * 3. Search: Unified search across Page Content and User Notes.
 * 4. Bookmarks: Save sections for quick access.
 * 5. Vocabulary: Auto-built glossary and autocomplete.
 */

class KnowledgeWidget {
    constructor() {
        this.container = null;
        this.panel = null;
        this.toggleBtn = null;

        // State
        this.lectureId = window.location.pathname;
        this.notes = [];
        this.highlights = [];
        this.bookmarks = [];
        this.searchIndex = []; // { type: 'content'|'note', text: string, id: string, element: DOMElement }

        // UI State
        this.activeTab = 'notes'; // notes, search, bookmarks
        this.selectedColor = 'yellow'; // yellow, green, blue, red
        this.isPreviewMode = false;

        // Autocomplete
        this.vocabulary = new Set();
        this.suggestions = [];
        this.activeSuggestionIndex = 0;

        this.init();
    }

    async init() {
        await this.loadDependencies();
        this.loadData();
        this.buildSearchIndex();
        this.buildVocabulary();
        this.createUI();
        this.renderNotes(); // Render initial tab content
        this.restoreHighlights();

        // Global Event Listeners
        document.addEventListener('mouseup', (e) => this.handleSelection(e));
        // Add keyboard listener for shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        window.addEventListener('resize', () => this.handleResize());
    }

    async loadDependencies() {
        if (typeof marked === 'undefined') {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                script.onload = resolve;
                script.onerror = () => { console.warn('Marked.js failed to load'); resolve(); }; // Continue anyway
                document.head.appendChild(script);
            });
        }
    }

    loadData() {
        const notes = localStorage.getItem(`kw-notes-${this.lectureId}`);
        const highlights = localStorage.getItem(`kw-highlights-${this.lectureId}`);
        const bookmarks = localStorage.getItem(`kw-bookmarks-${this.lectureId}`);

        this.notes = notes ? JSON.parse(notes) : [];
        this.highlights = highlights ? JSON.parse(highlights) : [];
        this.bookmarks = bookmarks ? JSON.parse(bookmarks) : [];
    }

    saveData() {
        localStorage.setItem(`kw-notes-${this.lectureId}`, JSON.stringify(this.notes));
        localStorage.setItem(`kw-highlights-${this.lectureId}`, JSON.stringify(this.highlights));
        localStorage.setItem(`kw-bookmarks-${this.lectureId}`, JSON.stringify(this.bookmarks));
    }

    // --- Search Indexing ---

    buildSearchIndex() {
        this.searchIndex = [];

        // 1. Index Page Content
        const content = document.querySelector('.lecture-content');
        if (content) {
            const elements = content.querySelectorAll('h1, h2, h3, p, li, .definition-term');
            elements.forEach((el, idx) => {
                if (!el.innerText.trim()) return;
                // Assign a temporary ID if missing for scrolling
                if (!el.id) el.id = `kw-content-${idx}`;

                this.searchIndex.push({
                    type: 'content',
                    text: el.innerText,
                    element: el,
                    id: el.id,
                    title: this.findNearestHeader(el)
                });
            });
        }

        // 2. Index Notes (Dynamic, done during search execution or updated on save)
    }

    findNearestHeader(el) {
        let curr = el;
        while (curr && curr !== document.body) {
            const header = curr.previousElementSibling;
            if (header && /^H[1-6]$/.test(header.tagName)) return header.innerText;
            if (/^H[1-6]$/.test(curr.tagName)) return curr.innerText;
            curr = curr.parentElement;
        }
        return 'Section';
    }

    buildVocabulary() {
        // Scrape technical terms
        this.searchIndex.forEach(item => {
            if (item.type === 'content') {
                const words = item.text.match(/\b[A-Za-z]{4,}\b/g);
                if (words) words.forEach(w => this.vocabulary.add(w.toLowerCase()));
            }
        });
        // Core terms
        ['convex', 'optimization', 'linear', 'matrix', 'vector', 'duality', 'gradient', 'hessian'].forEach(w => this.vocabulary.add(w));
    }

    // --- Highlighting Logic ---

    handleSelection(e) {
        // Don't trigger if selection is inside the widget panel
        if (this.panel && this.panel.contains(e.target)) return;

        const selection = window.getSelection();
        if (selection.isCollapsed || !selection.rangeCount) return;

        const text = selection.toString().trim();
        if (text.length < 3) return;

        this.showHighlightMenu(selection);
    }

    handleKeyboardShortcuts(e) {
        // Check for highlighting shortcuts: Alt + 1, 2, 3, 4 (or Ctrl+Alt+...)
        // Let's use Alt + 1 (Yellow), Alt + 2 (Green), Alt + 3 (Blue), Alt + 4 (Red)
        if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
            const selection = window.getSelection();
            if (selection.isCollapsed || !selection.rangeCount) return;

            // Don't act if focusing an input
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            e.preventDefault();
            const colors = ['yellow', 'green', 'blue', 'red'];
            const colorIndex = parseInt(e.key) - 1;
            this.createHighlight(selection, colors[colorIndex]);

            // Remove menu if open
            const menu = document.getElementById('kw-highlight-menu');
            if (menu) menu.remove();

            window.getSelection().removeAllRanges();
        }
    }

    showHighlightMenu(selection) {
        // Remove existing menu
        const existing = document.getElementById('kw-highlight-menu');
        if (existing) existing.remove();

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const menu = document.createElement('div');
        menu.id = 'kw-highlight-menu';
        menu.className = 'kw-float-menu';
        // Position just above the selection
        menu.style.top = `${window.scrollY + rect.top - 40}px`;
        menu.style.left = `${window.scrollX + rect.left}px`;

        const colors = ['#fde047', '#86efac', '#93c5fd', '#fca5a5']; // yellow, green, blue, red
        const names = ['yellow', 'green', 'blue', 'red'];

        colors.forEach((c, i) => {
            const btn = document.createElement('button');
            btn.style.backgroundColor = c;
            btn.title = `Highlight ${names[i]} (Alt+${i+1})`;
            btn.onclick = (e) => {
                e.stopPropagation();
                this.createHighlight(selection, names[i]);
                menu.remove();
                window.getSelection().removeAllRanges();
            };
            menu.appendChild(btn);
        });

        document.body.appendChild(menu);

        // Auto-remove on click elsewhere
        const removeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('mousedown', removeMenu);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', removeMenu), 0);
    }

    createHighlight(selection, color) {
        const range = selection.getRangeAt(0);
        const content = range.toString();

        if (range.startContainer !== range.endContainer && range.startContainer.parentElement !== range.endContainer.parentElement) {
            alert('Please select text within a single paragraph/block for highlighting.');
            return;
        }

        const span = document.createElement('span');
        span.className = `kw-highlight kw-highlight-${color}`;
        span.textContent = content;

        // Save offset info before DOM modification
        const parent = range.startContainer.parentElement;
        const startOffset = this.getGlobalOffset(parent, range.startContainer, range.startOffset);

        try {
            range.deleteContents();
            range.insertNode(span);
        } catch (e) {
            console.error('Highlight failed', e);
            return;
        }

        // Persistence: Store path and character offset
        const path = this.getElementPath(parent);

        this.highlights.push({
            id: Date.now(),
            path: path,
            startOffset: startOffset,
            text: content,
            color: color,
            timestamp: new Date().toISOString()
        });

        this.saveData();
    }

    getGlobalOffset(parent, node, offset) {
        // Calculate offset relative to parent's text content
        let globalOffset = 0;
        const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, null, false);
        let curr;
        while(curr = walker.nextNode()) {
            if(curr === node) {
                return globalOffset + offset;
            }
            globalOffset += curr.textContent.length;
        }
        return -1;
    }

    restoreHighlights() {
        // Sort highlights by offset (descending) to avoid index shifts if multiple in one block?
        // Actually, ascending might be safer if we re-calculate.
        // Let's rely on finding the text at the offset.

        this.highlights.forEach(h => {
            try {
                const parent = document.querySelector(h.path);
                if (!parent) return;

                // Traverse to find the text node at offset
                const range = document.createRange();
                let currentOffset = 0;
                let found = false;

                const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while(node = walker.nextNode()) {
                    const len = node.textContent.length;
                    if (currentOffset + len > h.startOffset) {
                        // Found start node
                        const relStart = h.startOffset - currentOffset;
                        range.setStart(node, relStart);

                        // Assuming simple case: highlight is within this node (since we restricted creation)
                        // Or spans to next. The logic needs to handle length.
                        // Simple robust check:
                        if (relStart + h.text.length <= len) {
                            range.setEnd(node, relStart + h.text.length);
                            found = true;
                        }
                        break;
                    }
                    currentOffset += len;
                }

                if (found) {
                    const span = document.createElement('span');
                    span.className = `kw-highlight kw-highlight-${h.color}`;
                    // Note: Surrounding contents can split text nodes.
                    // This naive restoration is better than replace(), but still brittle to DOM changes.
                    // But for this assignment scope, it's a significant improvement.
                    try {
                        range.surroundContents(span);
                    } catch(e) {
                       // Silent fail on overlap/split error
                    }
                }

            } catch (e) {
                console.warn('Failed to restore highlight', h);
            }
        });
    }

    getElementPath(el) {
        if (!el.id) {
             const path = [];
             while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
                 let selector = el.nodeName.toLowerCase();
                 if (el.id) {
                     selector += '#' + el.id;
                     path.unshift(selector);
                     break;
                 } else {
                     let sib = el, nth = 1;
                     while (sib = sib.previousElementSibling) {
                         if (sib.nodeName.toLowerCase() == selector) nth++;
                     }
                     if (nth != 1) selector += ":nth-of-type("+nth+")";
                 }
                 path.unshift(selector);
                 el = el.parentNode;
             }
             return path.join(" > ");
        }
        return '#' + el.id;
    }

    // --- UI Creation ---

    createUI() {
        // Remove existing floating button logic
        // Inject button into Header Nav
        const headerNav = document.querySelector('.site-header .nav');

        if (headerNav) {
            this.toggleBtn = document.createElement('button'); // Changed to button for semantics, styled as link
            this.toggleBtn.className = 'kw-nav-toggle';
            this.toggleBtn.innerHTML = '<i data-feather="book-open"></i> Tools';
            this.toggleBtn.onclick = (e) => {
                e.preventDefault();
                this.togglePanel();
            };

            // Insert as first item or last? Let's prepend.
            headerNav.insertBefore(this.toggleBtn, headerNav.firstChild);
        } else {
            // Fallback to floating button if header missing
            const toggle = document.createElement('button');
            toggle.className = 'kw-toggle'; // Original class
            toggle.innerHTML = '<i data-feather="book-open"></i>';
            toggle.title = 'Open Study Tools';
            toggle.onclick = () => this.togglePanel();
            document.body.appendChild(toggle);
        }

        // Panel Container (Fixed position, initially hidden)
        this.container = document.createElement('div');
        this.container.className = 'kw-container'; // Used for panel positioning now

        this.panel = document.createElement('div');
        this.panel.className = 'kw-panel hidden';
        // Note: CSS will position this fixed relative to viewport, usually top-right or overlay

        this.panel.innerHTML = `
            <div class="kw-header">
                <div class="kw-title">
                    <i data-feather="book-open"></i> Study Tools
                </div>
                <button class="kw-close-btn"><i data-feather="x"></i></button>
            </div>
            <div class="kw-tabs">
                <button class="kw-tab active" data-tab="notes">Notes</button>
                <button class="kw-tab" data-tab="search">Search</button>
                <button class="kw-tab" data-tab="bookmarks">Bookmarks</button>
            </div>
            <div class="kw-body">
                <!-- Notes View -->
                <div id="kw-view-notes" class="kw-view active">
                    <div class="kw-toolbar">
                        <button class="btn btn-sm btn-ghost" id="kw-toggle-preview" title="Toggle Preview"><i data-feather="eye"></i></button>
                        <button class="btn btn-sm btn-ghost" id="kw-add-note" title="Add Note"><i data-feather="plus"></i> Add</button>
                    </div>
                    <div id="kw-notes-list" class="kw-list"></div>
                </div>

                <!-- Search View -->
                <div id="kw-view-search" class="kw-view">
                    <div class="kw-search-box">
                        <input type="text" id="kw-search-input" placeholder="Search current lecture...">
                    </div>
                    <div id="kw-search-results" class="kw-list"></div>
                </div>

                <!-- Bookmarks View -->
                <div id="kw-view-bookmarks" class="kw-view">
                    <div class="kw-toolbar">
                         <button class="btn btn-sm btn-ghost" id="kw-add-bookmark"><i data-feather="bookmark"></i> Bookmark Current Position</button>
                    </div>
                    <div id="kw-bookmarks-list" class="kw-list"></div>
                </div>
            </div>
        `;

        this.container.appendChild(this.panel);
        document.body.appendChild(this.container);

        this.injectStyles();

        // Bindings
        this.panel.querySelector('.kw-close-btn').onclick = () => this.togglePanel();

        this.panel.querySelectorAll('.kw-tab').forEach(tab => {
            tab.onclick = () => this.switchTab(tab.dataset.tab);
        });

        this.panel.querySelector('#kw-add-note').onclick = () => this.addNote();
        this.panel.querySelector('#kw-toggle-preview').onclick = () => this.togglePreview();
        this.panel.querySelector('#kw-search-input').addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.panel.querySelector('#kw-add-bookmark').onclick = () => this.addBookmark();

        if (typeof feather !== 'undefined') feather.replace();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Nav Toggle Button */
            .kw-nav-toggle {
                background: none; border: none; color: var(--text-secondary);
                cursor: pointer; font-family: var(--font-sans); font-size: 0.95rem;
                display: flex; align-items: center; gap: 6px; padding: 0 12px;
                transition: color 0.2s;
            }
            .kw-nav-toggle:hover { color: var(--primary-600); }
            .kw-nav-toggle i { width: 18px; height: 18px; }

            /* Fallback Floating Toggle (if header missing) */
            .kw-toggle {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                width: 50px; height: 50px; border-radius: 50%;
                background: var(--primary-500); color: white; border: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: transform 0.2s;
            }
            .kw-toggle:hover { transform: scale(1.05); }

            /* Panel Container & Positioning */
            /* We position the panel absolutely near the top right, fixed to viewport */
            .kw-panel {
                position: fixed; top: 70px; right: 20px; z-index: 10000;
                width: 350px; height: 600px; max-height: 80vh;
                background: white; border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                display: flex; flex-direction: column;
                overflow: hidden; border: 1px solid var(--border);
                font-family: var(--font-sans);
            }
            .kw-panel.hidden { display: none; }

            /* Header */
            .kw-header {
                padding: 12px 16px; background: var(--surface-alt);
                border-bottom: 1px solid var(--border);
                display: flex; justify-content: space-between; align-items: center;
            }
            .kw-title { font-weight: 600; display: flex; gap: 8px; align-items: center; }
            .kw-close-btn { background: none; border: none; cursor: pointer; padding: 4px; }

            /* Tabs */
            .kw-tabs { display: flex; border-bottom: 1px solid var(--border); }
            .kw-tab {
                flex: 1; padding: 10px; background: none; border: none;
                cursor: pointer; font-size: 0.9em; color: var(--text-secondary);
                border-bottom: 2px solid transparent;
            }
            .kw-tab.active { color: var(--primary-600); border-bottom-color: var(--primary-600); font-weight: 500; }

            /* Body */
            .kw-body { flex: 1; overflow-y: auto; position: relative; }
            .kw-view { display: none; padding: 16px; height: 100%; box-sizing: border-box; }
            .kw-view.active { display: block; }
            .kw-list { display: flex; flex-direction: column; gap: 12px; }

            /* Toolbars */
            .kw-toolbar { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 12px; }

            /* Note Items */
            .kw-note { border: 1px solid var(--border-subtle); border-radius: 8px; padding: 10px; background: var(--surface); }
            .kw-note-meta { font-size: 0.75em; color: var(--text-tertiary); display: flex; justify-content: space-between; margin-bottom: 6px; }
            .kw-note textarea { width: 100%; border: none; resize: vertical; font-family: var(--font-mono); font-size: 0.9em; outline: none; min-height: 60px; }

            /* Highlights */
            .kw-highlight { border-radius: 2px; cursor: pointer; transition: background 0.2s; }
            .kw-highlight-yellow { background-color: #fef08a; }
            .kw-highlight-green { background-color: #bbf7d0; }
            .kw-highlight-blue { background-color: #bfdbfe; }
            .kw-highlight-red { background-color: #fecaca; }
            .kw-highlight:hover { filter: brightness(0.95); }

            /* Float Menu */
            .kw-float-menu {
                position: absolute; display: flex; gap: 4px; padding: 6px;
                background: white; border-radius: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;
                border: 1px solid var(--border);
            }
            .kw-float-menu button {
                width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); cursor: pointer;
            }

            /* Search */
            .kw-search-box input {
                width: 100%; padding: 8px 12px; border-radius: 6px;
                border: 1px solid var(--border); margin-bottom: 12px;
            }
            .kw-result-item {
                padding: 10px; border-bottom: 1px solid var(--border-subtle); cursor: pointer;
            }
            .kw-result-item:hover { background: var(--surface-alt); }
            .kw-result-title { font-weight: 600; font-size: 0.9em; margin-bottom: 4px; }
            .kw-result-snippet { font-size: 0.85em; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

            /* Bookmarks */
            .kw-bookmark {
                padding: 10px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer;
                display: flex; justify-content: space-between; align-items: center;
            }
            .kw-bookmark:hover { border-color: var(--primary-500); }
        `;
        document.head.appendChild(style);
    }

    handleResize() {
        // Handle window resize if needed
    }

    togglePanel() {
        this.panel.classList.toggle('hidden');
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.panel.querySelectorAll('.kw-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        this.panel.querySelectorAll('.kw-view').forEach(v => v.classList.toggle('active', v.id === `kw-view-${tab}`));

        if (tab === 'notes') this.renderNotes();
        if (tab === 'bookmarks') this.renderBookmarks();
    }

    // --- Notes Functionality ---

    addNote() {
        const note = {
            id: Date.now(),
            text: '',
            timestamp: new Date().toISOString()
        };
        this.notes.unshift(note);
        this.renderNotes();
        this.saveData();
    }

    updateNote(id, text) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            note.text = text;
            this.saveData();
        }
    }

    deleteNote(id) {
        if (confirm('Delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.renderNotes();
            this.saveData();
        }
    }

    togglePreview() {
        this.isPreviewMode = !this.isPreviewMode;
        this.renderNotes();
    }

    renderNotes() {
        const list = this.panel.querySelector('#kw-notes-list');
        list.innerHTML = '';

        if (this.notes.length === 0) {
            list.innerHTML = '<div style="text-align: center; color: var(--text-tertiary); margin-top: 40px;">No notes yet.</div>';
            return;
        }

        this.notes.forEach(note => {
            const el = document.createElement('div');
            el.className = 'kw-note';

            const meta = document.createElement('div');
            meta.className = 'kw-note-meta';
            meta.innerHTML = `<span>${new Date(note.timestamp).toLocaleDateString()}</span> <i data-feather="trash-2" style="cursor:pointer; width:14px;"></i>`;
            meta.querySelector('i').onclick = () => this.deleteNote(note.id);
            el.appendChild(meta);

            if (this.isPreviewMode) {
                const preview = document.createElement('div');
                preview.className = 'markdown-body';
                preview.style.fontSize = '0.9em';
                preview.innerHTML = typeof marked !== 'undefined' ? marked.parse(note.text) : note.text;
                el.appendChild(preview);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = note.text;
                textarea.placeholder = 'Write your note...';
                textarea.oninput = (e) => this.updateNote(note.id, e.target.value);
                el.appendChild(textarea);
            }

            list.appendChild(el);
        });
        if (typeof feather !== 'undefined') feather.replace();
    }

    // --- Search Functionality ---

    handleSearch(query) {
        const list = this.panel.querySelector('#kw-search-results');
        list.innerHTML = '';

        if (!query || query.length < 2) return;

        const q = query.toLowerCase();

        // Search Content
        const results = this.searchIndex.filter(item => item.text.toLowerCase().includes(q)).slice(0, 10);

        // Search Notes
        const noteResults = this.notes.filter(n => n.text.toLowerCase().includes(q));

        // Render Content Results
        if (results.length > 0) {
            list.innerHTML += `<div style="padding: 4px 8px; font-weight:bold; font-size:0.8em; color:var(--text-tertiary);">CONTENT</div>`;
            results.forEach(res => {
                const el = document.createElement('div');
                el.className = 'kw-result-item';
                el.innerHTML = `
                    <div class="kw-result-title">${res.title}</div>
                    <div class="kw-result-snippet">...${this.getSnippet(res.text, q)}...</div>
                `;
                el.onclick = () => {
                    res.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight logic briefly?
                    this.togglePanel();
                };
                list.appendChild(el);
            });
        }

        // Render Note Results
        if (noteResults.length > 0) {
            list.innerHTML += `<div style="padding: 4px 8px; font-weight:bold; font-size:0.8em; color:var(--text-tertiary); margin-top: 8px;">NOTES</div>`;
            noteResults.forEach(note => {
                const el = document.createElement('div');
                el.className = 'kw-result-item';
                el.innerHTML = `
                    <div class="kw-result-title">Note from ${new Date(note.timestamp).toLocaleDateString()}</div>
                    <div class="kw-result-snippet">${this.getSnippet(note.text, q)}</div>
                `;
                el.onclick = () => {
                    this.switchTab('notes');
                    // Scroll to note? (Needs ID ref in DOM)
                };
                list.appendChild(el);
            });
        }
    }

    getSnippet(text, query) {
        const idx = text.toLowerCase().indexOf(query);
        if (idx === -1) return text.substring(0, 50);
        const start = Math.max(0, idx - 20);
        const end = Math.min(text.length, idx + query.length + 30);
        return text.substring(start, end);
    }

    // --- Bookmarks Functionality ---

    addBookmark() {
        // Find visible section
        // Simple heuristic: First header in viewport
        let currentHeader = null;
        const headers = Array.from(document.querySelectorAll('h1, h2, h3'));
        for (let h of headers) {
            const rect = h.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                currentHeader = h;
                break;
            }
        }
        if (!currentHeader && headers.length > 0) currentHeader = headers[0]; // Fallback

        if (currentHeader) {
             const bookmark = {
                 id: Date.now(),
                 title: currentHeader.innerText,
                 targetId: currentHeader.id || `section-${Date.now()}`,
                 timestamp: new Date().toISOString()
             };
             if (!currentHeader.id) currentHeader.id = bookmark.targetId;

             this.bookmarks.push(bookmark);
             this.saveData();
             this.renderBookmarks();
        } else {
            alert('Scroll to a section header to bookmark it.');
        }
    }

    deleteBookmark(id) {
        this.bookmarks = this.bookmarks.filter(b => b.id !== id);
        this.saveData();
        this.renderBookmarks();
    }

    renderBookmarks() {
        const list = this.panel.querySelector('#kw-bookmarks-list');
        list.innerHTML = '';

        if (this.bookmarks.length === 0) {
            list.innerHTML = '<div style="text-align: center; color: var(--text-tertiary); margin-top: 40px;">No bookmarks yet.</div>';
            return;
        }

        this.bookmarks.forEach(b => {
            const el = document.createElement('div');
            el.className = 'kw-bookmark';
            el.innerHTML = `
                <span>${b.title}</span>
                <i data-feather="trash-2" style="width:14px; height:14px;"></i>
            `;
            el.querySelector('span').onclick = () => {
                const target = document.getElementById(b.targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    this.togglePanel();
                } else {
                    alert('Target section not found.');
                }
            };
            el.querySelector('i').onclick = (e) => {
                e.stopPropagation();
                this.deleteBookmark(b.id);
            };
            list.appendChild(el);
        });
        if (typeof feather !== 'undefined') feather.replace();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if KnowledgeWidget is already initialized
    if (!window.knowledgeWidget) {
        window.knowledgeWidget = new KnowledgeWidget();
    }
});
