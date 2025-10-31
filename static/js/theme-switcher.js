document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeSwitcher = document.createElement('div');
  themeSwitcher.className = 'theme-switcher';

  const themeButton = document.createElement('button');
  themeButton.className = 'theme-button';
  themeButton.innerHTML = `<svg class="palette-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-3.58-8-8-8zm-5.5 9c-.83 0-1.5.67-1.5 1.5S5.67 15 6.5 15s1.5-.67 1.5-1.5S7.33 12 6.5 12zm3-4c-.83 0-1.5.67-1.5 1.5S8.67 11 9.5 11s1.5-.67 1.5-1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>`;

  const themeOptions = document.createElement('div');
  themeOptions.className = 'theme-options';
  themeOptions.style.display = 'none';

  const themes = ['dark', 'light', 'solarized'];
  themes.forEach(theme => {
    const button = document.createElement('button');
    button.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    button.dataset.theme = `${theme}-theme`;
    button.addEventListener('click', () => {
      body.className = `${theme}-theme`;
      localStorage.setItem('theme', `${theme}-theme`);
      themeOptions.style.display = 'none';
    });
    themeOptions.appendChild(button);
  });

  themeSwitcher.appendChild(themeButton);
  themeSwitcher.appendChild(themeOptions);
  body.appendChild(themeSwitcher);

  themeButton.addEventListener('click', () => {
    themeOptions.style.display = themeOptions.style.display === 'none' ? 'block' : 'none';
  });

  document.addEventListener('click', (event) => {
    if (!themeSwitcher.contains(event.target)) {
      themeOptions.style.display = 'none';
    }
  });

  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  body.classList.add(savedTheme);
});
