import { createElem } from "./utils";
import SimpleBar from "simplebar";

const SELECT_CLASS = "simple-select";
const SELECT_ACTIVE_CLASS = "simple-select--active";

const INPUT_CLASS = "simple-select__input";

const FIELD_CLASS = "simple-select__field";
const FIELD_ACTIVE_CLASS = "simple-select__field--active";
const FIELD_PLACEHOLDER_CLASS = "simple-select__field--placeholder";

const DROPDOWN_CLASS = "simple-select__dropdown";
const DROPDOWN_ACTIVE_CLASS = "simple-select__dropdown--active";

const LIST_CLASS = "simple-select__list";
const LIST_ACTIVE_CLASS = "simple-select__list--active";

const ITEM_CLASS = "simple-select__item";
const ITEM_PLACEHOLDER_CLASS = "simple-select__item--placeholder";
const ITEM_HOVER_CLASS = "simple-select__item--hover";
const ITEM_ACTIVE_CLASS = "simple-select__item--active";

/* Init */
const $selectFields = document.querySelectorAll(".select__field");
$selectFields.forEach(($select) => initSimpleSelect($select));

/* Close when click outside */
window.addEventListener("click", (e) => {
  const $activeSelect = document.querySelector(`.${SELECT_ACTIVE_CLASS}`);
  if (!$activeSelect) {
    return;
  }

  const isInnerSelect = e.target.classList.contains(SELECT_CLASS) || e.target.closest(`.${SELECT_CLASS}`);
  const $dropdown = $activeSelect.querySelector(`.${DROPDOWN_CLASS}`);
  const $field = $activeSelect.querySelector(`.${FIELD_CLASS}`);
  const $selectBox = $activeSelect.closest(".select");

  if (!isInnerSelect) {
    closeSelect($activeSelect, $field, $dropdown, $selectBox);
    return;
  }

  const $select = e.target.closest(`.${SELECT_CLASS}`);
  if (!$select) {
    return;
  }

  const $activeSelects = document.querySelectorAll(`.${SELECT_ACTIVE_CLASS}`);
  $activeSelects.forEach(($activeSelect) => {
    if ($activeSelect !== $select) {
      const $dropdown = $activeSelect.querySelector(`.${DROPDOWN_CLASS}`);
      const $field = $activeSelect.querySelector(`.${FIELD_CLASS}`);

      $dropdown.classList.remove(DROPDOWN_ACTIVE_CLASS);
      $field.classList.remove(FIELD_ACTIVE_CLASS);
      $activeSelect.classList.remove(SELECT_ACTIVE_CLASS);
      $selectBox.classList.remove("select--active");
    }
  });
});

