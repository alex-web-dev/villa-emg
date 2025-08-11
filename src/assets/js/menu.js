import Swiper from "swiper";
import { Autoplay, Navigation, Mousewheel } from "swiper/modules";
import { lockBody, unlockBody } from "./utils";

Swiper.use([Autoplay, Navigation, Mousewheel]);

const $slider = document.querySelector(".menu__gallery");
if ($slider) {
  new Swiper($slider, {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 16,
    speed: 700,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    allowTouchMove: true,
    mousewheel: {
      sensitivity: 1.4,
    },
    breakpoints: {
      992: {
        direction: "vertical",
      },
    },
  });
}

const $menu = document.querySelector(".menu");
window.addEventListener("load", () => $menu.classList.add("menu--show"));

const $menuToggle = document.querySelector(".menu-toggle");
$menuToggle?.addEventListener("click", openMenu);

const $menuClose = $menu.querySelector(".menu__close");
$menuClose.addEventListener("click", closeMenu);

function openMenu() {
  lockBody(".menu, .header");
  $menu.classList.toggle("menu--active");
}

function closeMenu() {
  unlockBody(".menu, .header");
  $menu.classList.remove("menu--active");
}
