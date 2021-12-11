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
  const hover_underline = document.querySelectorAll('#hover_underline');
  const moveItPost = document.getElementById('itPost');
  const itArea = document.getElementById('itArea');
  const any_bord_populate = document.getElementById('any_bord_populate');
  const any_bord_new = document.getElementById('any_bord_new');
  const any_Populate_btn = document.getElementById('any_Populate_btn');
  const any_New_btn = document.getElementById('any_New_btn');
  const game_bord_populate = document.getElementById('game_bord_populate');
  const game_bord_new = document.getElementById('game_bord_new');
  const game_Populate_btn = document.getElementById('game_Populate_btn');
  const game_New_btn = document.getElementById('game_New_btn');

  any_Populate_btn.addEventListener('click', () => {
    any_New_btn.classList.remove('active');
    any_Populate_btn.classList.add('active');
    any_bord_populate.classList.remove('hidden');
    any_bord_new.classList.add('hidden');
  });
  any_New_btn.addEventListener('click', () => {
    any_Populate_btn.classList.remove('active');
    any_New_btn.classList.add('active');
    any_bord_populate.classList.add('hidden');
    any_bord_new.classList.remove('hidden');
  });

  game_Populate_btn.addEventListener('click', () => {
    game_New_btn.classList.remove('active');
    game_Populate_btn.classList.add('active');
    game_bord_populate.classList.remove('hidden');
    game_bord_new.classList.add('hidden');
  });
  game_New_btn.addEventListener('click', () => {
    game_Populate_btn.classList.remove('active');
    game_New_btn.classList.add('active');
    game_bord_populate.classList.add('hidden');
    game_bord_new.classList.remove('hidden');
  });

  hover_underline.forEach((item) => {
    item.addEventListener('mouseover', (ev) => {
      item.classList.add('hover:underline');
    });
  });
  window.onbeforeunload = () => {
    window.location.href = '/';
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
  moveItPost.addEventListener('click', () => {
    itArea.scrollIntoView({ behavior: 'smooth' });
  });
})();
