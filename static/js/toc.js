document.addEventListener('DOMContentLoaded', () => {
  const tocContainer = document.getElementById('toc');
  const tocWrapper = document.getElementById('toc-container');
  const content = document.querySelector('.lecture-content');

  if (!tocContainer || !content || !tocWrapper) {
    return;
  }

  // Create toggle button
  const tocHeader = tocWrapper.querySelector('h2');
  if (tocHeader) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toc-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle table of contents');
    toggleBtn.innerHTML = `
      <svg class="toc-toggle-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Insert button next to header
    tocHeader.style.display = 'flex';
    tocHeader.style.justifyContent = 'space-between';
    tocHeader.style.alignItems = 'center';
    tocHeader.style.cursor = 'pointer';
    tocHeader.appendChild(toggleBtn);

    // Load saved state from localStorage
    const tocState = localStorage.getItem('toc-expanded');
    const isExpanded = tocState === null ? true : tocState === 'true';

    if (!isExpanded) {
      tocContainer.classList.add('toc-collapsed');
      toggleBtn.classList.add('collapsed');
    }

    // Toggle functionality
    const toggleToc = () => {
      const isCurrentlyExpanded = !tocContainer.classList.contains('toc-collapsed');

      if (isCurrentlyExpanded) {
        tocContainer.classList.add('toc-collapsed');
        toggleBtn.classList.add('collapsed');
        localStorage.setItem('toc-expanded', 'false');
      } else {
        tocContainer.classList.remove('toc-collapsed');
        toggleBtn.classList.remove('collapsed');
        localStorage.setItem('toc-expanded', 'true');
      }
    };

    tocHeader.addEventListener('click', toggleToc);
  }

  // Generate TOC
  const headings = content.querySelectorAll('h2, h3');
  let tocHTML = '<ul>';

  headings.forEach(heading => {
    const id = heading.parentElement.id;
    if (id) {
      if (heading.tagName === 'H2') {
        tocHTML += `<li><a href="#${id}">${heading.textContent}</a></li>`;
      } else {
        tocHTML += `<ul><li><a href="#${id}">${heading.textContent}</a></li></ul>`;
      }
    }
  });

  tocHTML += '</ul>';
  tocContainer.innerHTML = tocHTML;

  // Active state tracking
  const links = tocContainer.querySelectorAll('a');
  const sections = [];
  links.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      sections.push(section);
    }
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
});
