import Swiper from "swiper";
import { Navigation, FreeMode, Thumbs } from "swiper/modules";
import { createElem } from "./utils";

Swiper.use([Navigation, FreeMode, Thumbs]);

const $boxes = document.querySelectorAll(".igallery");
$boxes.forEach(($galleryBox) => {
  const duration = $galleryBox.dataset.duration ? $galleryBox.dataset.duration : 400;
  const $modal = createGalleryModal($galleryBox, duration);

  const $items = $galleryBox.querySelectorAll(".igallery__item");
  $items.forEach(($item, index) => {
    const $btns = $item.querySelectorAll(".igallery__btn");
    $btns.forEach(($btn) => {
      $btn.addEventListener("click", () => openGalleryModal($modal, index));
    });
  });
});

export function openGalleryModal($modal, imgIndex) {
  const $slider = $modal.querySelector(".igallery-modal__slider");

  $slider.swiper.slideTo(imgIndex, 0, false);
  $modal.classList.add("igallery-modal--hide");
  $modal.classList.add("igallery-modal--active");
  setTimeout(() => $modal.classList.remove("igallery-modal--hide"), 10);
}

export function closeGalleryModal($modal) {
  $modal.classList.add("igallery-modal--hide");
  setTimeout(() => {
    $modal.classList.remove("igallery-modal--hide");
    $modal.classList.remove("igallery-modal--active");
  }, 400);
}

export function createGalleryModalFromData({ data, duration = 400, theme, thumbs }) {
  const $galleryBox = document.createElement("div");
  $galleryBox.classList.add("igallery");

  if (thumbs) {
    $galleryBox.dataset.thumbs = "";
  }

  data.forEach((item) => {
    const $item = document.createElement("div");
    $item.classList.add("igallery__item");

    if (item.img) {
      $item.dataset.img = item.img;
    } else if (item.video) {
      $item.dataset.video = item.video;
      if (item.preview) {
        $item.dataset.preview = item.preview;
      }
    }

    const $btn = document.createElement("div");
    $btn.classList.add("igallery__btn");
    $item.appendChild($btn);

    $galleryBox.appendChild($item);
  });

  const $modal = createGalleryModal($galleryBox, duration, theme);

  return $modal;
}

