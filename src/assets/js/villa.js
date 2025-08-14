import Swiper from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { moveElement } from "./utils";
import { createGalleryModalFromData, openGalleryModal } from "./igallery";

Swiper.use([Autoplay, Navigation, Pagination]);

const $sliderBox = document.querySelector(".villa__slider-box");
if ($sliderBox) {
  const $slider = $sliderBox.querySelector(".villa__slider-main");
  const $btnLeft = $sliderBox.querySelector(".villa__slider-navigation-left");
  const $btnRight = $sliderBox.querySelector(".villa__slider-navigation-right");
  const $pagination = $sliderBox.querySelector(".villa__slider-pagination");

  new Swiper($slider, {
    slidesPerView: 1,
    speed: 500,
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

const $villa = document.querySelector(".villa");
if ($villa) {
  const $submit = $villa.querySelector(".villa__info-btn--submit");
  const $dates = $villa.querySelector(".villa__dates");
  const $datesBox = $dates.querySelector(".villa__dates-box");
  const $dateRange = $datesBox.querySelector(".date-range");
  const $datesFieldStart = $dates.querySelector(".date-range__input-field--start");
  const $datesFieldEnd = $dates.querySelector(".date-range__input-field--end");
  const $datesAvailable = $dates.querySelector(".villa__dates-available");
  const $datesBooked = $dates.querySelector(".villa__dates-booked");
  const $datesBookedValue = $datesBooked.querySelector(".villa__dates-booked-value");
  const $datesClear = $dates.querySelector(".villa__dates-clear");

  $submit.addEventListener("click", () => {
    if (!$datesFieldStart.value || !$datesFieldEnd.value) {
      $datesBox.classList.add("villa__dates-box--error");

      const headerHeight = document.querySelector(".header").offsetHeight;
      window.scrollTo({
        top: $dates.getBoundingClientRect().top + window.scrollY - headerHeight,
        behavior: "smooth",
      });
    }
  });

  const selectedDatesHandler = () => {
    const flatpickr = $dateRange._flatpickr;

    if ($datesFieldStart.value && $datesFieldEnd.value) {
      $datesBox.classList.remove("villa__dates-box--error");
      $datesAvailable?.classList.add("villa__dates-available--active");
      $datesBooked?.classList.add("villa__dates-booked--active");

      const bookedDays = Number((flatpickr.selectedDates[1] - flatpickr.selectedDates[0]) / (1000 * 60 * 60 * 24) + 1);
      $datesBookedValue.innerText = bookedDays;

      $datesClear.removeAttribute("disabled");
    } else {
      $datesAvailable?.classList.remove("villa__dates-available--active");
      $datesBooked?.classList.remove("villa__dates-booked--active");
      $datesClear.setAttribute("disabled", "");
    }
  };

  $datesFieldStart.addEventListener("input", selectedDatesHandler);
  $datesFieldEnd.addEventListener("input", selectedDatesHandler);

  $datesClear.addEventListener("click", () => {
    const flatpickr = $dateRange._flatpickr;

    $datesFieldStart.value = "";
    $datesFieldEnd.value = "";
    $datesFieldStart.dispatchEvent(new Event("input", { bubbles: true }));
    $datesFieldEnd.dispatchEvent(new Event("input", { bubbles: true }));
    flatpickr.clear();

    selectedDatesHandler();
  });

  moveInfo();
  window.addEventListener("resize", moveInfo);
}

function moveInfo() {
  moveElement({
    element: ".villa__info",
    from: ".villa__info-box",
    to: ".villa__mobile-info-box",
    width: 1080,
  });
}

const $openVideosBtns = document.querySelectorAll(".js-open-villa-videos");
if ($openVideosBtns.length !== 0) {
  const videoGalleryData = [
    { video: "assets/video/about.mp4", preview: "assets/img/about/video-preview.jpg" },
    { video: "assets/video/about.mp4", preview: "assets/img/about/video-preview.jpg" },
  ];

  const $modal = createGalleryModalFromData({ data: videoGalleryData, duration: 400, theme: "dark", thumbs: true });

  $openVideosBtns.forEach(($btn) => {
    $btn.addEventListener("click", () => openGalleryModal($modal));
  });
}
