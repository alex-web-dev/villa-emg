import { computePosition, offset, shift } from "@floating-ui/dom";

const $places = document.querySelectorAll(".location-place");

$places.forEach(($place) => {
  const $btn = $place.querySelector(".location-place__btn");
  const $card = $place.querySelector(".location-place__card");

  $btn.addEventListener("click", () => {
    const $prevActivePlace = document.querySelector(".location-place--active");
    const isSamePlace = $prevActivePlace === $place;

    $prevActivePlace?.classList.remove("location-place--active");

    if (!isSamePlace) {
      $place.classList.add("location-place--active");
      window.dispatchEvent(new CustomEvent("locationPlace:open", { detail: { place: $place } }));
    } else {
      window.dispatchEvent(new CustomEvent("locationPlace:close", { detail: { place: $place } }));
    }

    computePosition($btn, $card, {
      middleware: [offset(3), shift()],
      placement: "top",
    }).then(({ x, y }) => {
      Object.assign($card.style, {
        placement: "left",
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  });

  const $closeBtn = $place.querySelector(".location-card__close");
  $closeBtn.addEventListener("click", () => {
    $place.classList.remove("location-place--active");
    window.dispatchEvent(new CustomEvent("locationPlace:close", { detail: { place: $place } }));
  });
});

window.addEventListener("click", (e) => {
  const $activePlace = document.querySelector(".location-place--active");
  const isInner = e.target.closest(".location-place") && !e.target.classList.contains("location-place");

  if (!$activePlace || isInner) return;

  $activePlace.classList.remove("location-place--active");
  window.dispatchEvent(new CustomEvent("locationPlace:close", { detail: { place: $activePlace } }));
});
