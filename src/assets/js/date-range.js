import flatpickr from "flatpickr";

let currentShowMonths = getMonthsToShow();

const pickersMap = new WeakMap();

document.querySelectorAll(".date-range").forEach(($input) => {
  if (!$input.classList.contains("date-range--popup")) {
    initPicker($input);

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newShowMonths = getMonthsToShow();
        if (newShowMonths !== currentShowMonths) {
          currentShowMonths = newShowMonths;
          recreatePicker($input);
        }
      }, 500);
    });
  } else {
    const $datePopup = $input.querySelector(".date-range__popup");
    const $calendar = $input.querySelector(".date-range__calendar");
    const $fieldStart = $input.querySelector(".date-range__input-field--start");
    const $fieldEnd = $input.querySelector(".date-range__input-field--end");
    const $popupBtn = $datePopup.querySelector(".date-range__popup-btn");
    const $hiddenStart = $input.querySelector(".date-range__input-field-hidden--start");
    const $hiddenEnd = $input.querySelector(".date-range__input-field-hidden--end");
    const $inputMain = $input.querySelector(".date-range__main");

    $inputMain.addEventListener("click", () => {
      $datePopup.classList.add("date-range__popup--active");
    });

    const $inputLabel = $input.querySelector(".date-range__label");
    $inputLabel.addEventListener("click", () => {
      $datePopup.classList.add("date-range__popup--active");
    });

    const $popupBack = $datePopup.querySelector(".date-range__popup-back");
    $popupBack.addEventListener("click", () => {
      $datePopup.classList.remove("date-range__popup--active");
    });

    const calendarPicker = flatpickr($calendar, {
      inline: true,
      mode: "range",
      minDate: "today",
      dateFormat: "d.m.Y",
      static: true,
      locale: {
        firstDayOfWeek: 1,
        rangeSeparator: " - ",
      },
      showMonths: 12,
      onChange(selectedDates, dateStr, instance) {
        handler(instance);

        if (selectedDates[0] && selectedDates[1]) {
          $popupBtn.removeAttribute("disabled");
        } else {
          $popupBtn.setAttribute("disabled", "");
        }
      },
      onOpen(selectedDates, dateStr, instance) {
        if ($fieldStart.value && $fieldEnd.value) return;
        const parsedDates = [flatpickr.parseDate($hiddenStart.value, "Y-m-d"), flatpickr.parseDate($hiddenEnd.value, "Y-m-d")];
        instance.setDate(parsedDates, false);
      },
      onReady(selectedDates, dateStr, instance) {
        setTimeout(() => handler(instance));
        if ($hiddenStart.value) {
          $fieldStart.value = flatpickr.formatDate(flatpickr.parseDate($hiddenStart.value, "Y-m-d"), "D d/m");
        }
        if ($hiddenEnd.value) {
          $fieldEnd.value = flatpickr.formatDate(flatpickr.parseDate($hiddenEnd.value, "Y-m-d"), "D d/m");
        }

        if ($fieldStart.value || $fieldEnd.value) {
          const parsedDates = [flatpickr.parseDate($hiddenStart.value, "Y-m-d"), flatpickr.parseDate($hiddenEnd.value, "Y-m-d")];
          instance.setDate(parsedDates, false);
          instance.changeMonth(new Date().getMonth(), false);
          instance.changeYear(new Date().getFullYear());
        }

        if (!$input.dataset.clearButtonsInit) {
          setupClearButtons($input);
          $input.dataset.clearButtonsInit = "true";
        }

        if ($input.classList.contains("date-range--border")) {
          instance.calendarContainer.classList.add("flatpickr--border");
        }

        if ($hiddenStart.value && $hiddenEnd.value) {
          $popupBtn.removeAttribute("disabled");
        }
      },
    });
    $input._flatpickr = calendarPicker;

    const clearStart = $input.querySelector(".date-range__input-clear--start");
    const clearEnd = $input.querySelector(".date-range__input-clear--end");

    clearStart.addEventListener("click", () => {
      rewritePopupDatepicker(calendarPicker);
      $popupBtn.setAttribute("disabled", "");
    });
    clearEnd.addEventListener("click", () => {
      rewritePopupDatepicker(calendarPicker);
      $popupBtn.setAttribute("disabled", "");
    });

    $popupBtn.addEventListener("click", () => {
      if (calendarPicker.selectedDates.length === 0) {
        return;
      }

      if (calendarPicker.selectedDates.length === 2) {
        $fieldStart.value = flatpickr.formatDate(calendarPicker.selectedDates[0], "D d/m");
        $fieldEnd.value = flatpickr.formatDate(calendarPicker.selectedDates[1], "D d/m");
        $fieldStart.dispatchEvent(new Event("input", { bubbles: true }));
        $fieldEnd.dispatchEvent(new Event("input", { bubbles: true }));

        $hiddenStart.value = flatpickr.formatDate(calendarPicker.selectedDates[0], "Y-m-d");
        $hiddenEnd.value = flatpickr.formatDate(calendarPicker.selectedDates[1], "Y-m-d");
        $hiddenStart.dispatchEvent(new Event("input", { bubbles: true }));
        $hiddenEnd.dispatchEvent(new Event("input", { bubbles: true }));
      }

      updateFieldState($fieldStart);
      updateFieldState($fieldEnd);

      rewritePopupDatepicker(calendarPicker);

      $datePopup.classList.remove("date-range__popup--active");
    });
  }
});

