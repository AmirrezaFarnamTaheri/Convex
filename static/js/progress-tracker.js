/**
 * Progress Tracker
 * Tracks reading progress and allows marking lectures as complete.
 */

document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initCompletionWidget();
});

function initProgressBar() {
    if (document.querySelector('.reading-progress-bar')) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, var(--primary-500), var(--accent-400))';
    progressBar.style.zIndex = '2000';
    progressBar.style.width = '0%';
    progressBar.style.transition = 'width 0.1s ease-out';
    progressBar.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
    
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
    if (!mainContent) return; 

    // Prevent duplicate injection
    if (document.querySelector('.completion-widget')) return;

    const lectureId = window.location.pathname;
    const isCompleted = localStorage.getItem(`completed-${lectureId}`) === 'true';

    const widget = document.createElement('div');
    widget.className = `completion-widget section-card ${isCompleted ? 'completed' : ''}`;
    
    // Style override for this specific widget to center it
    widget.style.textAlign = 'center';
    widget.style.marginTop = 'var(--space-12)';
    widget.style.border = isCompleted ? '1px solid var(--success)' : '1px solid var(--border-subtle)';
    widget.style.background = isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface-1)';

    widget.innerHTML = `
        <h3 style="display:flex; align-items:center; justify-content:center; gap:8px; color:${isCompleted ? 'var(--success)' : 'var(--text-heading)'};">
            <i data-feather="${isCompleted ? 'check-circle' : 'circle'}"></i> 
            ${isCompleted ? 'Lecture Completed' : 'Mark as Complete'}
        </h3>
        <p style="margin:var(--space-4) auto; color:var(--text-secondary);">
            ${isCompleted ? 'Great job! You have finished this lecture.' : 'Click below when you have finished reading to track your progress.'}
        </p>
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

    // Update Styles
    widget.classList.toggle('completed', isNowCompleted);
    widget.style.border = isNowCompleted ? '1px solid var(--success)' : '1px solid var(--border-subtle)';
    widget.style.background = isNowCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface-1)';

    const h3 = widget.querySelector('h3');
    const p = widget.querySelector('p');
    const btn = widget.querySelector('button');

    if (isNowCompleted) {
        h3.innerHTML = '<i data-feather="check-circle"></i> Lecture Completed';
        h3.style.color = 'var(--success)';
        p.textContent = 'Great job! You have finished this lecture.';
        btn.className = 'btn btn-ghost';
        btn.textContent = 'Mark as Incomplete';
        
        // Simple confetti effect could go here
    } else {
        h3.innerHTML = '<i data-feather="circle"></i> Mark as Complete';
        h3.style.color = 'var(--text-heading)';
        p.textContent = 'Click below when you have finished reading to track your progress.';
        btn.className = 'btn btn-primary';
        btn.textContent = 'Complete Lecture';
    }

    if (typeof feather !== 'undefined') feather.replace();
}
