const $formSend = document.querySelector(".js-form-params-send");
$formSend?.addEventListener("formSuccess", (event) => {
  const formData = new FormData(event.detail.form);
  const params = new URLSearchParams(formData);

  window.location.href = "/villas.html?" + params.toString();
});

const params = new URLSearchParams(window.location.search);
const $formFill = document.querySelector(".js-form-params-fill");

params.forEach((value, key) => {
  if ($formFill.elements[key]) {
    $formFill.elements[key].value = value;
  }
});
