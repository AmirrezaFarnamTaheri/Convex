/**
 * Widget Enhancement Utilities
 *
 * Shared utilities for improving widget UI/UX, error handling, and accessibility
 * Version: 1.0.0
 */

/**
 * Shows a loading indicator in a container
 * @param {HTMLElement} container - The container element
 * @param {string} message - Loading message to display
 */
export function showLoading(container, message = "Loading...") {
    container.innerHTML = `
        <div class="widget-loading" style="
            padding: 60px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200px;
        ">
            <div class="loading-spinner" style="
                width: 40px;
                height: 40px;
                border: 4px solid var(--color-surface-2);
                border-top-color: var(--color-accent);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="
                margin-top: 20px;
                color: var(--color-text-secondary);
                font-size: 0.9375rem;
                font-weight: 500;
            ">${message}</p>
        </div>
    `;

    // Add keyframe animation if not already present
    if (!document.getElementById('widget-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'widget-spinner-style';
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Shows an error message in a container
 * @param {HTMLElement} container - The container element
 * @param {string} message - Error message to display
 * @param {Error} error - The error object (optional)
 */
export function showError(container, message, error = null) {
    const errorDetails = error ? `<details style="margin-top: 15px; text-align: left;">
        <summary style="cursor: pointer; color: var(--color-text-secondary); font-size: 0.875rem;">
            Technical details
        </summary>
        <pre style="
            margin-top: 10px;
            padding: 10px;
            background: var(--color-surface-1);
            border-radius: 4px;
            font-size: 0.8125rem;
            overflow-x: auto;
        ">${error.stack || error.message || error}</pre>
    </details>` : '';

    container.innerHTML = `
        <div class="widget-error" style="
            padding: 40px 20px;
            text-align: center;
            background: var(--color-surface-0);
            border: 2px solid var(--color-danger);
            border-radius: 8px;
            margin: 20px;
        ">
            <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
            <h3 style="
                margin: 0 0 10px 0;
                color: var(--color-danger);
                font-size: 1.125rem;
                font-weight: 600;
            ">Error Loading Widget</h3>
            <p style="
                margin: 0;
                color: var(--color-text-secondary);
                font-size: 0.9375rem;
                line-height: 1.6;
            ">${message}</p>
            ${errorDetails}
            <button onclick="location.reload()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9375rem;
                font-weight: 500;
            ">Reload Page</button>
        </div>
    `;
}

/**
 * Wraps an async widget initialization with error handling and loading states
 * @param {HTMLElement} container - The container element
 * @param {Function} initFunction - The async initialization function
 * @param {string} loadingMessage - Custom loading message (optional)
 */
export async function withLoadingAndError(container, initFunction, loadingMessage = "Loading widget...") {
    try {
        showLoading(container, loadingMessage);
        await initFunction();
    } catch (error) {
        console.error('Widget initialization error:', error);
        showError(
            container,
            'Failed to initialize widget. Please check your connection and try again.',
            error
        );
    }
}

/**
 * Creates an enhanced widget header with title and description
 * @param {string} title - Widget title
 * @param {string} description - Widget description
 * @returns {string} HTML string for the header
 */
export function createWidgetHeader(title, description) {
    return `
        <div class="widget-header" style="
            padding: 20px;
            background: linear-gradient(135deg, var(--color-surface-0) 0%, var(--color-surface-1) 100%);
            border-bottom: 2px solid var(--color-surface-2);
        ">
            <h3 style="
                margin: 0 0 10px 0;
                font-size: 1.375rem;
                font-weight: 700;
                color: var(--color-text-primary);
                letter-spacing: -0.02em;
            ">${title}</h3>
            <p style="
                margin: 0;
                font-size: 0.9375rem;
                color: var(--color-text-secondary);
                line-height: 1.6;
                max-width: 800px;
            ">${description}</p>
        </div>
    `;
}

/**
 * Creates a control group with label and input
 * @param {string} labelText - Label text
 * @param {string} inputHTML - HTML for the input element
 * @param {string} helpText - Optional help text (default: null)
 * @returns {string} HTML string for the control group
 */
export function createControlGroup(labelText, inputHTML, helpText = null) {
    const help = helpText ? `
        <p style="
            margin: 5px 0 0 0;
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
            line-height: 1.4;
        ">${helpText}</p>
    ` : '';

    return `
        <div class="control-group" style="margin-bottom: 15px;">
            <label style="
                display: block;
                margin-bottom: 6px;
                font-weight: 600;
                font-size: 0.9375rem;
                color: var(--color-text-primary);
            ">${labelText}</label>
            ${inputHTML}
            ${help}
        </div>
    `;
}

/**
 * Creates enhanced instructions text
 * @param {string} text - Instructions text
 * @returns {string} HTML string for instructions
 */
export function createInstructions(text) {
    return `
        <p class="widget-instructions" style="
            margin: 0;
            padding: 12px 16px;
            background: var(--color-surface-0);
            border-left: 4px solid var(--color-accent);
            border-radius: 4px;
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            line-height: 1.6;
        ">
            💡 <strong style="color: var(--color-text-primary);">Tip:</strong> ${text}
        </p>
    `;
}

/**
 * Adds keyboard accessibility to a widget
 * @param {HTMLElement} element - The element to make accessible
 * @param {Function} onActivate - Callback when Enter or Space is pressed
 */
export function addKeyboardAccessibility(element, onActivate) {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onActivate(e);
        }
    });
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Creates a responsive SVG container with D3
 * @param {HTMLElement} container - The container element
 * @param {Object} margin - Margin object {top, right, bottom, left}
 * @returns {Object} Object with svg, width, height, and chart group
 */
export function createResponsiveSVG(container, margin = {top: 20, right: 20, bottom: 40, left: 40}) {
    import('https://cdn.jsdelivr.net/npm/d3@7/+esm').then(d3 => {
        const width = container.clientWidth - margin.left - margin.right;
        const height = (container.clientHeight || 400) - margin.top - margin.bottom;

        const svg = d3.select(container).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${container.clientWidth} ${container.clientHeight || 400}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        return { svg, width, height, g, margin };
    });
}

/**
 * Format number for display
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 2) {
    if (Math.abs(num) < 0.01 && num !== 0) {
        return num.toExponential(decimals);
    }
    return num.toFixed(decimals);
}

/**
 * Adds export functionality to a widget
 * @param {HTMLElement} container - The widget container
 * @param {Function} getData - Function that returns data to export
 * @param {string} filename - Base filename for export
 */
export function addExportButton(container, getData, filename = 'widget-data') {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📥 Export Data';
    exportBtn.style.cssText = `
        padding: 8px 16px;
        background: var(--color-surface-1);
        border: 1px solid var(--color-surface-2);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        transition: all 0.2s;
    `;

    exportBtn.addEventListener('click', () => {
        try {
            const data = getData();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. See console for details.');
        }
    });

    exportBtn.addEventListener('mouseenter', () => {
        exportBtn.style.background = 'var(--color-surface-2)';
    });

    exportBtn.addEventListener('mouseleave', () => {
        exportBtn.style.background = 'var(--color-surface-1)';
    });

    return exportBtn;
}
