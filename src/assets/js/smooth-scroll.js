const $anchors = document.querySelectorAll('a[href*="#"]');
$anchors.forEach(($anchor) => {
  $anchor.addEventListener("click", (e) => {
    const id = $anchor.getAttribute("href");
    const headerHeight = document.querySelector(".header").offsetHeight;

    if (id[0] === "#") {
      e.preventDefault();
    }

    if (id === "#") {
      return;
    }

    const $elem = document.querySelector(id);
    if ($elem) {
      let offsetTop = $elem.getBoundingClientRect().top;
      offsetTop -= headerHeight;

      window.scrollBy({ top: offsetTop, left: 0, behavior: "smooth" });
    }
  });
});

updateHeaderHeightVar();
window.addEventListener("resize", updateHeaderHeightVar);

function updateHeaderHeightVar() {
  const header = document.querySelector(".header");
  const h = header ? header.offsetHeight : 0;
  document.documentElement.style.setProperty("--header-height", `${h}px`);
}
