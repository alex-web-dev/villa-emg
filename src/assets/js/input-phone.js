const $phoneInputs = document.querySelectorAll(".input-phone");
$phoneInputs.forEach(($phoneInput) => {
  const $countrySelector = $phoneInput.querySelector(".input-phone__selector");
  const codeEl = $countrySelector.querySelector(".input-phone__selector-code");
  const flagEl = $countrySelector.querySelector(".input-phone__selector-flag");
  const $phoneField = $phoneInput.querySelector(".input-phone__field");
  const $fullPhoneInput = $phoneInput.querySelector(".input-phone__full-field");

  let currentMask = IMask($phoneField, {
    mask: $countrySelector.querySelector(".phone-menu__item").dataset.mask,
  });

  const $items = $phoneInput.querySelectorAll(".phone-menu__item");
  $items.forEach(($item) => {
    $item.addEventListener("click", () => {
      currentMask.value = '';

      const newFlag = $item.querySelector(".phone-menu__item-flag").src;
      const newCode = $item.dataset.code;
      const newMaskPattern = $item.dataset.mask;

      codeEl.textContent = newCode;
      codeEl.setAttribute("data-country-code", newCode);
      flagEl.src = newFlag;

      currentMask.updateOptions({ mask: newMaskPattern });
      $phoneField.placeholder = newMaskPattern;

      $countrySelector.classList.remove("dropdown--active");

      updateFullPhone($fullPhoneInput, codeEl, currentMask);
    });
  });

  $phoneInput.addEventListener("input", () => updateFullPhone($fullPhoneInput, codeEl, currentMask));
});

function updateFullPhone($fullPhoneInput, codeEl, currentMask) {
  const countryCode = codeEl.getAttribute("data-country-code") || "";
  const localNumber = currentMask.value || "";
  $fullPhoneInput.value = `${countryCode} ${localNumber}`.trim();
}
