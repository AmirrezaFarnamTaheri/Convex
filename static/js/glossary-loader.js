// glossary-loader.js
// Loads glossary definitions and populates tooltips

async function initGlossary() {
  try {
    const response = await fetch('../../data/glossary.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const glossary = await response.json();

    const links = document.querySelectorAll('.definition-link');
    links.forEach(link => {
      // Get the term key from data-term attribute or fallback to lowercased text content
      const termKey = link.dataset.term
        ? link.dataset.term.toLowerCase()
        : link.textContent.trim().toLowerCase();

      // Normalize spaces (e.g. "convex  set" -> "convex set")
      const normalizedKey = termKey.replace(/\s+/g, ' ');

      const entry = glossary[normalizedKey];

      if (entry) {
        // Set the hover text using the data-definition attribute (for CSS tooltip)
        link.setAttribute('data-definition', entry.definition);

        // Make it clickable
        link.href = entry.url;

        // Add title for accessibility/fallback
        link.title = entry.definition;
      } else {
        console.warn(`Glossary term not found: "${normalizedKey}"`);
      }
    });
  } catch (error) {
    console.error('Failed to load glossary:', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initGlossary);
