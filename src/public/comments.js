(() => {
  const commentEdit = document.querySelectorAll('#commentEdit');
  const commentShow = document.querySelectorAll('#comment_show');
  const commentParent = document.querySelectorAll('#commentParent');
  const reply_show = document.querySelectorAll('#reply_show');

  commentEdit.forEach((item) => {
    item.addEventListener('click', (e) => {
      const data = e.target.dataset;
      commentShow.forEach((item) => {
        if (data.commentid === item.getAttribute('data-commentText')) {
          item.classList.toggle('hidden');
        }
      });
    });
  });

  commentParent.forEach((item) => {
    item.addEventListener('click', (e) => {
      const data = e.target.dataset;
      reply_show.forEach((item) => {
        if (data.commentid === item.getAttribute('data-commentText')) {
          item.classList.toggle('hidden');
        }
      });
    });
  });

  const commentDelete = document.getElementById('commentDelete');
  commentDelete.addEventListener('click', (e) => {
    const returnValue = confirm('삭제하시겠습니다?');
    if (returnValue) {
      alert('삭제되었습니다!');
    } else {
      alert('취소되었습니다!');
      e.preventDefault();
    }
  });
})();