function initSimpleSelect($select) {
  const $selectBox = $select.closest(".select");

  const $dropdown = createElem("div", DROPDOWN_CLASS);
  if ($selectBox.classList.contains("select--border")) {
    $dropdown.classList.add(`${DROPDOWN_CLASS}--border`);
  }
  const $simpleSelectList = createElem("div", LIST_CLASS);

  const $simpleSelect = createElem("div", SELECT_CLASS);
  $select.parentNode.insertBefore($simpleSelect, $select);
  $select.classList.add(INPUT_CLASS);
  $simpleSelect.append($select);
  $simpleSelect.tabIndex = 1;

  /* Field */
  const $simpleSelectField = createElem("div", FIELD_CLASS);
  $simpleSelectField.innerText = $select.options[0].innerText;
  if ($select.options[0].value === "") {
    $simpleSelectField.classList.add(FIELD_PLACEHOLDER_CLASS);
  }
  $simpleSelectField.addEventListener("click", () => {
    toggleSelect($simpleSelect, $simpleSelectField, $dropdown, $selectBox);
  });
  if ($selectBox.classList.contains("select--border")) {
    $simpleSelectField.classList.add(`${FIELD_CLASS}--border`);
  }

  $simpleSelect.append($simpleSelectField);

  /* Items */
  const $options = $select.querySelectorAll("option");
  $options.forEach(($option, index) => {
    const $item = createElem("div", ITEM_CLASS, {
      innerText: $option.innerText,
    });

    if ($option.value === "") {
      $item.classList.add(ITEM_PLACEHOLDER_CLASS);
    }

    $item.dataset.selectIndex = index;
    $item.addEventListener("click", () => {
      $selectBox.classList.remove("select--error");

      $select.selectedIndex = +$item.dataset.selectIndex;

      $simpleSelectField.innerText = $item.innerText;
      $simpleSelectField.classList.remove(FIELD_PLACEHOLDER_CLASS);
      $simpleSelect.blur();
      closeSelect($simpleSelect, $simpleSelectField, $dropdown, $selectBox);

      const $prevActiveItem = $simpleSelectList.querySelector(`.${ITEM_ACTIVE_CLASS}`);
      if ($prevActiveItem) {
        $prevActiveItem.classList.remove(ITEM_ACTIVE_CLASS);
      }
      $item.classList.add(ITEM_ACTIVE_CLASS);
    });

    $item.addEventListener("mouseover", () => {
      const $oldHoverItem = $simpleSelect.querySelector(`.${ITEM_HOVER_CLASS}`);
      if ($oldHoverItem) {
        swapHoverItem($oldHoverItem, $item);
      }
      $item.classList.add(ITEM_HOVER_CLASS);
    });

    $simpleSelectList.append($item);

    if ($option.value && $option.selected) {
      $item.click();
    }
  });

  $dropdown.append($simpleSelectList);
  $simpleSelect.append($dropdown);
  new SimpleBar($simpleSelectList, {
    autoHide: false,
  });

  /* Key controls */
  $simpleSelect.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
      if ($simpleSelectList.classList.contains(LIST_ACTIVE_CLASS)) {
        $selectBox.classList.remove("select--error");

        const $hoverItem = $simpleSelect.querySelector(`.${ITEM_HOVER_CLASS}`);
        $hoverItem.click();
        $simpleSelectField.classList.remove(FIELD_PLACEHOLDER_CLASS);
      } else {
        openList($simpleSelectList);
      }
    } else if (e.code === "Escape") {
      $dropdown.classList.remove(DROPDOWN_ACTIVE_CLASS);
      $simpleSelectField.classList.remove(FIELD_ACTIVE_CLASS);
      $simpleSelect.classList.remove(SELECT_ACTIVE_CLASS);
      $selectBox.classList.remove("select--active");
    } else if (e.code === "ArrowDown") {
      const $oldHoverItem = $simpleSelect.querySelector(`.${ITEM_HOVER_CLASS}`);
      if (!$oldHoverItem) {
        const $newItem = $simpleSelect.querySelectorAll(`.${ITEM_CLASS}:not(.${ITEM_PLACEHOLDER_CLASS})`)[0];
        $newItem.classList.add(ITEM_HOVER_CLASS);
        return;
      }

      const oldIndex = +$oldHoverItem.dataset.selectIndex;
      if (oldIndex >= $simpleSelect.querySelectorAll(`.${ITEM_CLASS}`).length - 1) {
        return;
      }

      const $newItem = $simpleSelect.querySelectorAll(`.${ITEM_CLASS}`)[oldIndex + 1];
      if (!$newItem.classList.contains(ITEM_PLACEHOLDER_CLASS)) {
        swapHoverItem($oldHoverItem, $newItem);
      }
    } else if (e.code === "ArrowUp") {
      const $oldHoverItem = $simpleSelect.querySelector(`.${ITEM_HOVER_CLASS}`);
      if (!$oldHoverItem) {
        const $newItem = $simpleSelect.querySelectorAll(`.${ITEM_CLASS}:not(.${ITEM_PLACEHOLDER_CLASS})`)[0];
        $newItem.classList.add(ITEM_HOVER_CLASS);
        return;
      }

      const oldIndex = +$oldHoverItem.dataset.selectIndex;
      if (oldIndex < 1) {
        return;
      }

      const $newItem = $simpleSelect.querySelectorAll(`.${ITEM_CLASS}`)[oldIndex - 1];
      if (!$newItem.classList.contains(ITEM_PLACEHOLDER_CLASS)) {
        swapHoverItem($oldHoverItem, $newItem);
      }
    }
  });
}

function openList($list) {
  $list.classList.add(LIST_ACTIVE_CLASS);
}

function swapHoverItem($oldItem, $newItem) {
  $oldItem.classList.remove(ITEM_HOVER_CLASS);
  $newItem.classList.add(ITEM_HOVER_CLASS);
}

function closeSelect($simpleSelect, $simpleSelectField, $dropdown, $selectBox) {
  $dropdown.classList.remove(DROPDOWN_ACTIVE_CLASS);
  $simpleSelectField.classList.remove(FIELD_ACTIVE_CLASS);
  $simpleSelect.classList.remove(SELECT_ACTIVE_CLASS);
  $selectBox.classList.remove("select--active");
}

function toggleSelect($simpleSelect, $simpleSelectField, $dropdown, $selectBox) {
  $dropdown.classList.toggle(DROPDOWN_ACTIVE_CLASS);
  $simpleSelectField.classList.toggle(FIELD_ACTIVE_CLASS);
  $simpleSelect.classList.toggle(SELECT_ACTIVE_CLASS);
  $selectBox.classList.toggle("select--active");
}
