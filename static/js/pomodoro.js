/**
 * Pomodoro Timer Widget
 * A focus timer with customizable duration, visual/audio feedback, and draggable UI.
 */

class PomodoroWidget {
    constructor() {
        this.defaults = {
            workDuration: 25, // minutes
            breakDuration: 5,
        };

        // Load preferences
        const saved = JSON.parse(localStorage.getItem('pomodoro-prefs') || '{}');
        this.workDuration = saved.workDuration || this.defaults.workDuration;
        this.breakDuration = saved.breakDuration || this.defaults.breakDuration;

        // Load position
        this.position = saved.position || { bottom: '20px', left: '20px' };

        this.timeLeft = this.workDuration * 60;
        this.timerId = null;
        this.isRunning = false;
        this.mode = 'work'; // 'work' or 'break'

        this.init();
    }

    init() {
        this.createUI();
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    createUI() {
        if (document.querySelector('.pomodoro-widget')) return;

        const container = document.createElement('div');
        container.className = 'pomodoro-widget glass';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: this.position.bottom,
            left: this.position.left,
            zIndex: '5000',
            width: '240px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)'
        });

        container.innerHTML = `
            <div class="pomodoro-header" style="cursor: grab; background: var(--bg-surface-2); padding: 10px; border-radius: var(--radius-lg) var(--radius-lg) 0 0; display:flex; justify-content:space-between; align-items:center;">
                <div class="pomodoro-status" style="display:flex; align-items:center; gap:6px; font-weight:600; font-size:0.85em; color:var(--text-secondary);">
                    <i data-feather="${this.mode === 'work' ? 'briefcase' : 'coffee'}" style="width:14px; height:14px;"></i>
                    <span class="status-text">${this.mode === 'work' ? 'Focus' : 'Break'}</span>
                </div>
                <div class="pomodoro-actions" style="display:flex; gap:4px;">
                    <button class="btn btn-ghost btn-xs" id="pomo-minimize-btn" title="Minimize" style="padding:2px;"><i data-feather="minus" style="width:14px;"></i></button>
                    <button class="btn btn-ghost btn-xs" id="pomo-settings-btn" title="Settings" style="padding:2px;"><i data-feather="settings" style="width:14px;"></i></button>
                </div>
            </div>

            <div class="pomodoro-body" style="padding:16px; text-align:center;">
                <div class="pomodoro-time" style="font-family:var(--font-mono); font-size:2.5rem; font-weight:700; margin-bottom:12px; color:var(--text-heading);">${this.formatTime(this.timeLeft)}</div>

                <div class="pomodoro-controls" style="display:flex; justify-content:center; gap:8px;">
                    <button class="btn btn-primary btn-sm" id="pomo-toggle" style="width:80px;">
                        <i data-feather="play" style="width:14px;"></i> Start
                    </button>
                    <button class="btn btn-ghost btn-sm" id="pomo-reset" title="Reset">
                        <i data-feather="rotate-ccw" style="width:14px;"></i>
                    </button>
                </div>
            </div>

            <div class="pomodoro-settings hidden" style="padding:16px; border-top:1px solid var(--border-subtle);">
                <div class="control-group" style="margin-bottom:8px;">
                    <label style="font-size:0.8em; color:var(--text-tertiary);">Focus (min)</label>
                    <input type="number" id="pomo-work-input" value="${this.workDuration}" min="1" max="60" style="width:100%; padding:4px; background:var(--bg-surface-3); border:1px solid var(--border-subtle); color:var(--text-primary);">
                </div>
                <div class="control-group" style="margin-bottom:8px;">
                    <label style="font-size:0.8em; color:var(--text-tertiary);">Break (min)</label>
                    <input type="number" id="pomo-break-input" value="${this.breakDuration}" min="1" max="30" style="width:100%; padding:4px; background:var(--bg-surface-3); border:1px solid var(--border-subtle); color:var(--text-primary);">
                </div>
                <button class="btn btn-secondary btn-sm" id="pomo-save-settings" style="width:100%;">Save</button>
            </div>
        `;

        document.body.appendChild(container);

        this.container = container;
        this.header = container.querySelector('.pomodoro-header');
        this.display = container.querySelector('.pomodoro-time');
        this.toggleBtn = container.querySelector('#pomo-toggle');
        this.statusIcon = container.querySelector('.pomodoro-status i');
        this.statusText = container.querySelector('.pomodoro-status .status-text');
        this.settingsPanel = container.querySelector('.pomodoro-settings');
        this.body = container.querySelector('.pomodoro-body');
        this.minimizeBtn = container.querySelector('#pomo-minimize-btn');

        this.toggleBtn.onclick = () => this.toggle();
        container.querySelector('#pomo-reset').onclick = () => this.reset();
        container.querySelector('#pomo-settings-btn').onclick = () => this.toggleSettings();
        container.querySelector('#pomo-save-settings').onclick = () => this.saveSettings();
        this.minimizeBtn.onclick = () => this.toggleMinimize();

        this.initDragging();

