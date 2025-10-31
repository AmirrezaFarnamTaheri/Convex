document.addEventListener('DOMContentLoaded', () => {
  const tocContainer = document.getElementById('toc');
  const content = document.querySelector('.lecture-content');

  if (!tocContainer || !content) {
    return;
  }

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
