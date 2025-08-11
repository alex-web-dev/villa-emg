import IMask from "imask";

const $inputs = document.querySelectorAll(".js-imask");
$inputs.forEach(($input) => {
  const mask = $input.dataset.mask;
  IMask($input, { mask });
});
