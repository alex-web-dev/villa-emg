import Swiper from "swiper";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";

Swiper.use([Autoplay, Navigation, EffectFade]);

const $sliderBox = document.querySelector(".banner-slider");
if ($sliderBox) {
  const $slider = $sliderBox.querySelector(".banner-slider__main");
  const $btnLeft = $sliderBox.querySelector(".banner-slider__navigation-left");
  const $btnRight = $sliderBox.querySelector(".banner-slider__navigation-right");
  const $count = $sliderBox.querySelector(".banner-slider__count");
  const $countThis = $sliderBox.querySelector(".banner-slider__count-this");
  const $countTotal = $sliderBox.querySelector(".banner-slider__count-total");

  new Swiper($slider, {
    effect: 'fade',
    slidesPerView: 1,
    speed: 700,
    autoplay: {
      delay: 5000
    },
    loop: true,
    navigation: {
      prevEl: $btnLeft,
      nextEl: $btnRight,
    },
    allowTouchMove: false,
    on: {
      init: (swiper) => updateCount(swiper, $countThis, $countTotal),
      slideChange: (swiper) => updateCount(swiper, $countThis, $countTotal),
    },
  });

  window.addEventListener("load", () => $count.classList.add("banner-slider__count--loaded"));
}

function updateCount(swiper, $countThis, $countTotal) {
  $countThis.innerText = swiper.realIndex + 1;
  $countTotal.innerText = swiper.slides.length;
}
