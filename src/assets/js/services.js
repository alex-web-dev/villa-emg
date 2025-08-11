const $services = document.querySelector(".services");
if ($services) {
  const $nav = $services.querySelector(".services-sidebar");
  const $navLinks = $nav.querySelectorAll(".services-sidebar__link");
  observer = new IntersectionObserver(
    (entries) => {
      entries
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((entry) => {
          if (entry.isIntersecting) {
            $navLinks.forEach(($link) => {
              const href = $link.getAttribute("href").replace("#", "");
              if (entry.target.id && href === entry.target.id) {
                $link.classList.add("services-sidebar__link--active");
              } else {
                $link.classList.remove("services-sidebar__link--active");
              }
            });
          }
        });
    },
    {
      threshold: 0,
      rootMargin: "-50px 0px -50% 0px",
    }
  );

  const $items = $services.querySelectorAll(".services__item");

  $items.forEach(($section) => {
    observer.observe($section);
  });
}
