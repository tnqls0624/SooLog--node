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
      console.log(dateString);
      if (dateString) {
        const date = new Date(dateString);
        item.innerHTML = getDate(date) + ' - ' + getTime(date);
      }
    });
  }
  function writer() {
    const writer = document.getElementById('writer');
    const writerData = writer.getAttribute('data-writer');
    writer.innerHTML = writerData;
  }
  const btn = document.querySelectorAll('#btn');
  btn.forEach((item) => {
    item.addEventListener('mouseover', () => {
      item.classList.add('hover:bg-blue-700');
    });
  });

  const input = document.querySelectorAll('#input');
  input.forEach((item) => {
    item.addEventListener('focus', () => {
      item.setAttribute(
        'class',
        'mr-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600'
      );
    });
  });

  const select = document.querySelectorAll('#select');
  select.forEach((item) => {
    item.addEventListener('mouseover', () => {
      item.classList.add('hover:bg-blue-300');
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
  writer();
})();
