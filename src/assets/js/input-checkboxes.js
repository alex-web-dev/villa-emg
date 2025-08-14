import { createElem } from "./utils";

const $inputCheckboxes = document.querySelectorAll(".input-checkboxes");

$inputCheckboxes.forEach(($container) => {
  $container._checkedLabels = [];

  const $checkboxes = $container.querySelectorAll(".checkbox-menu__item");

  $checkboxes.forEach(($checkbox, index) => {
    const $input = $checkbox.querySelector(".checkbox__input");
    $input.dataset.id = index;

    $input.addEventListener("change", () => {
      toggleCheckedLabel($container, index, $input.value);
      updateInput($container, $checkboxes);
    });
  });
});

function toggleCheckedLabel($container, id, value) {
  const checkedLabels = $container._checkedLabels;
  const existingIndex = checkedLabels.findIndex((label) => label.id === id);
  if (existingIndex !== -1) {
    checkedLabels.splice(existingIndex, 1);
  } else {
    checkedLabels.push({ id, value });
  }
}

export function updateInput($container, $checkboxes) {
  const checkedLabels = $container._checkedLabels;

  const selectedIds = new Set(checkedLabels.map((l) => l.id));
  $checkboxes.forEach(($checkbox) => {
    const $input = $checkbox.querySelector(".checkbox__input");
    $input.checked = selectedIds.has(+$input.dataset.id);
  });

  const $valuesBox = $container.querySelector(".input-checkboxes__values");
  const $btn = $container.querySelector(".input-checkboxes__btn");
  const $hiddenField = $container.querySelector(".input-checkboxes__field");

  $valuesBox.innerHTML = "";

  $hiddenField.value = checkedLabels.map((l) => l.value).join(", ");
  $hiddenField.dispatchEvent(new Event("input", { bubbles: true }));

  if (checkedLabels.length) {
    $btn.classList.add("input-checkboxes__btn--fill");

    const first = checkedLabels[0];
    const $firstLabel = createElem("div", "label input-checkboxes__values-item");
    $firstLabel.dataset.id = first.id;

    const $firstLabelValue = createElem("span", "text", {
      innerText: first.value,
    });

    const $firstLabelClose = createElem("div", "label__close", {
      innerHTML: '<img src="assets/img/icons/exit.svg" alt="">',
    });

    $firstLabelClose.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCheckedLabel($container, first.id, first.value);
      updateInput($container, $checkboxes);
    });

    $firstLabel.append($firstLabelValue, $firstLabelClose);
    $valuesBox.append($firstLabel);

    if (checkedLabels.length > 1) {
      const $countLabel = createElem("div", "label input-checkboxes__values-item");
      const $countLabelValue = createElem("span", "text", {
        innerText: `+${checkedLabels.length - 1}`,
      });
      $countLabel.append($countLabelValue);
      $valuesBox.append($countLabel);
    }
  } else {
    $btn.classList.remove("input-checkboxes__btn--fill");
  }
}

export function updateCheckboxMenuFromField($container) {
  const $checkboxes = $container.querySelectorAll(".checkbox-menu__item");
  const $hiddenField = $container.querySelector(".input-checkboxes__field");

  $container._checkedLabels = [];

  const values = $hiddenField.value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (!values.length) {
    updateInput($container, $checkboxes);
    return;
  }

  $checkboxes.forEach(($checkbox, index) => {
    const $input = $checkbox.querySelector(".checkbox__input");
    if (values.includes($input.value)) {
      $container._checkedLabels.push({ id: index, value: $input.value });
    }
  });

  updateInput($container, $checkboxes);
}

window.addEventListener("load", () => {
  $inputCheckboxes.forEach(($container) => {
    updateCheckboxMenuFromField($container);
  });
});

export default {
  updateCheckboxMenuFromField,
  updateInput,
};