        if (typeof Resizable !== 'undefined') {
            new Resizable(this.container, { saveKey: 'pomodoro', handles: [] }); // No resize needed really
        }

        if (localStorage.getItem('pomodoro-minimized') === 'true') {
            this.toggleMinimize(false);
        }

        if (typeof feather !== 'undefined') feather.replace();
    }

    initDragging() {
        let isDragging = false;
        let startX, startY, initialLeft, initialBottom;

        this.header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            isDragging = true;
            this.header.style.cursor = 'grabbing';
            startX = e.clientX;
            startY = e.clientY;
            const style = window.getComputedStyle(this.container);
            initialLeft = parseInt(style.left, 10);
            initialBottom = parseInt(style.bottom, 10);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY; // dy > 0 means mouse moved down
            
            let newLeft = initialLeft + dx;
            // Since bottom is fixed, increasing bottom moves UP.
            // If mouse moves down (dy > 0), bottom should decrease.
            let newBottom = initialBottom - dy; 

            this.container.style.left = `${newLeft}px`;
            this.container.style.bottom = `${newBottom}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            this.header.style.cursor = 'grab';
            this.savePosition();
        });
    }

    savePosition() {
        this.position = {
            left: this.container.style.left,
            bottom: this.container.style.bottom
        };
        const prefs = JSON.parse(localStorage.getItem('pomodoro-prefs') || '{}');
        prefs.position = this.position;
        localStorage.setItem('pomodoro-prefs', JSON.stringify(prefs));
    }

    toggleMinimize(save = true) {
        this.body.classList.toggle('hidden');
        const isHidden = this.body.classList.contains('hidden');
        
        if (isHidden) {
            this.minimizeBtn.innerHTML = '<i data-feather="maximize-2" style="width:14px;"></i>';
            this.statusText.textContent = this.formatTime(this.timeLeft);
        } else {
            this.minimizeBtn.innerHTML = '<i data-feather="minus" style="width:14px;"></i>';
            this.statusText.textContent = this.mode === 'work' ? 'Focus' : 'Break';
        }

        if (save) localStorage.setItem('pomodoro-minimized', isHidden);
        if (typeof feather !== 'undefined') feather.replace();
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    toggle() {
        if (this.isRunning) this.pause();
        else this.start();
    }

    start() {
        this.isRunning = true;
        this.toggleBtn.innerHTML = '<i data-feather="pause" style="width:14px;"></i> Pause';
        this.toggleBtn.classList.replace('btn-primary', 'btn-secondary');
        if (typeof feather !== 'undefined') feather.replace();

        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.display.textContent = this.formatTime(this.timeLeft);
            document.title = `(${this.formatTime(this.timeLeft)}) Convex Opt`;
            
            if (this.body.classList.contains('hidden')) {
                this.statusText.textContent = this.formatTime(this.timeLeft);
            }

            if (this.timeLeft <= 0) this.complete();
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.toggleBtn.innerHTML = '<i data-feather="play" style="width:14px;"></i> Resume';
        this.toggleBtn.classList.replace('btn-secondary', 'btn-primary');
        document.title = 'Convex Optimization';
        if (typeof feather !== 'undefined') feather.replace();
    }

    reset() {
        this.pause();
        this.timeLeft = (this.mode === 'work' ? this.workDuration : this.breakDuration) * 60;
        this.display.textContent = this.formatTime(this.timeLeft);
        this.toggleBtn.innerHTML = '<i data-feather="play" style="width:14px;"></i> Start';
        if (typeof feather !== 'undefined') feather.replace();
    }

    complete() {
        this.pause();
        this.sendNotification();
        if (this.mode === 'work') {
            this.mode = 'break';
            this.timeLeft = this.breakDuration * 60;
            this.statusText.textContent = 'Break Time';
            this.statusIcon.setAttribute('data-feather', 'coffee');
        } else {
            this.mode = 'work';
            this.timeLeft = this.workDuration * 60;
            this.statusText.textContent = 'Focus Time';
            this.statusIcon.setAttribute('data-feather', 'briefcase');
        }
        this.display.textContent = this.formatTime(this.timeLeft);
        this.toggleBtn.innerHTML = '<i data-feather="play" style="width:14px;"></i> Start';
        if (typeof feather !== 'undefined') feather.replace();
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('hidden');
    }

    saveSettings() {
        const work = parseInt(document.getElementById('pomo-work-input').value);
        const brk = parseInt(document.getElementById('pomo-break-input').value);
        if (work > 0 && brk > 0) {
            this.workDuration = work;
            this.breakDuration = brk;
            const prefs = JSON.parse(localStorage.getItem('pomodoro-prefs') || '{}');
            prefs.workDuration = work;
            prefs.breakDuration = brk;
            localStorage.setItem('pomodoro-prefs', JSON.stringify(prefs));
            this.reset();
            this.toggleSettings();
        }
    }

    sendNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(this.mode === 'work' ? 'Focus Session Complete!' : 'Break Over!', {
                body: this.mode === 'work' ? 'Time for a break.' : 'Time to focus.',
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.matchMedia('print').matches) {
        new PomodoroWidget();
    }
});
