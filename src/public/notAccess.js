//IIFE
(() => {
  const body = document.getElementById('body');
  const loginBtn = document.getElementById('button');
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  body.style.backgroundImage = `url(/${randomNumber}.jpg)`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = '50%';
  loginBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    location.href = '/api/login';
  });
})();
