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
  const any_Bord = document.querySelectorAll('#any_Bord');
  const any_Populate_btn = document.getElementById('any_Populate_btn');
  const game_Bord = document.querySelectorAll('#game_Bord');
  const game_Populate_btn = document.getElementById('game_Populate_btn');
  let count_any = 0;
  let count_game = 0;
  any_Populate_btn.addEventListener('click', () => {
    any_Bord.forEach((item) => {
      item.classList.toggle('hidden');
    });
    if (count_any % 2 == 0) {
      any_Populate_btn.innerHTML = '새로운글 보기';
    } else {
      any_Populate_btn.innerHTML = '인기글 보기';
    }
    count_any++;
  });
  game_Populate_btn.addEventListener('click', () => {
    game_Bord.forEach((item) => {
      item.classList.toggle('hidden');
    });
    if (count_game % 2 == 0) {
      game_Populate_btn.innerHTML = '새로운글 보기';
    } else {
      game_Populate_btn.innerHTML = '인기글 보기';
    }
    count_game++;
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
