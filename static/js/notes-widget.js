/**
 * Notes Widget
 * Allows users to take notes per lecture/section.
 * Persists to LocalStorage.
 * Supports Markdown rendering via marked.js.
 * Features: Auto-pairing characters, Word Autocomplete.
 */

class NotesWidget {
    constructor() {
        this.container = null;
        this.panel = null;
        this.notes = [];
        this.lectureId = window.location.pathname; // Use path as ID for simplicity
        this.isPreviewMode = false;

        // Autocomplete State
        this.vocabulary = new Set();
        this.activeSuggestionIndex = 0;
        this.suggestions = [];
        this.caretCoordinates = null;

        this.init();
    }

    async init() {
        await this.loadDependencies();
        this.buildVocabulary();
        this.loadNotes();
        this.createUI();
        this.renderNotes();
    }

    async loadDependencies() {
        if (typeof marked === 'undefined') {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    }

    buildVocabulary() {
        // Simple scraper for technical terms in the lecture content
        const content = document.querySelector('.lecture-content');
        if (!content) return;

        const text = content.innerText;
        // Match words of length >= 4
        const words = text.match(/\b[A-Za-z]{4,}\b/g);

        if (words) {
            words.forEach(word => this.vocabulary.add(word.toLowerCase()));
        }

        // Add common markdown terms or specific course terms
        ['convex', 'optimization', 'function', 'matrix', 'vector', 'duality', 'lagrangian', 'gradient', 'hessian', 'algorithm'].forEach(w => this.vocabulary.add(w));
    }

    loadNotes() {
        const saved = localStorage.getItem(`notes-${this.lectureId}`);
        this.notes = saved ? JSON.parse(saved) : [];

        // Add user's own words to vocabulary
        this.notes.forEach(note => {
            const words = note.text.match(/\b[A-Za-z]{4,}\b/g);
            if (words) words.forEach(w => this.vocabulary.add(w.toLowerCase()));
        });
    }

    saveNotes() {
        localStorage.setItem(`notes-${this.lectureId}`, JSON.stringify(this.notes));
    }

    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'notes-widget-container';

        // Toggle Button
        const toggle = document.createElement('button');
        toggle.className = 'notes-toggle';
        toggle.innerHTML = '<i data-feather="edit-2"></i>';
        toggle.onclick = () => this.togglePanel();

        // Panel
        this.panel = document.createElement('div');
        this.panel.className = 'notes-panel hidden';
        this.panel.innerHTML = `
            <div class="notes-header">
                <div style="display: flex; gap: 8px; align-items: center;">
                    <strong>Notes</strong>
                    <button class="btn btn-ghost btn-sm" id="notes-mode-toggle" title="Toggle Preview" style="padding: 2px 6px; font-size: 10px;">
                        <i data-feather="eye"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" id="notes-clear-all" title="Clear All" style="padding: 2px 6px; font-size: 10px;">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
                <button class="btn btn-ghost" style="padding: 4px;" onclick="document.querySelector('.notes-panel').classList.add('hidden')">
                    <i data-feather="x"></i>
                </button>
            </div>
            <div class="notes-content" id="notes-list"></div>
            <div style="padding: 10px; border-top: 1px solid var(--border-subtle);">
                <button class="btn btn-primary" style="width: 100%; justify-content: center;" id="add-note-btn">
                    <i data-feather="plus"></i> Add Note
                </button>
            </div>

            <!-- Autocomplete Popup -->
            <div id="notes-autocomplete-popup" class="notes-autocomplete hidden"></div>
        `;

        this.container.appendChild(this.panel);
        this.container.appendChild(toggle);
        document.body.appendChild(this.container);

        // Bind Events
        this.panel.querySelector('#add-note-btn').onclick = () => this.addNote();
        this.panel.querySelector('#notes-mode-toggle').onclick = () => this.togglePreviewMode();
        this.panel.querySelector('#notes-clear-all').onclick = () => this.clearAllNotes();

        this.autocompletePopup = this.panel.querySelector('#notes-autocomplete-popup');

        if (typeof feather !== 'undefined') feather.replace();
    }

