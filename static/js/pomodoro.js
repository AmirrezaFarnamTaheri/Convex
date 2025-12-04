/**
 * Pomodoro Timer Widget
 * Simple timer for focus sessions.
 */

class PomodoroWidget {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes
        this.timerId = null;
        this.isRunning = false;

        this.createUI();
    }

    createUI() {
        const container = document.createElement('div');
        container.className = 'pomodoro-widget';
        container.innerHTML = `
            <i data-feather="clock"></i>
            <span class="pomodoro-timer">25:00</span>
            <button class="btn btn-ghost" style="padding: 4px;" id="pomodoro-toggle">
                <i data-feather="play"></i>
            </button>
            <button class="btn btn-ghost" style="padding: 4px;" id="pomodoro-reset">
                <i data-feather="rotate-ccw"></i>
            </button>
        `;

        document.body.appendChild(container);

        this.display = container.querySelector('.pomodoro-timer');
        this.toggleBtn = container.querySelector('#pomodoro-toggle');

        this.toggleBtn.onclick = () => this.toggle();
        container.querySelector('#pomodoro-reset').onclick = () => this.reset();

        if (typeof feather !== 'undefined') feather.replace();
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
        this.toggleBtn.innerHTML = '<i data-feather="pause"></i>';
        if (typeof feather !== 'undefined') feather.replace();

        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.pause();
                alert('Pomodoro complete!');
                this.reset();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        this.toggleBtn.innerHTML = '<i data-feather="play"></i>';
        if (typeof feather !== 'undefined') feather.replace();
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.timeLeft = 25 * 60;
        this.updateDisplay();
    }

    updateDisplay() {
        const m = Math.floor(this.timeLeft / 60);
        const s = this.timeLeft % 60;
        this.display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PomodoroWidget();
});
