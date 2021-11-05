(() => {
  function writer() {
    const writer = document.getElementById('writer');
    const writerData = writer.getAttribute('data-writer');
    writer.innerHTML = writerData;
  }
  writer();
})();
