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

  const $hiddenField = $input.querySelector(".input-guests__hidden-field");
  $hiddenField.value = result;
  $hiddenField.dispatchEvent(new Event("input", { bubbles: true }));

  const $field = $input.querySelector(".input-guests__field");
  $field.value = getShortResultStr(parts);
  $field.dispatchEvent(new Event("input", { bubbles: true }));
}

function updateMenu($input) {
  const $hiddenField = $input.querySelector(".input-guests__hidden-field");
  const value = $hiddenField.value.trim();
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const $field = $input.querySelector(".input-guests__field");
  $field.value = getShortResultStr(parts);

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

function getShortResultStr(result) {
  let guestsCount = 0;
  let petsCount = 0;

  let shortResult = [];
  result.forEach((resultItem) => {
    const [value, label] = resultItem.split(" ");
    if (label === "pets") {
      petsCount += +value;
    } else {
      guestsCount += +value;
    }
  });

  if (guestsCount > 0) shortResult.push(`${guestsCount} guests`);
  if (petsCount > 0) shortResult.push(`${petsCount} pets`);

  return shortResult.join(", ");
}
