/**
 * Modern Widget Components Library
 * Provides reusable UI components and utilities for enhanced widgets
 * Version: 1.0.0
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/**
 * Creates a modern widget container with header
 * @param {HTMLElement} container - Parent container
 * @param {string} title - Widget title
 * @returns {Object} - Object with viz and controls containers
 */
export function createModernWidget(container, title) {
    container.innerHTML = `
        <div class="modern-widget-container">
            <div class="modern-widget-header">
                <h3 class="modern-widget-title">${title}</h3>
            </div>
            <div class="modern-widget-body">
                <div class="modern-widget-viz" id="modern-viz-container"></div>
            </div>
        </div>
    `;

    return {
        viz: container.querySelector('.modern-widget-viz'),
        header: container.querySelector('.modern-widget-header'),
        body: container.querySelector('.modern-widget-body')
    };
}

/**
 * Creates tabbed interface
 * @param {HTMLElement} container - Parent container
 * @param {Array<string>} tabNames - Array of tab names
 * @returns {Array<HTMLElement>} - Array of tab content divs
 */
export function createTabs(container, tabNames) {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'modern-tabs-container';

    const tabButtons = document.createElement('div');
    tabButtons.className = 'modern-tab-buttons';

    const tabContents = [];

    tabNames.forEach((name, index) => {
        // Create button
        const button = document.createElement('button');
        button.className = 'modern-tab-button' + (index === 0 ? ' active' : '');
        button.textContent = name;
        button.onclick = () => {
            // Deactivate all
            tabButtons.querySelectorAll('.modern-tab-button').forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');
            // Activate this one
            button.classList.add('active');
            tabContents[index].style.display = 'block';
        };
        tabButtons.appendChild(button);

        // Create content
        const content = document.createElement('div');
        content.className = 'modern-tab-content';
        content.style.display = index === 0 ? 'block' : 'none';
        tabContents.push(content);
    });

    tabsContainer.appendChild(tabButtons);
    tabContents.forEach(content => tabsContainer.appendChild(content));
    container.appendChild(tabsContainer);

    return tabContents;
}

/**
 * Creates a modern slider with live value display
 * @param {HTMLElement} parent - Parent element
 * @param {string} label - Slider label
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} step - Step size
 * @param {number} initial - Initial value
 * @param {Function} onChange - Callback function
 * @returns {Object} - Slider object with getValue and setValue methods
 */
export function createSlider(parent, label, min, max, step, initial, onChange) {
    const div = document.createElement('div');
    div.className = 'modern-control-group';
    div.style.marginBottom = '15px';

    const labelId = 'slider-' + Math.random().toString(36).substr(2, 9);
    const valueId = 'value-' + Math.random().toString(36).substr(2, 9);

    div.innerHTML = `
        <label for="${labelId}" class="modern-control-label">
            <span>${label}</span>
            <span id="${valueId}" class="modern-value-display">${formatValue(initial)}</span>
        </label>
        <input type="range"
               id="${labelId}"
               class="modern-slider"
               min="${min}"
               max="${max}"
               step="${step}"
               value="${initial}">
    `;

    parent.appendChild(div);

    const slider = div.querySelector('input');
    const valueSpan = div.querySelector(`#${valueId}`);

    slider.oninput = () => {
        const val = parseFloat(slider.value);
        valueSpan.textContent = formatValue(val);
        if (onChange) onChange(val);
    };

    return {
        getValue: () => parseFloat(slider.value),
        setValue: (val) => {
            slider.value = val;
            valueSpan.textContent = formatValue(val);
        },
        element: slider
    };
}

/**
 * Creates a modern select dropdown
 * @param {HTMLElement} parent - Parent element
 * @param {string} label - Select label
 * @param {Array<{value: string, label: string}>} options - Options array
 * @returns {HTMLSelectElement} - The select element
 */
export function createSelect(parent, label, options) {
    const div = document.createElement('div');
    div.className = 'modern-control-group';
    div.style.marginBottom = '15px';

    const selectId = 'select-' + Math.random().toString(36).substr(2, 9);

    div.innerHTML = `
        <label for="${selectId}" class="modern-control-label">${label}</label>
        <select id="${selectId}" class="modern-select">
            ${options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
        </select>
    `;

    parent.appendChild(div);
    return div.querySelector('select');
}

/**
 * Creates a modern button
 * @param {HTMLElement} parent - Parent element
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @param {string} variant - Button variant (primary, secondary, danger, success)
 * @returns {HTMLButtonElement} - The button element
 */
