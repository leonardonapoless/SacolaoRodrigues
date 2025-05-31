document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  document.addEventListener('mousedown', () => {
    body.classList.add('cursor-click-active');
  });

  document.addEventListener('mouseup', () => {
    body.classList.remove('cursor-click-active');
  });

  document.addEventListener('mouseleave', () => {
    if (body.classList.contains('cursor-click-active')) {
      body.classList.remove('cursor-click-active');
    }
  });
});