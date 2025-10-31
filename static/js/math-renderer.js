// static/js/math-renderer.js

/**
 * Renders all mathematical expressions on the page using KaTeX.
 * Requires KaTeX and auto-render to be loaded via CDN in the HTML.
 */
function renderMath() {
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false,
      fleqn: false,
      strict: false
    });
  } else {
    console.error('KaTeX auto-render not loaded. Please include the auto-render script.');
  }
}

// Render math when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMath);
} else {
  // DOM already loaded
  renderMath();
}
