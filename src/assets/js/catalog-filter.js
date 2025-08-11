const $catalogFilters = document.querySelectorAll(".catalog-filter");
const params = new URLSearchParams(window.location.search);

$catalogFilters.forEach(($catalogFilter) => {
  const $btn = $catalogFilter.querySelector(".catalog-filter__btn");
  const $field = $catalogFilter.querySelector(".catalog-filter__field");
  const $btnValue = $btn.querySelector(".catalog-filter__btn-value");
  const $checkboxesInputs = $catalogFilter.querySelectorAll(".filter-menu__checkbox-input");
  const $dropdown = $catalogFilter.closest(".dropdown");

  if ($btnValue.innerText) {
    $btn.classList.add("catalog-filter__btn--fill");
  }

  const closeWhenSelected = $catalogFilter.dataset.selectCloseDropdown !== undefined;

  $checkboxesInputs.forEach(($checkboxInput) => {
    $checkboxInput.addEventListener("change", () => {
      if (closeWhenSelected) $dropdown.classList.remove("dropdown--active");
      if ($checkboxInput.dataset.label) {
        $btn.classList.add("catalog-filter__btn--fill");
        $btnValue.innerText = $checkboxInput.dataset.label;
        $field.value = $checkboxInput.dataset.label;
      }
    });
  });

  const paramValue = params.get($field.name);
  if (paramValue) {
    $checkboxesInputs.forEach(($checkboxInput) => {
      if ($checkboxInput.dataset.label === paramValue) {
        $checkboxInput.checked = true;
        $btn.classList.add("catalog-filter__btn--fill");
        $btnValue.innerText = paramValue;
        $field.value = paramValue;
      }
    });
  }
});
