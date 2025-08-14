const $inputsGuests = document.querySelectorAll(".input-guests");
$inputsGuests.forEach(($inputGuests) => {
  const $counters = $inputGuests.querySelectorAll(".guests-menu__item-counter");
  window.addEventListener("load", () => {
    updateMenu($inputGuests);

    $counters.forEach(($counter) => {
      $counter.addEventListener("counter:change", () => {
        updateInput($inputGuests);
      });
    });
  });
});

function updateInput($input) {
  const parts = [];
  const $items = $input.querySelectorAll(".guests-menu__item");
  $items.forEach(($item) => {
    const $counterField = $item.querySelector(".counter__input");
    const label = $item.dataset.label;
    const count = Number($counterField.value);

    if (count > 0) {
      parts.push(`${count} ${label}`);
    }
  });

  const result = parts.join(", ");
  const $field = $input.querySelector(".input-guests__field");
  $field.value = result;
  $field.dispatchEvent(new Event("input", { bubbles: true }));
}

function updateMenu($input) {
  const $field = $input.querySelector(".input-guests__field");
  const value = $field.value.trim();
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const $items = $input.querySelectorAll(".guests-menu__item");

  $items.forEach(($item) => {
    const $counter = $item.querySelector(".counter");
    const $counterField = $counter.querySelector(".counter__input");
    const label = $item.dataset.label;

    const found = parts.find((part) => part.endsWith(label));
    if (found) {
      const count = parseInt(found, 10);
      $counterField.value = isNaN(count) ? 0 : count;
    } else {
      $counterField.value = 0;
    }
    $counter.update();
  });
}
