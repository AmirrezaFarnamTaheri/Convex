document.addEventListener('DOMContentLoaded', () => {
  const lectureList = document.getElementById('lecture-list');

  fetch('content/lectures.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(lecture => {
        const lectureCard = document.createElement('a');
        lectureCard.href = `topics/${lecture.slug}/index.html`;
        lectureCard.classList.add('card');
        lectureCard.style.display = 'block';
        lectureCard.style.marginBottom = '1rem';
        lectureCard.style.textDecoration = 'none';
        lectureCard.style.color = 'inherit';

        const title = document.createElement('h3');
        title.textContent = `${lecture.slug.split('-')[0]}. ${lecture.title}`;

        const blurb = document.createElement('p');
        blurb.textContent = lecture.blurb;

        lectureCard.appendChild(title);
        lectureCard.appendChild(blurb);
        lectureList.appendChild(lectureCard);
      });
    });
});
