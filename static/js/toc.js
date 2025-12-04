document.addEventListener('DOMContentLoaded', () => {
  const tocContainer = document.getElementById('toc');
  const tocWrapper = document.getElementById('toc-container');
  const content = document.querySelector('.lecture-content');

  if (!tocContainer || !content || !tocWrapper) {
    return;
  }

  // --- TOC Generation ---
  // Only generate if empty (to avoid redundancy if hardcoded)
  if (tocContainer.innerHTML.trim() === '') {
      const headings = content.querySelectorAll('h2, h3');
      let tocHTML = '<ul>';

      headings.forEach(heading => {
        // Ensure heading has ID
        if (!heading.id && heading.parentElement.id) {
             heading.id = heading.parentElement.id + '-heading';
        } else if (!heading.id) {
            heading.id = 'section-' + Math.random().toString(36).substr(2, 9);
        }

        // Use parent ID if available for section linking
        const id = heading.parentElement.id || heading.id;

        if (heading.tagName === 'H2') {
            tocHTML += `<li><a href="#${id}">${heading.textContent}</a></li>`;
        } else {
            tocHTML += `<ul><li><a href="#${id}">${heading.textContent}</a></li></ul>`;
        }
      });

      tocHTML += '</ul>';
      tocContainer.innerHTML = tocHTML;
  }

  // --- Active State Tracking ---
  const links = tocContainer.querySelectorAll('a');
  const sections = [];
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) {
            sections.push(section);
        }
    }
  });

  // Debounced scroll handler
  let timeout;
  window.addEventListener('scroll', () => {
      if (timeout) return;
      timeout = setTimeout(() => {
          let current = '';
          sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
          });

          links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
          });
          timeout = null;
      }, 100);
  });
});
