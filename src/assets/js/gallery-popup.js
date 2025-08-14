const $popup = document.querySelector(".gallery-popup");
if ($popup) {
  const $categories = document.querySelectorAll(".gallery-popup__category");
  $categories.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href").substring(1);
      const targetEl = document.getElementById(targetId);
      const scrollContainer = document.querySelector(".gallery-popup__content");

      if (targetEl && scrollContainer) {
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
