// IIFE
(() => {
  const socket = new WebSocket(`ws://localhost:3000`);
  const formEl = document.getElementById('form');
  const chatsEl = document.getElementById('chats');
  const myMsgEl = document.getElementById('myMsg');
  const inputEl = document.getElementById('chatInput');
  if (!formEl || !inputEl || !chatsEl) {
    throw new Error('Init failed!');
  }
  socket.onerror = function (ev) {
    console.log(ev);
  };
  const chats = [];

  const adjectives = ['멋진', '훌륭한', '친절한', '새침한'];
  const animals = ['물개', '사자', '사슴', '거북이', '백곰'];
  function pickRandom(array) {
    const randomIdx = Math.floor(Math.random() * array.length);
    const result = array[randomIdx];
    if (!result) {
      throw new Error('array length is 0.');
    }
    return result;
  }
  const chatId = document.getElementById('chatId');
  const myNickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`;
  formEl.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (chatId.value) {
      socket.send(
        JSON.stringify({
          nickname: chatId.value,
          message: inputEl.value,
        })
      );
    } else {
      socket.send(
        JSON.stringify({
          nickname: myNickname,
          message: inputEl.value,
        })
      );
    }
    inputEl.value = '';
  });

  const drawChats = async () => {
    chatsEl.innerHTML = '';
    chats.forEach(({ nickname, message }) => {
      const div = document.createElement('div');
      const divWrap = document.createElement('div');
      if (chatId.value === nickname) {
        divWrap.setAttribute('class', 'text-right');
        div.setAttribute(
          'class',
          'inline-block rounded-xl px-1 py-1 mb-1 mt-1 bg-blue-500 text-white'
        );
        div.innerText = `${message}`;
        divWrap.appendChild(div);
      } else {
        div.setAttribute(
          'class',
          'inline-block rounded-xl px-1 py-1 mb-1 mt-1 bg-gray-100 text-block'
        );
        div.innerText = `${nickname}: ${message}`;
        divWrap.appendChild(div);
      }
      chatsEl.appendChild(divWrap);
      chatsEl.scrollTop = chatsEl.scrollHeight;
    });
  };

  socket.addEventListener('message', async (event) => {
    const { type, message, nickname } = JSON.parse(event.data);
    if (type === 'sync') {
      const { chats: syncedChats } = message;
      chats.push(...syncedChats);
    } else if (type === 'chat') {
      const chat = message;
      chats.push({ nickname, message: chat });
    }
    drawChats();
  });
})();
