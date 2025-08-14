initTabs();

export function initTabs(container = document) {
  const $tabsBtnsBoxes = container.querySelectorAll(".tabs-btns");

  $tabsBtnsBoxes.forEach(($tabsBtnsBox) => {
    const $btns = $tabsBtnsBox.querySelectorAll(".tabs-btns__btn");

    $btns.forEach(($btn, index) => {
      $btn.addEventListener("click", () => {
        changeTab($tabsBtnsBox.dataset.tabsName, index);
      });
    });
  });
}

function changeTab(name, index) {
  const $oldActiveBtn = document.querySelector(`.tabs-btns[data-tabs-name="${name}"] > .tabs-btns__btn--active`);
  const $oldActiveTab = document.querySelector(`.tabs-list[data-tabs-name="${name}"] > .tabs-list__item--active`);
  const $newActiveBtn = document.querySelectorAll(`.tabs-btns[data-tabs-name="${name}"] > .tabs-btns__btn`)[index];
  const $newActiveTab = document.querySelectorAll(`.tabs-list[data-tabs-name="${name}"] > .tabs-list__item`)[index];

  $oldActiveTab.classList.remove("tabs-list__item--active");
  $oldActiveBtn.classList.remove("tabs-btns__btn--active");

  $newActiveBtn.classList.add("tabs-btns__btn--active");
  $newActiveTab.classList.add("tabs-list__item--active");
}

export default {
  initTabs,
}
