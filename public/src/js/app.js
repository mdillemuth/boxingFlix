// Toggle Dark Mode

// Dark mode toggle button
const themeBtn = document.querySelector('#theme-btn');

// Event for toggling
themeBtn.addEventListener('click', changeTheme);

// Elements that are manipulated in theme
const body = document.querySelector('body');
const table1 = document.querySelector('#table-1');
const table2 = document.querySelector('#table-2');

function lightTheme() {
  body.classList.remove('bg-dark', 'text-light');
  body.classList.add('bg-light', 'text-dark');

  table1.classList.remove('table-dark');
  table1.classList.add('table-light');

  table2.classList.remove('table-dark');
  table2.classList.add('table-light');

  themeBtn.classList.remove('btn-light');
  themeBtn.classList.add('btn-dark');
}

function darkTheme() {
  body.classList.remove('bg-light', 'text-dark');
  body.classList.add('bg-dark', 'text-light');

  table1.classList.remove('table-light');
  table1.classList.add('table-dark');

  table2.classList.remove('table-light');
  table2.classList.add('table-dark');

  themeBtn.classList.remove('btn-dark');
  themeBtn.classList.add('btn-light');
}

function changeTheme() {
  if (body.classList.contains('bg-dark')) {
    lightTheme();
  } else {
    darkTheme();
  }
}
