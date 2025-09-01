const $formSend = document.querySelector(".js-form-params-send");

$formSend?.addEventListener("formSuccess", (event) => {
  const formData = new FormData(event.detail.form);
  const params = new URLSearchParams(formData);
  window.location.href = "villas.html?" + params.toString();
});

let params = new URLSearchParams(window.location.search);

const $formsFill = document.querySelectorAll(".js-form-params-fill");
$formsFill.forEach(($formFill) => {
  params.forEach((value, key) => {    
    const element = $formFill.elements[key];
    if (!element) return;

    if (element.type === "checkbox") {
      element.checked = value === "on" || value === element.value;
    } else if (element.type === "radio") {
      const radio = $formFill.querySelector(`input[name="${key}"][value="${value}"]`);
      if (radio) radio.checked = true;
    } else {
      element.value = value;
    }
  });

  $formFill.querySelectorAll(".js-form-params-fill-input").forEach(($input) => {
    if ($input.dataset.paramsNoUpdate === undefined) {
      $input.addEventListener("input", () => updateParamsInput($input));
      if ($input.type === "checkbox" || $input.type === "radio") {
        $input.addEventListener("change", () => updateParamsInput($input));
      }
    }
  });
});

export function updateParamsInput($input) {
  params = new URLSearchParams(window.location.search);

  if ($input.type === "checkbox") {
    if ($input.checked) {
      params.set($input.name, $input.value || "on");
    } else {
      params.delete($input.name);
    }
  } else if ($input.type === "radio") {
    if ($input.checked) {
      params.set($input.name, $input.value);
    }
  } else {
    if ($input.value.trim() === "") {
      params.delete($input.name);
    } else {
      params.set($input.name, $input.value);
    }
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, "", newUrl);
}

export function updateParamsInputs() {
  const $formsFill = document.querySelectorAll(".js-form-params-fill");
  $formsFill.forEach(($formFill) => {
    $formFill.querySelectorAll(".js-form-params-fill-input").forEach(($input) => updateParamsInput($input));
  });
}

export default {
  updateParamsInput,
  updateParamsInputs,
};
