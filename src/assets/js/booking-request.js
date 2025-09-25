import { updateParamsInputs } from "./form-params";
import { closePopup } from "./popup";

window.addEventListener("load", () => {
  const $bookingInfo = document.querySelector(".booking-info");
  const $bookingDetails = document.querySelector(".booking-details");
  if ($bookingInfo) {
    /* Clear date buttons */
    const $dateRange = document.querySelector(".date-range");
    const $clearDatesBtns = $bookingDetails.querySelectorAll(".booking-details__clear-dates");
    $clearDatesBtns.forEach(($clearDatesBtn) => {
      $clearDatesBtn.addEventListener("click", () => {
        $dateRange._flatpickr.clear();
      });
    });

    /* Clear guests buttons */
    const $clearGuestsBtns = $bookingDetails.querySelectorAll(".booking-details__clear-guests");
    const $inputGuests = document.querySelector(".booking-details__input-guests");
    const $inputGuestsCounters = $inputGuests.querySelectorAll(".guests-menu__item .counter");
    $clearGuestsBtns.forEach(($clearGuestsBtn) => {
      $clearGuestsBtn.addEventListener("click", () => {
        $inputGuestsCounters.forEach(($counter) => $counter.setValue(0));
      });
    });

    /* Guests max */
    const guestsMax = parseInt($bookingInfo?.dataset?.guestsMax, 10) || 0;
    const $inputGuestsCountersNotPets = $inputGuests.querySelectorAll('.guests-menu__item:not([data-label="pets"]) .counter');

    $inputGuests.addEventListener("counter:change", () => updateCountersState(guestsMax, $inputGuestsCountersNotPets));
    $inputGuests.addEventListener("counter:click", () => updateCountersState(guestsMax, $inputGuestsCountersNotPets));

    enforceGuestsLimit(guestsMax, $inputGuestsCountersNotPets);
    updateCountersState(guestsMax, $inputGuestsCountersNotPets);

    /* Init details */
    updatePriceDetails($bookingInfo);
    updateTripDetails($bookingInfo);

    /* Popup save button */
    const $detailsPopup = document.querySelector('.popup[data-popup-name="booking-details"]');
    const $detailsSaveBtns = document.querySelectorAll(".booking-details__btn--save");
    $detailsSaveBtns.forEach(($saveBtn) => {
      $saveBtn.addEventListener("click", () => {
        updateParamsInputs();
        updatePriceDetails($bookingInfo);
        updateTripDetails($bookingInfo);
        closePopup($detailsPopup);
      });
    });

    const $submit = document.querySelector(".booking-info__btn");
    const $hiddenDateFieldStart = $bookingDetails.querySelector(".booking-details__dates .date-range__input-field-hidden--start");
    const $hiddenDateFieldEnd = $bookingDetails.querySelector(".booking-details__dates .date-range__input-field-hidden--end");
    const $guestsField = $bookingDetails.querySelector(".booking-details__input-guests .input-guests__field");

    const $errorDates = $bookingInfo.querySelector(".booking-info__details-error--dates");
    const $errorGuests = $bookingInfo.querySelector(".booking-info__details-error--guests");
    const $detailsErrorDates = $bookingDetails.querySelector(".booking-details__error--dates");
    const $detailsErrorGuests = $bookingDetails.querySelector(".booking-details__error--guests");

    const $detailsOpenBtn = $bookingInfo.querySelector(".booking-info__details-btn");
    const $detailsTabsBtnDates = $bookingDetails.querySelector(".booking-details__tabs-btn--dates");
    const $detailsTabsBtnGuests = $bookingDetails.querySelector(".booking-details__tabs-btn--guests");

    $submit.addEventListener("click", () => {
      if (!$hiddenDateFieldStart.value || !$hiddenDateFieldEnd.value) {
        $errorDates?.classList.remove("text--hidden");
        $detailsErrorDates?.classList.remove("text--hidden");
        $detailsOpenBtn.classList.add("btn--border-danger");
        $detailsTabsBtnDates.classList.add("nav-btn--danger");
      }

      if (!$guestsField.value) {
        $errorGuests?.classList.remove("text--hidden");
        $detailsErrorGuests?.classList.remove("text--hidden");
        $detailsOpenBtn.classList.add("btn--border-danger");
        $detailsTabsBtnGuests.classList.add("nav-btn--danger");
      }
    });

    $detailsSaveBtns.forEach(($saveBtn) => {
      $saveBtn.addEventListener("click", () => {
        if ($hiddenDateFieldStart.value && $hiddenDateFieldEnd.value) {
          $errorDates?.classList.add("text--hidden");
          $detailsErrorDates?.classList.add("text--hidden");
          $detailsTabsBtnDates?.classList.remove("nav-btn--danger");
        }

        if ($guestsField.value) {
          $errorGuests?.classList.add("text--hidden");
          $detailsErrorGuests?.classList.add("text--hidden");
          $detailsTabsBtnGuests.classList.remove("nav-btn--danger");
        }

        if ($hiddenDateFieldStart.value && $hiddenDateFieldEnd.value && $guestsField.value) {
          $detailsOpenBtn.classList.remove("btn--border-danger");
        }
      });
    });
  }
});

