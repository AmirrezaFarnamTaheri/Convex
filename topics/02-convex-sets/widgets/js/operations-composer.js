function initOperationsComposer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const palette = container.querySelector('#composer-palette');
    const canvas = container.querySelector('#composer-canvas');

    let draggedItem = null;

    palette.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('palette-item')) {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', e.target.innerText);
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const newItem = document.createElement('div');
            newItem.className = 'canvas-item';
            newItem.innerText = draggedItem.innerText;

            const canvasRect = canvas.getBoundingClientRect();
            newItem.style.left = `${e.clientX - canvasRect.left - 50}px`;
            newItem.style.top = `${e.clientY - canvasRect.top - 20}px`;

            canvas.appendChild(newItem);
            draggedItem = null;
        }
    });
}

initOperationsComposer('operations-composer-container');
