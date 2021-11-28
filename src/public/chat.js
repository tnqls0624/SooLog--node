// IIFE
(() => {
  const socket = new WebSocket(`ws://localhost:3000`);
  const formEl = document.getElementById('form');
  const chatsEl = document.getElementById('chats');
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
      div.innerText = `${nickname}: ${message}`;

      chatsEl.appendChild(div);
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
