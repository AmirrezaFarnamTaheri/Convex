/**
 * Pomodoro Timer Widget
 * A focus timer with customizable duration and visual/audio feedback.
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

        this.timeLeft = this.workDuration * 60;
        this.timerId = null;
        this.isRunning = false;
        this.mode = 'work'; // 'work' or 'break'

        this.init();
    }

    init() {
        this.createUI();
        // Request notification permission
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    createUI() {
        // Remove existing if any
        const existing = document.querySelector('.pomodoro-widget');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.className = 'pomodoro-widget glass';
        // Styling handled in CSS, but inline for now to ensure visibility if CSS not fully updated
        // Moving styles to class in convex-unified.css is better, but ensuring self-contained structure here.

        container.innerHTML = `
            <div class="pomodoro-header">
                <div class="pomodoro-status">
                    <i data-feather="${this.mode === 'work' ? 'briefcase' : 'coffee'}"></i>
                    <span class="status-text">${this.mode === 'work' ? 'Focus' : 'Break'}</span>
                </div>
                <div class="pomodoro-actions">
                    <button class="btn btn-ghost btn-xs" id="pomo-minimize-btn" title="Minimize">
                        <i data-feather="minus"></i>
                    </button>
                    <button class="btn btn-ghost btn-xs" id="pomo-settings-btn" title="Settings">
                        <i data-feather="settings"></i>
                    </button>
                </div>
            </div>

            <div class="pomodoro-body">
                <div class="pomodoro-time">${this.formatTime(this.timeLeft)}</div>

                <div class="pomodoro-controls">
                    <button class="btn btn-primary btn-sm" id="pomo-toggle">
                        <i data-feather="play"></i> Start
                    </button>
                    <button class="btn btn-ghost btn-sm" id="pomo-reset" title="Reset">
                        <i data-feather="rotate-ccw"></i>
                    </button>
                </div>
            </div>

            <!-- Settings Panel (Hidden) -->
            <div class="pomodoro-settings hidden">
                <div class="control-group">
                    <label>Focus (min)</label>
                    <input type="number" id="pomo-work-input" value="${this.workDuration}" min="1" max="60">
                </div>
                <div class="control-group">
                    <label>Break (min)</label>
                    <input type="number" id="pomo-break-input" value="${this.breakDuration}" min="1" max="30">
                </div>
                <button class="btn btn-secondary btn-sm" id="pomo-save-settings" style="width: 100%; margin-top: 8px;">Save</button>
            </div>
        `;

        document.body.appendChild(container);

        // Bind Elements
        this.display = container.querySelector('.pomodoro-time');
        this.toggleBtn = container.querySelector('#pomo-toggle');
        this.statusIcon = container.querySelector('.pomodoro-status i');
        this.statusText = container.querySelector('.pomodoro-status .status-text');
        this.settingsPanel = container.querySelector('.pomodoro-settings');
        this.body = container.querySelector('.pomodoro-body');
        this.minimizeBtn = container.querySelector('#pomo-minimize-btn');

        // Event Listeners
        this.toggleBtn.onclick = () => this.toggle();
        container.querySelector('#pomo-reset').onclick = () => this.reset();
        container.querySelector('#pomo-settings-btn').onclick = () => this.toggleSettings();
        container.querySelector('#pomo-save-settings').onclick = () => this.saveSettings();
        this.minimizeBtn.onclick = () => this.toggleMinimize();

        // Load minimized state
        if (localStorage.getItem('pomodoro-minimized') === 'true') {
            this.toggleMinimize(false);
        }

        // Render Icons
        if (typeof feather !== 'undefined') feather.replace();
    }

    toggleMinimize(save = true) {
        const isMinimized = this.body.classList.toggle('hidden');
        this.minimizeBtn.innerHTML = isMinimized ? '<i data-feather="maximize-2"></i>' : '<i data-feather="minus"></i>';

        // Compact header when minimized
        if (isMinimized) {
            this.statusText.textContent = this.formatTime(this.timeLeft);
        } else {
            this.statusText.textContent = this.mode === 'work' ? 'Focus' : 'Break';
        }

        if (save) {
            localStorage.setItem('pomodoro-minimized', isMinimized);
        }
        if (typeof feather !== 'undefined') feather.replace();
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        this.isRunning = true;
        this.toggleBtn.innerHTML = '<i data-feather="pause"></i> Pause';
        this.toggleBtn.classList.replace('btn-primary', 'btn-secondary');
        if (typeof feather !== 'undefined') feather.replace();

        this.timerId = setInterval(() => {
            this.timeLeft--;
            const timeStr = this.formatTime(this.timeLeft);
            this.display.textContent = timeStr;

            // Update title
            document.title = `(${timeStr}) Convex Opt`;

            // Update minimized status text if needed
            if (this.body.classList.contains('hidden')) {
                this.statusText.textContent = timeStr;
            }

            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.toggleBtn.innerHTML = '<i data-feather="play"></i> Resume';
        this.toggleBtn.classList.replace('btn-secondary', 'btn-primary');
        document.title = 'Convex Optimization'; // Reset title
        if (typeof feather !== 'undefined') feather.replace();
    }

    reset() {
        this.pause();
        this.timeLeft = (this.mode === 'work' ? this.workDuration : this.breakDuration) * 60;
        this.display.textContent = this.formatTime(this.timeLeft);
        this.toggleBtn.innerHTML = '<i data-feather="play"></i> Start';
        if (typeof feather !== 'undefined') feather.replace();
    }

    complete() {
        this.pause();

        // Notify
        this.sendNotification();

        // Switch mode
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
        this.toggleBtn.innerHTML = '<i data-feather="play"></i> Start';
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

            localStorage.setItem('pomodoro-prefs', JSON.stringify({
                workDuration: work,
                breakDuration: brk
            }));

            this.reset();
            this.toggleSettings();
        }
    }

    sendNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(this.mode === 'work' ? 'Focus Session Complete!' : 'Break Over!', {
                body: this.mode === 'work' ? 'Time for a break.' : 'Time to focus.',
                icon: '/static/images/logo.svg'
            });
        } else {
            // Fallback audio or alert
            try {
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-tone-571.mp3');
                audio.play();
            } catch(e) {
                console.log('Audio playback failed');
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Only init if not on print view
    if (!window.matchMedia('print').matches) {
        new PomodoroWidget();
    }
});
