(() => {
  function get2digits(num) {
    return ('0' + num).slice(-2);
  }

  function getDate(dateObj) {
    if (dateObj instanceof Date) {
      return (
        dateObj.getFullYear() +
        '/ ' +
        get2digits(dateObj.getMonth() + 1) +
        '/ ' +
        get2digits(dateObj.getDate())
      );
    }
  }

  function getTime(dateObj) {
    if (dateObj instanceof Date) {
      return (
        get2digits(dateObj.getHours()) +
        '시' +
        get2digits(dateObj.getMinutes()) +
        '분'
      );
    }
  }

  function convertDate() {
    const data_date = document.querySelectorAll('#data_date');
    data_date.forEach((item) => {
      const dateString = item.dataset['date'];
      if (dateString) {
        const date = new Date(dateString);
        item.innerHTML = getDate(date);
      }
    });
  }

  function convertDateTime() {
    const dataDate_time = document.querySelectorAll('#dataDate-time');
    dataDate_time.forEach((item) => {
      const dateString = item.getAttribute('data-date-time');
      if (dateString) {
        const date = new Date(dateString);
        item.innerHTML = getDate(date) + ' - ' + getTime(date);
      }
    });
  }

  function convertCommentTime() {
    const comment_time = document.querySelectorAll('#data-comment-time');
    comment_time.forEach((item) => {
      const dateString = item.getAttribute('data-comment-time');
      if (dateString) {
        const date = new Date(dateString);
        item.innerHTML = getDate(date) + ' - ' + getTime(date);
      }
    });
  }

  function convertCommentUpdateTime() {
    const comment_time = document.querySelectorAll('#data-comment-updatedAt');
    comment_time.forEach((item) => {
      const dateString = item.getAttribute('data-comment-updatedAt');
      if (dateString) {
        const date = new Date(dateString);
        item.innerHTML = getDate(date) + ' - ' + getTime(date);
      }
    });
  }

  const btn = document.querySelectorAll('#btn');
  btn.forEach((item) => {
    item.addEventListener('mouseover', () => {
      item.classList.add('hover:bg-green-700');
    });
  });

  const input = document.querySelectorAll('#input');
  input.forEach((item) => {
    item.addEventListener('focus', () => {
      item.setAttribute(
        'class',
        'mr-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block shadow-md focus:outline-none focus:ring-2 focus:ring-green-600'
      );
    });
  });

  const select = document.querySelectorAll('#select');
  select.forEach((item) => {
    item.addEventListener('mouseover', () => {
      item.classList.add('hover:bg-green-300');
    });
  });

  const pageBtn = document.querySelectorAll('#pageBtn');
  pageBtn.forEach((item) => {
    item.addEventListener('mouseover', () => {
      item.classList.add('hover:bg-gray-50');
    });
  });

  convertDate();
  convertDateTime();
  convertCommentTime();
  convertCommentUpdateTime();
})();
