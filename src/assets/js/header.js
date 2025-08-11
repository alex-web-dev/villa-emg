const $header = document.querySelector(".header");
const scrollClass = "header--scroll";

function toggleHeaderClass() {
  if (window.scrollY > 100 && !$header.classList.contains(scrollClass)) {
    $header.classList.add(scrollClass);
  } else if (window.scrollY <= 100 && $header.classList.contains(scrollClass)) {
    $header.classList.remove(scrollClass);
  }
}

window.addEventListener("load", () => {
  toggleHeaderClass();

  if (!$header.classList.contains('header--bg')) {
    $header.classList.add('header--shadow')
  }
});
window.addEventListener("scroll", toggleHeaderClass);
