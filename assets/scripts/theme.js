function loadTheme() {
  document.documentElement.classList.toggle('dark-theme', !!localStorage.getItem('darkTheme'));
}

function toggleTheme() {
  if (localStorage.getItem('darkTheme')) {
    localStorage.removeItem('darkTheme');
  } else {
    localStorage.setItem('darkTheme', 'true');
  }
  loadTheme();
}

loadTheme();

document.getElementById('theme-color').addEventListener('click', toggleTheme);
