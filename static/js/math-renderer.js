// static/js/math-renderer.js

import 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js';
import renderMathInElement from 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js';

/**
 * Renders all mathematical expressions on the page using KaTeX.
 */
function renderMath() {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true }
    ],
    throwOnError: false
  });
}

// Render math when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  renderMath();
});
