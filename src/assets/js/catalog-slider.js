import Swiper from "swiper";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

Swiper.use([Pagination, Autoplay, Navigation]);

const $sliderBox = document.querySelector(".catalog-slider");
if ($sliderBox) {
  const $slider = $sliderBox.querySelector(".catalog-slider__main");
  const $btnLeft = $sliderBox.querySelector(".catalog-slider__navigation-left");
  const $btnRight = $sliderBox.querySelector(".catalog-slider__navigation-right");

  new Swiper($slider, {
    slidesPerView: "auto",
    spaceBetween: 12,
    speed: 500,
    loop: true,
    navigation: {
      prevEl: $btnLeft,
      nextEl: $btnRight,
    },
    breakpoints: {
      1181: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
      641: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
    },
  });
}
