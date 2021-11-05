(() => {
  const limitForm = document.getElementById('limitForm');
  const limitPost = document.getElementById('limitPost');
  limitPost.addEventListener('change', (e) => {
    limitForm.submit();
  });
})();
