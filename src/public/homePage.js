(() => {
  var h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight',
    progress = document.querySelector('#progress'),
    scroll;
  var scrollpos = window.scrollY;
  var header = document.getElementById('header');
  var navcontent = document.getElementById('nav-content');
  const text_hover = document.querySelectorAll('#text_hover');

  text_hover.forEach((item) => {
    item.addEventListener('mouseover', (ev) => {
      item.setAttribute('class', 'hover:underline');
    });
  });
  window.onbeforeunload = () => {
    window.location.href('/');
  };

  document.addEventListener('scroll', function () {
    /*Refresh scroll % width*/
    scroll = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
    progress.style.setProperty('--scroll', scroll + '%');

    /*Apply classes for slide in bar*/
    scrollpos = window.scrollY;

    if (scrollpos > 10) {
      header.classList.add('bg-white');
      header.classList.add('shadow');
      navcontent.classList.remove('bg-gray-100');
      navcontent.classList.add('bg-white');
    } else {
      header.classList.remove('bg-white');
      header.classList.remove('shadow');
      navcontent.classList.remove('bg-white');
      navcontent.classList.add('bg-gray-100');
    }
  });
})();
