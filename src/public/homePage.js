(() => {
  const text_hover = document.querySelectorAll('#text_hover');
  text_hover.forEach((item) => {
    item.addEventListener('mouseover', (ev) => {
      item.setAttribute('class', 'hover:underline');
    });
  });
})();
