/**
 * Notes Widget
 * Allows users to take notes per lecture/section.
 * Persists to LocalStorage.
 */

class NotesWidget {
    constructor() {
        this.container = null;
        this.panel = null;
        this.notes = [];
        this.lectureId = window.location.pathname; // Use path as ID for simplicity

        this.init();
    }

    init() {
        this.loadNotes();
        this.createUI();
        this.renderNotes();
    }

    loadNotes() {
        const saved = localStorage.getItem(`notes-${this.lectureId}`);
        this.notes = saved ? JSON.parse(saved) : [];
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
                <strong>Notes</strong>
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
        `;

        this.container.appendChild(this.panel);
        this.container.appendChild(toggle);
        document.body.appendChild(this.container);

        // Bind Add Event
        this.panel.querySelector('#add-note-btn').onclick = () => this.addNote();

        if (typeof feather !== 'undefined') feather.replace();
    }

    togglePanel() {
        this.panel.classList.toggle('hidden');
    }

    addNote() {
        const note = {
            id: Date.now(),
            text: '',
            timestamp: new Date().toISOString()
        };
        this.notes.push(note);
        this.renderNotes();
        this.saveNotes();
    }

    deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.renderNotes();
        this.saveNotes();
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

        this.notes.forEach(note => {
            const item = document.createElement('div');
            item.className = 'note-item';

            const header = document.createElement('div');
            header.className = 'note-item-header';
            header.innerHTML = `
                <span>${new Date(note.timestamp).toLocaleDateString()}</span>
                <i data-feather="trash-2" style="cursor: pointer; width: 14px; height: 14px;" class="delete-note"></i>
            `;
            header.querySelector('.delete-note').onclick = () => this.deleteNote(note.id);

            const textarea = document.createElement('textarea');
            textarea.className = 'note-textarea';
            textarea.value = note.text;
            textarea.placeholder = 'Type your note here... (Markdown supported)';
            textarea.oninput = (e) => this.updateNote(note.id, e.target.value);

            item.appendChild(header);
            item.appendChild(textarea);
            list.appendChild(item);
        });

        if (typeof feather !== 'undefined') feather.replace();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new NotesWidget();
});
