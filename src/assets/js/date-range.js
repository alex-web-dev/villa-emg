import flatpickr from "flatpickr";

let currentShowMonths = getMonthsToShow();

const pickersMap = new WeakMap();

document.querySelectorAll(".date-range").forEach(($input) => {
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
});

function initPicker($input) {
  const $fieldStart = $input.querySelector(".date-range__input-field--start");
  const $fieldEnd = $input.querySelector(".date-range__input-field--end");

  const fp = flatpickr($input, {
    mode: "range",
    showMonths: getMonthsToShow(),
    minDate: "today",
    dateFormat: "d.m.Y",
    locale: {
      firstDayOfWeek: 1,
      rangeSeparator: " - ",
    },
    onChange(selectedDates) {
      if (selectedDates.length === 2) {
        $fieldStart.value = flatpickr.formatDate(selectedDates[0], "D d/m");
        $fieldEnd.value = flatpickr.formatDate(selectedDates[1], "D d/m");
      }

      updateFieldState($fieldStart);
      updateFieldState($fieldEnd);
    },
    onOpen(selectedDates, dateStr, instance) {
      if ($fieldStart.value && $fieldEnd.value) return;
      const parsedDates = getFieldsParsedDates($fieldStart, $fieldEnd, instance);
      instance.setDate(parsedDates, false);
    },
    onReady(selectedDates, dateStr, instance) {
      if ($fieldStart.value && $fieldEnd.value) {
        const parsedDates = getFieldsParsedDates($fieldStart, $fieldEnd, instance);
        instance.setDate(parsedDates, false);
      }

      if (!$input.dataset.clearButtonsInit) {
        setupClearButtons($input);
        $input.dataset.clearButtonsInit = "true";
      }

      if ($input.classList.contains("date-range--border")) {
        instance.calendarContainer.classList.add("flatpickr--border");
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

  updateFieldState($fieldStart);
  updateFieldState($fieldEnd);

  $fieldStart.addEventListener("input", () => updateFieldState($fieldStart));
  $fieldEnd.addEventListener("input", () => updateFieldState($fieldEnd));

  if (clearStart) {
    clearStart.addEventListener("click", (e) => {
      e.stopPropagation();
      $fieldStart.value = "";
      const fp = pickersMap.get($input);
      if (fp) fp.setDate(getFieldsParsedDates($fieldStart, $fieldEnd, fp), false);
      updateFieldState($fieldStart);
    });
  }

  if (clearEnd) {
    clearEnd.addEventListener("click", (e) => {
      e.stopPropagation();
      $fieldEnd.value = "";
      const fp = pickersMap.get($input);
      if (fp) fp.setDate(getFieldsParsedDates($fieldStart, $fieldEnd, fp), false);
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
