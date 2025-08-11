import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { updateCheckboxMenuFromField } from "./input-checkboxes";

const $forms = document.querySelectorAll(".js-form");
$forms.forEach(($form) => {
  $form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isError = false;
    const $inputs = $form.querySelectorAll(".input");
    $inputs.forEach(($input) => {
      const $field = $input.querySelector(".input__field");
      const $error = $input.querySelector(".input__error");

      if (
        !validateItem({
          $item: $input,
          itemErrorClass: "input--error",
          $field,
          $error,
        })
      ) {
        isError = true;
      }
    });

    const $selects = $form.querySelectorAll(".select");
    $selects.forEach(($select) => {
      const $field = $select.querySelector(".select__field");
      const $error = $select.querySelector(".select__error");

      if (
        !validateItem({
          $item: $select,
          itemErrorClass: "select--error",
          $field,
          $error,
        })
      ) {
        isError = true;
      }
    });

    const $inputsPhone = $form.querySelectorAll(".input-phone");
    $inputsPhone.forEach(($input) => {
      const $field = $input.querySelector(".input-phone__field");
      const $error = $input.querySelector(".input-phone__error");

      if (
        !validateItem({
          $item: $input,
          itemErrorClass: "input-phone--error",
          $field,
          $error,
        })
      ) {
        isError = true;
      }
    });

    const $inputsGuests = $form.querySelectorAll(".input-guests");
    $inputsGuests.forEach(($input) => {
      const $field = $input.querySelector(".input-guests__field");
      const $error = $input.querySelector(".input-guests__error");

      if (
        !validateItem({
          $item: $input,
          itemErrorClass: "input-guests--error",
          $field,
          $error,
        })
      ) {
        isError = true;
      }
    });

    const $inputsDateRange = $form.querySelectorAll(".date-range");
    $inputsDateRange.forEach(($input) => {
      const $inputStart = $input.querySelector(".date-range__input--start");
      const $fieldStart = $input.querySelector(".date-range__input-field--start");
      const $errorStart = $input.querySelector(".date-range__error--start");

      const $inputEnd = $input.querySelector(".date-range__input--end");
      const $fieldEnd = $input.querySelector(".date-range__input-field--end");
      const $errorEnd = $input.querySelector(".date-range__error--end");
      if (
        !validateItem({
          $item: $inputStart,
          itemErrorClass: "date-range__input--error",
          $field: $fieldStart,
          $error: $errorStart,
        })
      ) {
        isError = true;
      }

      if (
        !validateItem({
          $item: $inputEnd,
          itemErrorClass: "date-range__input--error",
          $field: $fieldEnd,
          $error: $errorEnd,
        })
      ) {
        isError = true;
      }
    });

    const $inputsCheckboxes = $form.querySelectorAll(".input-checkboxes");
    $inputsCheckboxes.forEach(($input) => {
      const $field = $input.querySelector(".input-checkboxes__field");
      const $error = $input.querySelector(".input-checkboxes__error");

      if (
        !validateItem({
          $item: $input,
          itemErrorClass: "input-checkboxes--error",
          $field,
          $error,
        })
      ) {
        isError = true;
      }
    });

    if (!isError) {
      // const formData = new FormData($form);

      const successFormEvent = new CustomEvent("formSuccess", {
        detail: { form: $form },
      });
      $form.dispatchEvent(successFormEvent);

      if ($form.dataset.formNoAlertSuccess === undefined) {
        Swal.fire({
          text: "Thank you! Your message has been sent successfully",
          icon: "success",
          showConfirmButton: false,
          showCloseButton: true,
        });
      }

      if ($form.dataset.formNoClear === undefined) {
        clearForm($form);
      }
    } else {
      if ($form.dataset.formNoAlertError === undefined) {
        Swal.fire({
          text: "Some fields are filled out incorrectly. Please review and try again.",
          icon: "error",
          showConfirmButton: false,
          showCloseButton: true,
        });
      }
    }
  });

  // Clear the fields when it gains focus

  const $inputs = $form.querySelectorAll(".input");
  $inputs.forEach(($input) => {
    const $field = $input.querySelector(".input__field");
    $field.addEventListener("focus", () => {
      $input.classList.remove("input--error");
    });
  });

  const $simpleSelects = $form.querySelectorAll(".simple-select");
  $simpleSelects.forEach(($simpleSelect) => {
    const $select = $simpleSelect.closest(".select");
    const $field = $simpleSelect.querySelector(".simple-select__field");
    $field.addEventListener("click", () => {
      $select.classList.remove("select--error");
    });
  });

  const $inputsPhone = $form.querySelectorAll(".input-phone");
  $inputsPhone.forEach(($input) => {
    const $field = $input.querySelector(".input-phone__field");
    $field.addEventListener("focus", () => {
      $input.classList.remove("input-phone--error");
    });
  });

  const $inputsGuests = $form.querySelectorAll(".input-guests");
  $inputsGuests.forEach(($input) => {
    const $field = $input.querySelector(".input-guests__field");
    $field.addEventListener("focus", () => {
      $input.classList.remove("input-guests--error");
    });
  });

  const $inputsDateRange = $form.querySelectorAll(".date-range");
  $inputsDateRange.forEach(($input) => {
    const $inputStart = $input.querySelector(".date-range__input--start");
    const $inputStartMain = $inputStart.querySelector(".date-range__input-main");
    const $inputEnd = $input.querySelector(".date-range__input--end");
    const $inputEndMain = $inputEnd.querySelector(".date-range__input-main");

    $inputStartMain.addEventListener("click", () => {
      $inputStart.classList.remove("date-range__input--error");
      $inputEnd.classList.remove("date-range__input--error");
    });
    $inputEndMain.addEventListener("click", () => {
      $inputStart.classList.remove("date-range__input--error");
      $inputEnd.classList.remove("date-range__input--error");
    });
  });

  const $inputsCheckboxes = $form.querySelectorAll(".input-checkboxes");
  $inputsCheckboxes.forEach(($input) => {
    const $inputBtn = $input.querySelector(".input-checkboxes__btn");
    $inputBtn.addEventListener("click", () => {
      $input.classList.remove("input-checkboxes--error");
    });
  });
});