export function createButton(parent, text, onClick, variant = 'primary') {
    const button = document.createElement('button');
    button.className = `modern-button modern-button-${variant}`;
    button.textContent = text;
    if (onClick) button.onclick = onClick;
    parent.appendChild(button);
    return button;
}

/**
 * Shows a status message
 * @param {HTMLElement} container - Container element
 * @param {string} message - Status message
 * @param {string} type - Message type (success, error, warning, info)
 */
export function showStatus(container, message, type = 'info') {
    const div = document.createElement('div');
    div.className = `modern-status modern-status-${type}`;
    div.innerHTML = message;
    container.innerHTML = '';
    container.appendChild(div);
}

/**
 * Shows a loading indicator
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 */
export function showLoading(container, message = 'Loading...') {
    container.innerHTML = `
        <div class="modern-loading">
            <div class="modern-spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Creates a badge
 * @param {string} text - Badge text
 * @param {string} variant - Badge variant (success, danger, warning, info)
 * @returns {string} - HTML string for badge
 */
export function createBadge(text, variant = 'info') {
    return `<span class="modern-badge modern-badge-${variant}">${text}</span>`;
}

/**
 * Adds modern styled axes to SVG
 * @param {d3.Selection} g - SVG group
 * @param {d3.Scale} xScale - X scale
 * @param {d3.Scale} yScale - Y scale
 * @param {number} width - Plot width
 * @param {number} height - Plot height
 * @param {string} xLabel - X axis label
 * @param {string} yLabel - Y axis label
 * @returns {Object} - Object with xAxis and yAxis groups
 */
export function addModernAxes(g, xScale, yScale, width, height, xLabel = 'x', yLabel = 'y') {
    // X axis
    const xAxis = g.append('g')
        .attr('class', 'modern-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(8));

    // X label
    xAxis.append('text')
        .attr('x', width / 2)
        .attr('y', 35)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text(xLabel);

    // Y axis
    const yAxis = g.append('g')
        .attr('class', 'modern-axis')
        .call(d3.axisLeft(yScale).ticks(8));

    // Y label
    yAxis.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text(yLabel);

    // Grid lines
    g.append('g')
        .attr('class', 'modern-grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(yScale)
            .ticks(8)
            .tickSize(-width)
            .tickFormat(''));

    g.append('g')
        .attr('class', 'modern-grid')
        .attr('opacity', 0.1)
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .ticks(8)
            .tickSize(-height)
            .tickFormat(''));

    return { xAxis, yAxis };
}

/**
 * Makes an SVG element draggable
 * @param {d3.Selection} element - D3 selection of element to make draggable
 * @param {Function} onDrag - Callback function (x, y) => {}
 */
export function makeDraggable(element, onDrag) {
    const drag = d3.drag()
        .on('drag', function(event) {
            if (onDrag) {
                onDrag(event.x, event.y);
            }
        });

    element.call(drag);
    element.style('cursor', 'move');
}

/**
 * Adds animated contours to SVG
 * @param {d3.Selection} g - SVG group
 * @param {Array} contourData - Contour data
 * @param {d3.Scale} xScale - X scale
 * @param {d3.Scale} yScale - Y scale
 * @param {d3.Scale} colorScale - Color scale
 * @returns {d3.Selection} - Contour group
 */
export function addAnimatedContours(g, contourData, xScale, yScale, colorScale) {
    const contours = g.append('g').attr('class', 'contours');

    contourData.forEach((contour, i) => {
        contours.append('path')
            .datum(contour)
            .attr('fill', 'none')
            .attr('stroke', colorScale(contour.value))
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y)))
            .style('opacity', 0)
            .transition()
            .duration(500)
            .delay(i * 50)
            .style('opacity', 0.7);
    });

    return contours;
}

/**
 * Animates path drawing
 * @param {d3.Selection} path - Path selection
 * @param {number} duration - Animation duration in ms
 */
export function animatePathDrawing(path, duration = 1000) {
    const length = path.node().getTotalLength();

    path
        .attr('stroke-dasharray', length + ' ' + length)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
}

/**
 * Sets up responsive resize observer
 * @param {HTMLElement} container - Container to observe
 * @param {Function} onResize - Callback function
 * @returns {ResizeObserver} - The observer
 */
export function setupResponsiveResize(container, onResize) {
    const observer = new ResizeObserver(entries => {
        if (onResize) {
            const entry = entries[0];
            onResize(entry.contentRect.width, entry.contentRect.height);
        }
    });

    observer.observe(container);
    return observer;
}

/**
 * Formats a numeric value for display
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted string
 */
export function formatValue(value, decimals = 2) {
    if (typeof value !== 'number' || !isFinite(value)) return 'N/A';

    if (Math.abs(value) < 0.01 && value !== 0) {
        return value.toExponential(decimals);
    }

    return value.toFixed(decimals);
}

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
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
 * Creates a responsive visualization container
 * @param {HTMLElement} parent - Parent element
 * @param {number} aspectRatio - Aspect ratio (width/height)
 * @returns {HTMLElement} - Visualization container
 */
export function createVisualization(parent, aspectRatio = 16/9) {
    const viz = document.createElement('div');
    viz.className = 'modern-visualization';
    viz.style.width = '100%';
    viz.style.paddingBottom = `${100 / aspectRatio}%`;
    viz.style.position = 'relative';
    parent.appendChild(viz);
    return viz;
}

/**
 * Creates a controls panel
 * @param {HTMLElement} parent - Parent element
 * @returns {HTMLElement} - Controls panel
 */
export function createControlsPanel(parent) {
    const panel = document.createElement('div');
    panel.className = 'modern-controls-panel';
    parent.appendChild(panel);
    return panel;
}

/**
 * Creates an output display area
 * @param {HTMLElement} parent - Parent element
 * @param {string} title - Optional title
 * @returns {HTMLElement} - Output container
 */
export function createOutput(parent, title = null) {
    const output = document.createElement('div');
    output.className = 'modern-output';
    if (title) {
        const h4 = document.createElement('h4');
        h4.textContent = title;
        output.appendChild(h4);
    }
    parent.appendChild(output);
    return output;
}

// Add CSS for modern components if not already present
if (!document.getElementById('modern-components-style')) {
    const style = document.createElement('style');
    style.id = 'modern-components-style';
    style.textContent = `
        .modern-widget-container {
            background: var(--color-surface, #fff);
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .modern-widget-header {
            background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
            color: white;
            padding: 16px 20px;
        }

        .modern-widget-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .modern-widget-body {
            padding: 20px;
        }

        .modern-widget-viz {
            width: 100%;
            min-height: 400px;
        }

        .modern-tabs-container {
            margin-top: 20px;
        }

        .modern-tab-buttons {
            display: flex;
            gap: 8px;
            border-bottom: 2px solid #e9ecef;
            margin-bottom: 20px;
        }

        .modern-tab-button {
            padding: 10px 20px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-weight: 500;
            color: #6c757d;
            transition: all 0.2s;
        }

        .modern-tab-button:hover {
            color: #4dabf7;
            background: #f8f9fa;
        }

        .modern-tab-button.active {
            color: #4dabf7;
            border-bottom-color: #4dabf7;
        }

        .modern-tab-content {
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .modern-control-group {
            margin-bottom: 15px;
        }

        .modern-control-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
            margin-bottom: 8px;
            color: #495057;
        }

        .modern-value-display {
            font-family: 'Courier New', monospace;
            color: #4dabf7;
            font-weight: 600;
        }

        .modern-slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #e9ecef;
            outline: none;
            -webkit-appearance: none;
        }

        .modern-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #4dabf7;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s;
        }

        .modern-slider::-webkit-slider-thumb:hover {
            background: #339af0;
            transform: scale(1.1);
        }

        .modern-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #4dabf7;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .modern-select {
            width: 100%;
            padding: 8px 12px;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            font-size: 0.95rem;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
        }

        .modern-select:focus {
            outline: none;
            border-color: #4dabf7;
            box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1);
        }

        .modern-button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.95rem;
        }

        .modern-button-primary {
            background: #4dabf7;
            color: white;
        }

        .modern-button-primary:hover {
            background: #339af0;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(77, 171, 247, 0.3);
        }

        .modern-button-secondary {
            background: #868e96;
            color: white;
        }

        .modern-button-danger {
            background: #ff6b6b;
            color: white;
        }

        .modern-button-success {
            background: #51cf66;
            color: white;
        }

        .modern-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .modern-badge-success {
            background: #d3f9d8;
            color: #2b8a3e;
        }

        .modern-badge-danger {
            background: #ffe3e3;
            color: #c92a2a;
        }

        .modern-badge-warning {
            background: #fff3bf;
            color: #e67700;
        }

        .modern-badge-info {
            background: #d0ebff;
            color: #1864ab;
        }

        .modern-controls-panel {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .modern-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
        }

        .modern-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e9ecef;
            border-top-color: #4dabf7;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .modern-axis text {
            font-size: 12px;
        }

        .modern-axis path,
        .modern-axis line {
            stroke: #adb5bd;
        }

        .formula-block {
            background: #f8f9fa;
            border-left: 4px solid #4dabf7;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }

        .formula-block strong {
            color: #4dabf7;
        }
    `;
    document.head.appendChild(style);
}
