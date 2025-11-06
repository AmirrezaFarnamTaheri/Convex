/**
 * Widget Utilities
 *
 * Common utilities for all interactive widgets to improve code quality,
 * performance, and prevent memory leaks.
 * Version: 1.0.0
 */

/**
 * Debounce function to prevent expensive operations from running too frequently
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} The debounced function
 */
export function debounce(func, wait = 250) {
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
 * Creates a managed ResizeObserver that automatically cleans up
 * @param {HTMLElement} element - Element to observe
 * @param {Function} callback - Callback function
 * @param {Object} options - Options
 * @param {boolean} options.debounce - Whether to debounce the callback
 * @param {number} options.debounceDelay - Debounce delay in ms
 * @returns {ResizeObserver} The observer instance
 */
export function createManagedResizeObserver(element, callback, options = {}) {
    const { debounce: shouldDebounce = true, debounceDelay = 250 } = options;

    const finalCallback = shouldDebounce ? debounce(callback, debounceDelay) : callback;

    const observer = new ResizeObserver(entries => {
        try {
            finalCallback(entries);
        } catch (error) {
            console.error('ResizeObserver callback error:', error);
        }
    });

    observer.observe(element);

    // Auto-cleanup when element is removed from DOM
    const cleanupObserver = new MutationObserver(() => {
        if (!document.body.contains(element)) {
            observer.disconnect();
            cleanupObserver.disconnect();
        }
    });

    cleanupObserver.observe(document.body, { childList: true, subtree: true });

    return observer;
}

/**
 * Creates a cleanup manager for widgets
 * @returns {Object} Cleanup manager with methods
 */
export function createCleanupManager() {
    const cleanupFunctions = [];

    return {
        /**
         * Add a cleanup function
         * @param {Function} fn - Cleanup function to run on widget destruction
         */
        add(fn) {
            cleanupFunctions.push(fn);
        },

        /**
         * Add a ResizeObserver to be cleaned up
         * @param {ResizeObserver} observer - Observer to disconnect
         */
        addObserver(observer) {
            this.add(() => observer.disconnect());
        },

        /**
         * Add an animation frame to be canceled
         * @param {number} frameId - Animation frame ID
         */
        addAnimationFrame(frameId) {
            this.add(() => cancelAnimationFrame(frameId));
        },

        /**
         * Add an event listener to be removed
         * @param {HTMLElement} element - Element with listener
         * @param {string} event - Event name
         * @param {Function} handler - Event handler
         */
        addListener(element, event, handler) {
            this.add(() => element.removeEventListener(event, handler));
        },

        /**
         * Run all cleanup functions
         */
        cleanup() {
            cleanupFunctions.forEach(fn => {
                try {
                    fn();
                } catch (error) {
                    console.error('Cleanup error:', error);
                }
            });
            cleanupFunctions.length = 0;
        }
    };
}

/**
 * Auto-cleanup wrapper for container removal
 * @param {HTMLElement} container - Widget container
 * @param {Function} cleanupFn - Cleanup function
 */
export function autoCleanupOnRemoval(container, cleanupFn) {
    const observer = new MutationObserver(() => {
        if (!document.body.contains(container)) {
            try {
                cleanupFn();
            } catch (error) {
                console.error('Auto-cleanup error:', error);
            }
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
}

/**
 * Safe wrapper for async operations
 * @param {Function} asyncFn - Async function to wrap
 * @param {string} errorMessage - Error message prefix
 * @returns {Function} Wrapped async function
 */
export function safeAsync(asyncFn, errorMessage = 'Async operation failed') {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            console.error(`${errorMessage}:`, error);
            throw error;
        }
    };
}

/**
 * Check if container exists and show error if not
 * @param {string} containerId - Container ID
 * @returns {HTMLElement|null} Container element or null
 */
export function getContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return null;
    }
    return container;
}

/**
 * Show loading indicator in container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 */
export function showLoading(container, message = 'Loading...') {
    container.innerHTML = `<div class="widget-loading-indicator">${message}</div>`;
}

/**
 * Show error message in container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 */
export function showError(container, message = 'An error occurred') {
    container.innerHTML = `<div class="widget-error" style="color: var(--color-danger); padding: 20px; text-align: center;">
        <strong>Error:</strong> ${message}
    </div>`;
}

/**
 * Safe JSON parse with fallback
 * @param {string} jsonString - JSON string
 * @param {*} fallback - Fallback value
 * @returns {*} Parsed object or fallback
 */
export function safeJSONParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parse error:', error);
        return fallback;
    }
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation parameter [0, 1]
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Get CSS custom property value
 * @param {string} propertyName - CSS custom property name (with or without --)
 * @returns {string} Property value
 */
export function getCSSVariable(propertyName) {
    const name = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Safe Three.js scene cleanup
 * @param {THREE.Scene} scene - Three.js scene
 * @param {THREE.Renderer} renderer - Three.js renderer
 */
export function cleanupThreeJS(scene, renderer) {
    if (!scene || !renderer) return;

    try {
        // Dispose of geometries and materials
        scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        // Dispose renderer
        renderer.dispose();
        renderer.forceContextLoss();
    } catch (error) {
        console.error('Three.js cleanup error:', error);
    }
}

/**
 * Format number with specified precision
 * @param {number} value - Number to format
 * @param {number} precision - Decimal places
 * @returns {string} Formatted number
 */
export function formatNumber(value, precision = 2) {
    if (!isFinite(value)) return 'N/A';
    return value.toFixed(precision);
}

/**
 * Check if value is numeric
 * @param {*} value - Value to check
 * @returns {boolean} True if numeric
 */
export function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
