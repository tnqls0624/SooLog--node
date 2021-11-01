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
  convertDate();
  convertDateTime();
})();
