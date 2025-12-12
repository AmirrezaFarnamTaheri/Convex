/**
 * Resizable Utility Class
 * Makes an element resizable via drag handles.
 */
class Resizable {
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({
            minWidth: 200,
            minHeight: 150,
            saveKey: null, // LocalStorage key to save size
            handles: ['se', 'e', 's'], // south-east, east, south
            onResize: null // Callback
        }, options);

        this.init();
    }

    init() {
        this.element.style.position = 'fixed'; // Ensure it's positioned

        // Restore saved size
        if (this.options.saveKey) {
            const saved = JSON.parse(localStorage.getItem(this.options.saveKey + '-size'));
            if (saved) {
                this.element.style.width = saved.width;
                this.element.style.height = saved.height;
            }
        }

        // Add handles
        this.options.handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${pos}`;
            handle.style.position = 'absolute';
            handle.style.zIndex = '100';

            // Style handles based on position
            if (pos === 'se') {
                handle.style.bottom = '0';
                handle.style.right = '0';
                handle.style.cursor = 'nwse-resize';
                handle.style.width = '15px';
                handle.style.height = '15px';
            } else if (pos === 'e') {
                handle.style.top = '0';
                handle.style.right = '0';
                handle.style.bottom = '0'; // '15px' if se exists? No, overlay is fine.
                handle.style.cursor = 'ew-resize';
                handle.style.width = '5px';
            } else if (pos === 's') {
                handle.style.bottom = '0';
                handle.style.left = '0';
                handle.style.right = '0';
                handle.style.cursor = 'ns-resize';
                handle.style.height = '5px';
            } else if (pos === 'n') {
                handle.style.top = '0';
                handle.style.left = '0';
                handle.style.right = '0';
                handle.style.cursor = 'ns-resize';
                handle.style.height = '5px';
            } else if (pos === 'w') {
                handle.style.top = '0';
                handle.style.left = '0';
                handle.style.bottom = '0';
                handle.style.cursor = 'ew-resize';
                handle.style.width = '5px';
            }

            this.element.appendChild(handle);
            this.initDrag(handle, pos);
        });
    }

    initDrag(handle, pos) {
        let startX, startY, startWidth, startHeight, startTop, startLeft;

        const onMouseDown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            startX = e.clientX;
            startY = e.clientY;

            const rect = this.element.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startTop = rect.top;
            startLeft = rect.left;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (pos.includes('e')) {
                const newWidth = Math.max(this.options.minWidth, startWidth + dx);
                this.element.style.width = `${newWidth}px`;
            }
            if (pos.includes('s')) {
                const newHeight = Math.max(this.options.minHeight, startHeight + dy);
                this.element.style.height = `${newHeight}px`;
            }

            // For North and West resizing, we need to adjust top/left as well
            if (pos.includes('w')) {
                 const newWidth = Math.max(this.options.minWidth, startWidth - dx);
                 if (newWidth !== startWidth) { // Only move if width changed
                     this.element.style.width = `${newWidth}px`;
                     // We need to update left position so the right edge stays in place
                     // But this depends on how the element is positioned (left/right vs fixed).
                     // Assuming fixed positioning with left/top or left/bottom.
                     // If we change width and it's left-anchored, it grows right.
                     // To grow left, we must decrease left.

                     // Check current styling
                     const style = window.getComputedStyle(this.element);
                     if (style.right !== 'auto' && style.left === 'auto') {
                         // Anchored right, changing width grows left automatically?
                         // No, standard flow grows right.
                         // Actually if right is set, changing width grows left.
                     } else {
                         // Anchored left
                         this.element.style.left = `${startLeft + dx}px`;
                     }
                 }
            }

             if (pos.includes('n')) {
                 const newHeight = Math.max(this.options.minHeight, startHeight - dy);
                 if (newHeight !== startHeight) {
                     this.element.style.height = `${newHeight}px`;
                     this.element.style.top = `${startTop + dy}px`;
                 }
            }

            if (this.options.onResize) {
                this.options.onResize();
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (this.options.saveKey) {
                localStorage.setItem(this.options.saveKey + '-size', JSON.stringify({
                    width: this.element.style.width,
                    height: this.element.style.height
                }));
            }
        };

        handle.addEventListener('mousedown', onMouseDown);
    }
}
