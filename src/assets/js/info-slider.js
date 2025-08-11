import Swiper from "swiper";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules";

Swiper.use([Pagination, Autoplay, Navigation, EffectFade]);

const $sliderBox = document.querySelector(".info-slider");
if ($sliderBox) {
  const $slider = $sliderBox.querySelector(".info-slider__main");
  const $pagination = $sliderBox.querySelector(".info-slider__pagination");
  const $btnLeft = $sliderBox.querySelector(".info-slider__navigation-left");
  const $btnRight = $sliderBox.querySelector(".info-slider__navigation-right");

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
  });
}