    togglePanel() {
        this.panel.classList.toggle('hidden');
    }

    togglePreviewMode() {
        this.isPreviewMode = !this.isPreviewMode;
        const btn = this.panel.querySelector('#notes-mode-toggle');
        btn.innerHTML = this.isPreviewMode ? '<i data-feather="edit"></i>' : '<i data-feather="eye"></i>';
        if (typeof feather !== 'undefined') feather.replace();
        this.renderNotes();
    }

    addNote() {
        const note = {
            id: Date.now(),
            text: '',
            timestamp: new Date().toISOString()
        };
        this.notes.push(note);
        if (this.isPreviewMode) this.togglePreviewMode();
        this.renderNotes();
        this.saveNotes();

        // Focus new textarea
        setTimeout(() => {
            const textareas = this.panel.querySelectorAll('textarea');
            if(textareas.length > 0) textareas[textareas.length - 1].focus();
        }, 50);
    }

    deleteNote(id) {
        if(confirm('Delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.renderNotes();
            this.saveNotes();
        }
    }

    clearAllNotes() {
        if(this.notes.length === 0) return;
        if(confirm('Are you sure you want to delete ALL notes for this page? This cannot be undone.')) {
            this.notes = [];
            this.renderNotes();
            this.saveNotes();
        }
    }

    updateNote(id, text) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            note.text = text;
            this.saveNotes();
        }
    }

    renderNotes() {
        const list = this.panel.querySelector('#notes-list');
        list.innerHTML = '';

        if (this.notes.length === 0) {
            list.innerHTML = '<div style="text-align: center; color: var(--text-secondary); margin-top: 20px;">No notes yet. Click "Add Note" to start.</div>';
            return;
        }

        this.notes.forEach(note => {
            const item = document.createElement('div');
            item.className = 'note-item';

            const header = document.createElement('div');
            header.className = 'note-item-header';
            header.innerHTML = `
                <span>${new Date(note.timestamp).toLocaleDateString()} ${new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <i data-feather="trash-2" style="cursor: pointer; width: 14px; height: 14px;" class="delete-note"></i>
            `;
            header.querySelector('.delete-note').onclick = () => this.deleteNote(note.id);

            item.appendChild(header);

            if (this.isPreviewMode) {
                const preview = document.createElement('div');
                preview.className = 'note-preview markdown-body';
                preview.style.padding = '8px';
                preview.style.fontSize = '0.9em';

                if (typeof marked !== 'undefined') {
                    preview.innerHTML = marked.parse(note.text || '*Empty note*');
                } else {
                    preview.textContent = note.text;
                }
                item.appendChild(preview);
            } else {
                const textarea = document.createElement('textarea');
                textarea.className = 'note-textarea';
                textarea.value = note.text;
                textarea.placeholder = 'Type your note here... (Markdown supported)';

                // Event Handlers for Auto-helpers
                textarea.addEventListener('input', (e) => {
                    this.updateNote(note.id, e.target.value);
                    this.handleInput(e, textarea);
                });

                textarea.addEventListener('keydown', (e) => this.handleKeyDown(e, textarea, note.id));
                textarea.addEventListener('blur', () => {
                    // Delay hiding to allow click event on popup
                    setTimeout(() => this.hideAutocomplete(), 200);
                });

                item.appendChild(textarea);
            }

            list.appendChild(item);
        });

        if (typeof feather !== 'undefined') feather.replace();
    }

    // --- Auto-Helper Logic ---

    handleKeyDown(e, textarea, noteId) {
        // Markdown Pairing
        const pairs = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'",
            '`': '`',
            '*': '*',
            '_': '_'
        };

        if (pairs[e.key]) {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const open = e.key;
            const close = pairs[e.key];

            // Insert pair
            textarea.value = text.substring(0, start) + open + close + text.substring(end);

            // Move cursor inside
            textarea.selectionStart = textarea.selectionEnd = start + 1;

            this.updateNote(noteId, textarea.value);
            return;
        }

        // Autocomplete Navigation
        if (!this.autocompletePopup.classList.contains('hidden')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.activeSuggestionIndex = (this.activeSuggestionIndex + 1) % this.suggestions.length;
                this.renderSuggestions();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.activeSuggestionIndex = (this.activeSuggestionIndex - 1 + this.suggestions.length) % this.suggestions.length;
                this.renderSuggestions();
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                this.applySuggestion(textarea, noteId);
            } else if (e.key === 'Escape') {
                this.hideAutocomplete();
            }
        }
    }

    handleInput(e, textarea) {
        const text = textarea.value;
        const cursor = textarea.selectionStart;

        // Get word before cursor
        const leftText = text.substring(0, cursor);
        const match = leftText.match(/\b([a-zA-Z]{2,})$/); // Start suggesting after 2 chars

        if (match) {
            const prefix = match[1].toLowerCase();
            this.suggestions = Array.from(this.vocabulary)
                .filter(w => w.startsWith(prefix) && w !== prefix)
                .slice(0, 5); // Limit to 5 suggestions

            if (this.suggestions.length > 0) {
                this.activeSuggestionIndex = 0;
                this.showAutocomplete(textarea, cursor, match[1].length);
            } else {
                this.hideAutocomplete();
            }
        } else {
            this.hideAutocomplete();
        }
    }

    showAutocomplete(textarea, cursorPosition, prefixLength) {
        // Position logic is simplified for relative placement
        // Real caret coordinates are hard in raw textarea without mirror div
        // We will position it at the bottom of the textarea for simplicity in this iteration

        this.autocompletePopup.classList.remove('hidden');
        this.renderSuggestions();

        // Approximate positioning (or just fixed at bottom of input area)
        // For a more robust solution, we'd need a library like textarea-caret-position
        // Here we just place it near the bottom of the panel content
        const rect = textarea.getBoundingClientRect();
        const panelRect = this.panel.getBoundingClientRect();

        this.autocompletePopup.style.bottom = '60px'; // Above the "Add Note" button
        this.autocompletePopup.style.left = '20px';
        this.autocompletePopup.style.width = (panelRect.width - 40) + 'px';
    }

    hideAutocomplete() {
        this.autocompletePopup.classList.add('hidden');
    }

    renderSuggestions() {
        this.autocompletePopup.innerHTML = '';
        this.suggestions.forEach((word, index) => {
            const div = document.createElement('div');
            div.className = `suggestion-item ${index === this.activeSuggestionIndex ? 'active' : ''}`;
            div.textContent = word;
            div.onclick = () => {
                // We need reference to current textarea, which is tricky in click handler
                // Rely on keyboard nav for now or find active element
                const activeEl = this.panel.querySelector('textarea:focus') || document.activeElement;
                if(activeEl && activeEl.tagName === 'TEXTAREA') {
                     // Need to find note ID... simplified:
                     // Ideally pass context. For click, we might need a stored reference.
                }
            };
            this.autocompletePopup.appendChild(div);
        });
    }

    applySuggestion(textarea, noteId) {
        const word = this.suggestions[this.activeSuggestionIndex];
        if (!word) return;

        const cursor = textarea.selectionStart;
        const text = textarea.value;
        const leftText = text.substring(0, cursor);

        // Find start of current word
        const match = leftText.match(/\b([a-zA-Z]+)$/);
        if (match) {
            const prefixLen = match[1].length;
            const newText = text.substring(0, cursor - prefixLen) + word + text.substring(cursor);
            textarea.value = newText;
            textarea.selectionStart = textarea.selectionEnd = cursor - prefixLen + word.length;
            this.updateNote(noteId, newText);
        }

        this.hideAutocomplete();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new NotesWidget();
});
