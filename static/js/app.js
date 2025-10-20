/**
 * app.js
 *
 * Main script for the homepage. Fetches lecture data and dynamically
 * populates the lecture list.
 */

document.addEventListener('DOMContentLoaded', () => {
  const lectureListContainer = document.getElementById('lecture-list');
  if (!lectureListContainer) return;

  // Add a class to the container to enable grid styling
  lectureListContainer.className = 'lecture-grid';

  fetch('content/lectures.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(lectures => {
      if (!lectures || lectures.length === 0) {
        lectureListContainer.innerHTML = '<p>No lectures found.</p>';
        return;
      }

      lectures.forEach(lecture => {
        const card = document.createElement('a');
        card.href = `topics/${lecture.slug}/index.html`;
        card.className = 'lecture-card';

        // Create card header with date and optional flag
        const cardHeader = document.createElement('div');
        cardHeader.className = 'lecture-card-header';
        cardHeader.innerHTML = `
          <span class="lecture-date">${lecture.date}</span>
          ${lecture.is_optional ? '<span class="lecture-optional-badge">Optional</span>' : ''}
        `;

        // Create card body with title and blurb
        const cardBody = document.createElement('div');
        cardBody.className = 'lecture-card-body';
        cardBody.innerHTML = `
          <h3>${lecture.slug.split('-')[0]}. ${lecture.title}</h3>
          <p>${lecture.blurb}</p>
        `;

        // Create card footer with tags
        const cardFooter = document.createElement('div');
        cardFooter.className = 'lecture-card-footer';
        if (lecture.tags && lecture.tags.length > 0) {
          cardFooter.innerHTML = lecture.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        }

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        lectureListContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching or processing lecture data:', error);
      lectureListContainer.innerHTML = '<p>Error loading lectures. Please try again later.</p>';
    });
});