function rewritePopupDatepicker(instance) {
  instance.changeMonth(new Date().getMonth(), false);
  instance.changeYear(new Date().getFullYear());
  handler(instance);
}

function handler(instance) {
  const dayContainers = instance.calendarContainer.querySelectorAll(".dayContainer");
  const months = instance.calendarContainer.querySelectorAll(".flatpickr-months .flatpickr-month");
  const weekdays = instance.calendarContainer.querySelectorAll(".flatpickr-weekdays .flatpickr-weekdaycontainer");

  dayContainers.forEach((dayContainer, i) => {
    const box = document.createElement("div");
    box.className = "dayContainerBox";
    box.append(months[i].cloneNode(true));
    box.append(weekdays[i].cloneNode(true));

    dayContainer.append(box);
  });
}

function initPicker($input) {
  const $fieldStart = $input.querySelector(".date-range__input-field--start");
  const $fieldEnd = $input.querySelector(".date-range__input-field--end");

  const inline = $input.classList.contains("date-range--inline") ? true : false;

  const $hiddenStart = $input.querySelector(".date-range__input-field-hidden--start");
  const $hiddenEnd = $input.querySelector(".date-range__input-field-hidden--end");

  const fp = flatpickr($input, {
    mode: "range",
    showMonths: getMonthsToShow(),
    minDate: "today",
    inline,
    dateFormat: "d.m.Y",
    locale: {
      firstDayOfWeek: 1,
      rangeSeparator: " - ",
    },
    onChange(selectedDates) {
      if (selectedDates.length === 2) {
        $fieldStart.value = flatpickr.formatDate(selectedDates[0], "D d/m");
        $fieldEnd.value = flatpickr.formatDate(selectedDates[1], "D d/m");

        if ($hiddenStart && $hiddenEnd) {
          $hiddenStart.value = flatpickr.formatDate(selectedDates[0], "Y-m-d");
          $hiddenEnd.value = flatpickr.formatDate(selectedDates[1], "Y-m-d");
        }
      } else if (selectedDates.length === 0) {
        $fieldStart.value = "";
        $fieldEnd.value = "";

        if ($hiddenStart && $hiddenEnd) {
          $hiddenStart.value = "";
          $hiddenEnd.value = "";
        }
      }

      if (selectedDates.length === 2 || selectedDates.length === 0) {
        $fieldStart.dispatchEvent(new Event("input", { bubbles: true }));
        $fieldEnd.dispatchEvent(new Event("input", { bubbles: true }));

        if ($hiddenStart && $hiddenEnd) {
          $hiddenStart.dispatchEvent(new Event("input", { bubbles: true }));
          $hiddenEnd.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }

      updateFieldState($fieldStart);
      updateFieldState($fieldEnd);
    },
    onOpen(selectedDates, dateStr, instance) {
      if ($fieldStart.value && $fieldEnd.value) return;

      let parsedDates = null;
      if ($hiddenStart && $hiddenEnd) {
        parsedDates = [flatpickr.parseDate($hiddenStart.value, "Y-m-d"), flatpickr.parseDate($hiddenEnd.value, "Y-m-d")];
      } else {
        parsedDates = [flatpickr.parseDate($fieldStart.value, "Y-m-d"), flatpickr.parseDate($fieldEnd.value, "Y-m-d")];
      }

      instance.setDate(parsedDates, false);
    },
    onReady(selectedDates, dateStr, instance) {
      if ($hiddenStart && $hiddenStart.value) {
        $fieldStart.value = flatpickr.formatDate(flatpickr.parseDate($hiddenStart.value, "Y-m-d"), "D d/m");
      }
      if ($hiddenStart && $hiddenEnd.value) {
        $fieldEnd.value = flatpickr.formatDate(flatpickr.parseDate($hiddenEnd.value, "Y-m-d"), "D d/m");
      }

      if ($fieldStart.value && $fieldEnd.value) {
        let parsedDates = null;
        if ($hiddenStart && $hiddenEnd) {
          parsedDates = [flatpickr.parseDate($hiddenStart.value, "Y-m-d"), flatpickr.parseDate($hiddenEnd.value, "Y-m-d")];
        } else {
          parsedDates = [flatpickr.parseDate($fieldStart.value, "Y-m-d"), flatpickr.parseDate($fieldEnd.value, "Y-m-d")];
        }

        instance.setDate(parsedDates, false);
      }

      if (!$input.dataset.clearButtonsInit) {
        setupClearButtons($input);
        $input.dataset.clearButtonsInit = "true";
      }

      if ($input.classList.contains("date-range--border")) {
        instance.calendarContainer.classList.add("flatpickr--border");
      }

      if (selectedDates.length === 2) {
        $fieldStart.value = flatpickr.formatDate(selectedDates[0], "D d/m");
        $fieldEnd.value = flatpickr.formatDate(selectedDates[1], "D d/m");

        $hiddenStart.value = flatpickr.formatDate(selectedDates[0], "Y-m-d");
        $hiddenEnd.value = flatpickr.formatDate(selectedDates[1], "Y-m-d");
      }
    },
  });

  pickersMap.set($input, fp);
}

function recreatePicker($input) {
  const oldFp = pickersMap.get($input);
  if (oldFp) {
    oldFp.destroy();
    pickersMap.delete($input);
  }
  initPicker($input);
}

function getMonthsToShow() {
  return window.innerWidth >= 768 ? 2 : 1;
}

function setupClearButtons($input) {
  const $fieldStart = $input.querySelector(".date-range__input-field--start");
  const $fieldEnd = $input.querySelector(".date-range__input-field--end");
  const clearStart = $input.querySelector(".date-range__input-clear--start");
  const clearEnd = $input.querySelector(".date-range__input-clear--end");
  const $hiddenStart = $input.querySelector(".date-range__input-field-hidden--start");
  const $hiddenEnd = $input.querySelector(".date-range__input-field-hidden--end");

  updateFieldState($fieldStart);
  updateFieldState($fieldEnd);

  $fieldStart.addEventListener("input", () => updateFieldState($fieldStart));
  $fieldEnd.addEventListener("input", () => updateFieldState($fieldEnd));

  if (clearStart) {
    clearStart.addEventListener("click", (e) => {
      e.stopPropagation();
      $fieldStart.value = "";
      $fieldStart.dispatchEvent(new Event("input", { bubbles: true }));
      $hiddenStart.value = "";
      $hiddenStart.dispatchEvent(new Event("input", { bubbles: true }));
      if ($input._flatpickr) $input._flatpickr.setDate(getFieldsParsedDates($fieldStart, $fieldEnd, $input._flatpickr), false, "d.m.Y");
      updateFieldState($fieldStart);
    });
  }

  if (clearEnd) {
    clearEnd.addEventListener("click", (e) => {
      e.stopPropagation();
      $fieldEnd.value = "";
      $fieldEnd.dispatchEvent(new Event("input", { bubbles: true }));
      $hiddenEnd.value = "";
      $hiddenEnd.dispatchEvent(new Event("input", { bubbles: true }));
      if ($input._flatpickr) $input._flatpickr.setDate(getFieldsParsedDates($fieldStart, $fieldEnd, $input._flatpickr), false, "d.m.Y");
      updateFieldState($fieldEnd);
    });
  }
}

function tryParse(val, picker) {
  if (!val) return null;
  let d = picker.parseDate(val.trim(), "D d/m");
  if (!d) {
    const stripped = val.replace(/^[^\s]+\s+/, "");
    d = picker.parseDate(stripped.trim(), "d/m");
  }
  return d;
}

function getFieldsParsedDates($fieldStart, $fieldEnd, picker) {
  const hasStart = $fieldStart?.value.trim();
  const hasEnd = $fieldEnd?.value.trim();

  const parsedDates = [];
  const dateStart = tryParse($fieldStart.value, picker);
  const dateEnd = tryParse($fieldEnd.value, picker);

  if (hasStart && dateStart) parsedDates.push(dateStart);
  if (hasEnd && dateEnd) parsedDates.push(dateEnd);

  return parsedDates;
}

function updateFieldState($field) {
  if ($field.value.trim()) {
    $field.classList.add("date-range__input-field--fill");
  } else {
    $field.classList.remove("date-range__input-field--fill");
  }
}