export function createGalleryModal($galleryBox, duration, theme) {
  const $modal = createElem("div", "igallery-modal");
  if (theme) {
    $modal.classList.add(`igallery-modal--${theme}`);
  }
  $modal.style.transitionDuration = `${duration}ms`;
  $modal.innerHTML = `
    <div class="igallery-modal__content">
      <div class="igallery-modal__main">
        <div class="igallery-modal__slider swiper"></div>
        <div class="igallery-modal__controls">
          <button class="link igallery-modal__prev">
            <svg class="link__icon link__icon--stroke" width="54" height="24" viewBox="0 0 54 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.5625 1.625L52.8745 11.937M52.8745 11.937L42.5625 22.2489M52.8745 11.937L1.00053 11.937" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="link igallery-modal__next">
            <svg class="link__icon link__icon--stroke" width="54" height="24" viewBox="0 0 54 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.5625 1.625L52.8745 11.937M52.8745 11.937L42.5625 22.2489M52.8745 11.937L1.00053 11.937" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="igallery-modal__thumbnails swiper"></div>
    </div>
    <div class="igallery-modal__backdrop"></div>
    <div class="text text--iflex text--lg igallery-modal__count"> 
      <span class="igallery-modal__count-this">1</span>
      /
      <span class="igallery-modal__count-total">0</span>
    </div>
    <button class="link link--iflex igallery-modal__close">
      <svg class="link__icon link__icon--fill" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.8505 6.87169L12.7222 11.9999L17.8505 17.1282C18.0498 17.3277 18.0498 17.6509 17.8505 17.8503C17.7508 17.95 17.62 17.9998 17.4893 17.9998C17.3586 17.9998 17.228 17.9499 17.1282 17.8503L12.0001 12.7221L6.87181 17.8503C6.77212 17.95 6.6414 17.9998 6.51068 17.9998C6.37996 17.9998 6.24937 17.9499 6.14955 17.8503C5.95015 17.6508 5.95015 17.3276 6.14955 17.1282L11.2779 11.9999L6.14967 6.87169C5.95028 6.67216 5.95028 6.34894 6.14967 6.14955C6.3492 5.95015 6.67242 5.95015 6.87181 6.14955L12.0001 11.2778L17.1283 6.14955C17.3278 5.95015 17.6511 5.95015 17.8505 6.14955C18.0498 6.34894 18.0498 6.67229 17.8505 6.87169Z" />
      </svg>
      <span>Close</span>
    </button>
  `;

  const $items = $galleryBox.querySelectorAll(".igallery__item");
  const $sliderWrapper = createElem("div", "swiper-wrapper");

  $items.forEach(($item) => {
    const $slide = createElem("div", "swiper-slide");

    if ($item.dataset.img) {
      $slide.innerHTML = `<img class="igallery-modal__img" src="${$item.dataset.img}" alt="">`;
    } else if ($item.dataset.video) {
      const preview = $item.dataset.preview || "";
      $slide.innerHTML = `
      <div class="video igallery-modal__video" data-src="${$item.dataset.video}">
        <img class="video__bg" src="${preview}" alt="" />
        <button class="video__play">
          <div class="text text--white text--iflex">
            <img class="text__icon text__icon--mx-xs" src="assets/img/icons/play-white.svg" alt="" />
            <span>Play</span>
          </div>
        </button>
      </div>
    `;
    }

    $sliderWrapper.append($slide);
  });

  document.body.appendChild($modal);

  const $slider = $modal.querySelector(".igallery-modal__slider");
  $slider.append($sliderWrapper);

  if ($galleryBox.dataset.thumbs !== undefined) {
    const $thumbnails = $modal.querySelector(".igallery-modal__thumbnails");
    const $thumbnailsWrapper = createElem("div", "swiper-wrapper");
    $items.forEach(($item) => {
      const $thumbnail = createElem("div", "igallery-modal__thumbnail");
      $thumbnail.innerHTML = `<img src="${$item.dataset.img || $item.dataset.preview}">`;

      const $slide = createElem("div", "swiper-slide igallery-modal__thumbnails-slide");
      $slide.append($thumbnail);

      $thumbnailsWrapper.append($slide);
    });

    $thumbnails.append($thumbnailsWrapper);

    const $content = $modal.querySelector(".igallery-modal__content");
    $content.append($thumbnails);
  }

  const $prev = $modal.querySelector(".igallery-modal__prev");
  const $next = $modal.querySelector(".igallery-modal__next");

  const $countThis = $modal.querySelector(".igallery-modal__count-this");
  const $countTotal = $modal.querySelector(".igallery-modal__count-total");

  $countTotal.textContent = $items.length;

  let swiperOptions = {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,
    speed: 600,
    navigation: {
      prevEl: $prev,
      nextEl: $next,
    },
    on: {
      init: function () {
        $countThis.textContent = this.realIndex + 1;
      },
      slideChange: function () {
        pauseAllVideos(this.slides);
        $countThis.textContent = this.realIndex + 1;
      },
    },
  };

  if ($galleryBox.dataset.thumbs !== undefined) {
    const thumbnailsSlider = new Swiper($modal.querySelector(".igallery-modal__thumbnails"), {
      slidesPerView: "auto",
      freeMode: true,
      spaceBetween: 10,
      watchSlidesProgress: true,
    });

    swiperOptions.thumbs = {
      swiper: thumbnailsSlider,
    };
  }

  new Swiper($slider, swiperOptions);

  function pauseAllVideos(slides) {
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (video) {
        video.pause();
      }
    });
  }

  const $close = $modal.querySelector(".igallery-modal__close");
  $close.addEventListener("click", () => closeGalleryModal($modal));

  const $backdrop = $modal.querySelector(".igallery-modal__backdrop");
  $backdrop.addEventListener("click", () => closeGalleryModal($modal));

  return $modal;
}
