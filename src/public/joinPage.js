(() => {
  const formEl = document.getElementById('form');
  const pwEl = document.getElementById('pw');
  const pw2El = document.getElementById('pw2');
  if (!formEl) {
    throw new Error('Not Element');
  }

  formEl.addEventListener('submit', (ev) => {
    if (pwEl.value !== pw2El.value) {
      throw new Error('password error');
    }
  });
})();