function validateItem({ $item, itemErrorClass, $field, $error }) {
  const validateType = $field.dataset.validate;

  if (validateType !== undefined && !validateEmpty($field)) {
    $item.classList.add(itemErrorClass);
    $error.innerText = `Please fill in the required field`;
    return false;
  }

  if (validateType === "phone" && !validatePhone($field)) {
    $item.classList.add(itemErrorClass);
    $error.innerText = `Invalid phone number`;
    return false;
  }

  if (validateType === "email" && !validateEmail($field)) {
    $item.classList.add(itemErrorClass);
    $error.innerText = "Invalid email address";
    return false;
  }

  return true;
}

function validateEmpty($field) {
  if ($field.value.length < 1) {
    return false;
  }

  return true;
}

function validatePhone($field) {
  if (!/(?:\+|\d)[\d\-\(\) ]{5,}\d/g.test($field.value)) {
    return false;
  }

  return true;
}

function validateEmail($field) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return emailPattern.test($field.value.trim());
}

function clearForm($form) {
  const $inputs = $form.querySelectorAll(".input");
  $inputs.forEach(($input) => {
    const $field = $input.querySelector(".input__field");
    $field.value = "";
  });

  const $selects = $form.querySelectorAll(".select");
  $selects.forEach(($select) => {
    const $field = $select.querySelector(".select__field");
    $field.selectedIndex = 0;

    const $simpleSelectField = $select.querySelector(".simple-select__field");
    const $firstItem = $select.querySelector('.simple-select__item[data-select-index="0"');
    $simpleSelectField.innerText = $firstItem.innerText;
    if ($field.options[0].value === "") {
      $simpleSelectField.classList.add("simple-select__field--placeholder");
    }

    const $hoverItem = $select.querySelector(".simple-select__item--hover");
    $hoverItem?.classList.remove("simple-select__item--hover");

    const $activeItem = $select.querySelector(".simple-select__item--active");
    $activeItem?.classList.remove("simple-select__item--active");
  });

  const $inputsPhone = $form.querySelectorAll(".input-phone");
  $inputsPhone.forEach(($inputPhone) => {
    const $field = $inputPhone.querySelector(".input-phone__field");
    $field.value = "";
  });

  const $inputsGuests = $form.querySelectorAll(".input-guests");
  $inputsGuests.forEach(($inputGuests) => {
    const $field = $inputGuests.querySelector(".input-guests__field");
    $field.value = "";

    const $counters = $inputGuests.querySelectorAll(".guests-menu__item-counter");
    $counters.forEach(($counter) => {
      $counter.setValue(0);
    });
  });

  const $inputsDateRange = $form.querySelectorAll(".date-range");
  $inputsDateRange.forEach(($input) => {
    const $fieldStart = $input.querySelector(".date-range__input-field--start");
    const $fieldEnd = $input.querySelector(".date-range__input-field--end");
    $fieldStart.value = "";
    $fieldEnd.value = "";
    $fieldStart.classList.remove("date-range__input-field--fill");
    $fieldEnd.classList.remove("date-range__input-field--fill");
  });

  const $inputsCheckboxes = $form.querySelectorAll(".input-checkboxes");
  $inputsCheckboxes.forEach(($inputCheckbox) => {
    const $field = $inputCheckbox.querySelector(".input-checkboxes__field");
    $field.value = "";

    updateCheckboxMenuFromField($inputCheckbox);
  });
}
