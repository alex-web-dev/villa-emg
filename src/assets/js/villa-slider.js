import Swiper from "swiper";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules";

Swiper.use([Pagination, Autoplay, Navigation, EffectFade]);

const $sliderBox = document.querySelector(".villa-slider");
if ($sliderBox) {
  const $slider = $sliderBox.querySelector(".villa-slider__main");
  const $pagination = $sliderBox.querySelector(".villa-slider__pagination");
  const $btnLeft = $sliderBox.querySelector(".villa-slider__navigation-left");
  const $btnRight = $sliderBox.querySelector(".villa-slider__navigation-right");

  new Swiper($slider, {
    effect: 'fade',
    slidesPerView: 1,
    speed: 600,
    loop: true,
    pagination: {
      el: $pagination,
      clickable: true,
    },
    navigation: {
      prevEl: $btnLeft,
      nextEl: $btnRight,
    },
    allowTouchMove: false,
  });
}