function updatePriceDetails($bookingInfo) {
  const price = Number.parseFloat($bookingInfo.dataset.price) || 0;
  const $detailPrice = $bookingInfo.querySelector(".booking-info__detail-text--price");
  const $detailTotal = $bookingInfo.querySelector(".booking-info__detail-text--total");
  const $hiddenDateFieldStart = document.querySelector(".booking-details__dates .date-range__input-field-hidden--start");
  const $hiddenDateFieldEnd = document.querySelector(".booking-details__dates .date-range__input-field-hidden--end");

  const start = $hiddenDateFieldStart.value ? new Date($hiddenDateFieldStart.value) : new Date();
  const end = $hiddenDateFieldEnd.value ? new Date($hiddenDateFieldEnd.value) : new Date();

  const diffMs = end - start;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (price !== 0) {
    const formattedPrice = price.toLocaleString("en-US");
    const total = price * diffDays;
    const formattedTotal = total.toLocaleString("en-US");
    $detailPrice.innerText = `€${formattedPrice} x ${diffDays} nights`;
    $detailTotal.innerText = `€${formattedTotal}`;
  }
}

function updateTripDetails($bookingInfo) {
  const $detailDate = $bookingInfo.querySelector(".booking-info__detail--date");
  const $detailDateText = $bookingInfo.querySelector(".booking-info__detail-text--date");

  const $hiddenDateFieldStart = document.querySelector(".booking-details__dates .date-range__input-field-hidden--start");
  const $hiddenDateFieldEnd = document.querySelector(".booking-details__dates .date-range__input-field-hidden--end");

  if ($hiddenDateFieldStart && $hiddenDateFieldEnd) {
    $detailDate.classList.add("booking-info__detail--active");
    const formattedDate = formatDateRange($hiddenDateFieldStart.value, $hiddenDateFieldEnd.value);
    $detailDateText.innerText = formattedDate;
  } else {
    $detailDate.classList.remove("booking-info__detail--active");
  }

  const $detailGuests = $bookingInfo.querySelector(".booking-info__detail--guests");
  const $detailGuestsText = $bookingInfo.querySelector(".booking-info__detail-text--guests");

  const $inputGuests = document.querySelector(".booking-details__input-guests");
  const $inputGuestsCountersFields = $inputGuests.querySelectorAll(".counter__input");
  const guestsTotal = [...$inputGuestsCountersFields].reduce((sum, input) => {
    const $item = input.closest(".guests-menu__item");
    if ($item.dataset.label !== "pets") {
      return sum + Number.parseInt(input.value) || 0;
    } else {
      return sum;
    }
  }, 0);

  if (guestsTotal !== 0) {
    $detailGuestsText.innerText = `Guests ${guestsTotal}`;
    $detailGuests.classList.add("booking-info__detail--active");
  } else {
    $detailGuests.classList.remove("booking-info__detail--active");
  }

  const $detailPets = $bookingInfo.querySelector(".booking-info__detail--pets");
  const $detailPetsText = $bookingInfo.querySelector(".booking-info__detail-text--pets");
  const petsTotal = +$inputGuests.querySelector('.guests-menu__item[data-label="pets"] .counter__input').value;

  if (petsTotal !== 0) {
    $detailPetsText.innerText = `Pets ${petsTotal}`;
    $detailPets.classList.add("booking-info__detail--active");
  } else {
    $detailPets.classList.remove("booking-info__detail--active");
  }
}

function formatDateRange(startStr, endStr) {
  if (!startStr || !endStr) {
    return "";
  }

  const start = new Date(startStr);
  const end = new Date(endStr);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  let result = "";

  if (sameYear) {
    if (sameMonth) {
      result = `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
    } else {
      result = `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
    }
  } else {
    result = `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
  }

  return result;
}

/* Guests max functions */
function getGuestsTotal($counters) {
  return [...$counters].reduce((sum, $counter) => {
    const input = $counter.querySelector(".counter__input");
    return sum + (parseInt(input.value, 10) || 0);
  }, 0);
}

function updateCountersState(guestsMax, $counters) {
  if (!guestsMax) return;

  const total = getGuestsTotal($counters);

  $counters.forEach(($counter) => {
    const plus = $counter.querySelector(".counter__plus");
    if (total >= guestsMax) {
      plus.setAttribute("disabled", "");
      plus.classList.add("counter__plus--disabled");
    } else {
      plus.removeAttribute("disabled");
      plus.classList.remove("counter__plus--disabled");
    }
  });
}

/* If exceeded guestsMax, resets all counters to 0 and updates URL parameters. */
function enforceGuestsLimit(guestsMax, $counters) {
  if (!guestsMax) return;

  const total = getGuestsTotal($counters);

  if (total > guestsMax) {
    $counters.forEach(($counter) => {
      if (typeof $counter.setValue === "function") {
        $counter.setValue(0);
      } else {
        const input = $counter.querySelector(".counter__input");
        input.value = 0;
      }
    });

    updateParamsInputs();
  }
}
