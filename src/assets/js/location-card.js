const $locationCards = document.querySelectorAll('.location-card');

$locationCards.forEach(card => {
  const price = parseFloat(card.getAttribute('data-price'));

  const $price7Days = card.querySelector('.location-card__price--7');

  if (price && $price7Days) {
    const totalPrice = price * 7;
    $price7Days.textContent = `7 days: from €${totalPrice.toLocaleString()}`;
  }
});
