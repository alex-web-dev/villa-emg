const $dropdowns = document.querySelectorAll(".dropdown");

$dropdowns.forEach(($dropdown) => {
  const $btn = $dropdown.querySelector(".dropdown__btn");

  $btn.addEventListener("click", (e) => {
    e.stopPropagation();

    $dropdowns.forEach((d) => {
      if (d !== $dropdown) {
        d.classList.remove("dropdown--active");
      }
    });

    $dropdown.classList.toggle("dropdown--active");
  });
});

window.addEventListener("click", (e) => {
  if (e.target.closest(".dropdown")) return;

  $dropdowns.forEach((d) => d.classList.remove("dropdown--active"));
});
