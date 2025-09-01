document.querySelectorAll('.villa-card').forEach(card => {
  const text = card.querySelector('.villa-card__text');
  if (!text) return;

  const expand = () => {
    const endHeight = text.scrollHeight;

    text.style.height = endHeight + 'px';
  };

  const collapse = () => {
    const startHeight = text.scrollHeight;
    text.style.height = startHeight + 'px';
    void text.offsetHeight;

    text.style.height = '0px';
  };

  card.addEventListener('mouseenter', expand);
  card.addEventListener('mouseleave', collapse);
});
