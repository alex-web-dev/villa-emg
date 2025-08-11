document.querySelectorAll(".counter").forEach(($counter) => {
  const $plus = $counter.querySelector(".counter__plus");
  const $minus = $counter.querySelector(".counter__minus");
  const $input = $counter.querySelector(".counter__input");

  let min = Number($counter.dataset.min ?? 1);
  let max = $counter.dataset.max !== undefined ? Number($counter.dataset.max) : Infinity;

  if (!isFinite(max) || max < min) {
    max = Infinity;
  }

  const clamp = (value) => {
    if (isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  };

  const emitChange = (value) => {
    const event = new CustomEvent("counter:change", {
      bubbles: true,
      detail: {
        value,
        counter: $counter,
        input: $input,
      },
    });
    $counter.dispatchEvent(event);
  };

  const updateButtons = () => {
    const val = clamp(Number($input.value));
    $input.value = val;

    if (val <= min) {
      $minus.setAttribute("disabled", "");
      $minus.classList.add("counter__minus--disabled");
    } else {
      $minus.removeAttribute("disabled");
      $minus.classList.remove("counter__minus--disabled");
    }

    if (val >= max) {
      $plus.setAttribute("disabled", "");
      $plus.classList.add("counter__plus--disabled");
    } else {
      $plus.removeAttribute("disabled");
      $plus.classList.remove("counter__plus--disabled");
    }

    emitChange(val);
  };

  $counter.update = updateButtons;
  $counter.setValue = (val) => {
    $input.value = clamp(val);
    updateButtons();
  };

  $plus.addEventListener("click", () => {
    $input.value = clamp(Number($input.value) + 1);
    updateButtons();
  });

  $minus.addEventListener("click", () => {
    $input.value = clamp(Number($input.value) - 1);
    updateButtons();
  });

  $input.addEventListener("input", updateButtons);
  $input.addEventListener("blur", updateButtons);

  updateButtons();
});
