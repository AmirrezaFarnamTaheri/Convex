/**
 * Progress Tracker
 * Tracks reading progress and allows marking lectures as complete.
 */

document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initCompletionWidget();
});

function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (height > 0) ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + "%";
    });
}

function initCompletionWidget() {
    const mainContent = document.querySelector('.lecture-content');
    if (!mainContent) return; // Only run on lecture pages

    const lectureId = window.location.pathname;
    const isCompleted = localStorage.getItem(`completed-${lectureId}`) === 'true';

    const widget = document.createElement('div');
    widget.className = `completion-widget ${isCompleted ? 'completed' : ''}`;

    widget.innerHTML = `
        <h3><i data-feather="${isCompleted ? 'check-circle' : 'circle'}"></i> ${isCompleted ? 'Lecture Completed' : 'Mark as Complete'}</h3>
        <p>${isCompleted ? 'Great job! You have finished this lecture.' : 'Click below when you have finished reading.'}</p>
        <button class="btn ${isCompleted ? 'btn-ghost' : 'btn-primary'}" id="completion-btn">
            ${isCompleted ? 'Mark as Incomplete' : 'Complete Lecture'}
        </button>
    `;

    mainContent.appendChild(widget);

    const btn = widget.querySelector('#completion-btn');
    btn.onclick = () => toggleCompletion(lectureId, widget);

    if (typeof feather !== 'undefined') feather.replace();
}

function toggleCompletion(id, widget) {
    const isNowCompleted = !(localStorage.getItem(`completed-${id}`) === 'true');
    localStorage.setItem(`completed-${id}`, isNowCompleted);

    // Update UI
    widget.className = `completion-widget ${isNowCompleted ? 'completed' : ''}`;
    const h3 = widget.querySelector('h3');
    const p = widget.querySelector('p');
    const btn = widget.querySelector('button');

    if (isNowCompleted) {
        h3.innerHTML = '<i data-feather="check-circle"></i> Lecture Completed';
        p.textContent = 'Great job! You have finished this lecture.';
        btn.className = 'btn btn-ghost';
        btn.textContent = 'Mark as Incomplete';

        // Trigger confetti or visual feedback? (Maybe too much for now)
    } else {
        h3.innerHTML = '<i data-feather="circle"></i> Mark as Complete';
        p.textContent = 'Click below when you have finished reading.';
        btn.className = 'btn btn-primary';
        btn.textContent = 'Complete Lecture';
    }

    if (typeof feather !== 'undefined') feather.replace();
}
