import { clearForm } from "./form.js";
import L from "leaflet";
import { moveElement } from "./utils.js";

const $map = document.querySelector(".map");
if ($map) {
  /* Map sidebar drag */
  const $sidebarBox = document.querySelector(".map__sidebar-box");
  const $sidebarExpand = document.querySelector(".map__sidebar-expand");
  const $pageHeader = document.querySelector(".header");
  const $mapHeader = document.querySelector(".map__header");

  let currentStateIndex = 0;

  let startY = 0;
  let startHeight = 0;
  let isDragging = false;
  let lastMoveTime = 0;
  let lastMoveY = 0;
  let velocity = 0;

  window.addEventListener("locationPlace:open", () => {
    $sidebarBox.style.height = "0px";
  });

  window.addEventListener("locationPlace:close", () => {
    $sidebarBox.style.height = getStates()[0] + "px";
  });

  $sidebarExpand.addEventListener("mousedown", startDrag);
  $sidebarExpand.addEventListener("touchstart", startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    startHeight = $sidebarBox.offsetHeight;
    velocity = 0;
    lastMoveTime = Date.now();
    lastMoveY = startY;

    $sidebarBox.style.transition = "none";

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }

  function onDrag(e) {
    if (!isDragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = startY - currentY;
    const newHeight = Math.max(100, startHeight + delta);
    $sidebarBox.style.height = newHeight + "px";

    const now = Date.now();
    const dt = now - lastMoveTime;
    if (dt > 0) {
      velocity = (lastMoveY - currentY) / dt;
      lastMoveTime = now;
      lastMoveY = currentY;
    }
  }

  function endDrag() {
    isDragging = false;
    $sidebarBox.style.transition = "height 0.25s ease";

    let finalHeight = $sidebarBox.offsetHeight;

    const projectedHeight = finalHeight + velocity * 200;
    let closestIndex = 0;
    let closestDiff = Infinity;
    getStates().forEach((h, i) => {
      const diff = Math.abs(h - projectedHeight);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    });

    currentStateIndex = closestIndex;
    $sidebarBox.style.height = getStates()[currentStateIndex] + "px";

    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);
  }

  function getStates() {
    return [100, 400, window.innerHeight - $mapHeader.offsetHeight - $pageHeader.offsetHeight];
  }

  function setSidebarHeight(targetHeight) {
    currentStateIndex = getStates().findIndex((h) => h === targetHeight);

    $sidebarBox.style.transition = "height 0.25s ease";
    $sidebarBox.style.height = targetHeight + "px";
  }

  /* Sidebar close & popup clear buttons */
  const $mapForm = document.querySelector(".map-form");
  const $popupFilters = document.querySelector(".filters");
  const $popupFiltersMain = $popupFilters.querySelector(".filters__main");
  const $sidebarClose = document.querySelector(".map__sidebar-close");
  const $popupClear = $popupFilters.querySelector(".filters__btn--clear");

  $popupClear.addEventListener("click", () => {
    clearForm($popupFiltersMain);
    clearForm($mapForm);
    $sidebarClose.classList.remove("map__sidebar-close--active");
  });

  $sidebarClose.addEventListener("click", () => {
    clearForm($popupFiltersMain);
    clearForm($mapForm);
    setSidebarHeight(window.innerHeight - $mapHeader.offsetHeight - $pageHeader.offsetHeight);
    $sidebarClose.classList.remove("map__sidebar-close--active");
  });

  $mapForm.addEventListener("change", () => {
    $sidebarClose.classList.add("map__sidebar-close--active");
  });

  $popupFilters.addEventListener("change", () => {
    $sidebarClose.classList.add("map__sidebar-close--active");
  });

  /* Move form fields (stay dates, guests number, region) */
  moveFields();
  window.addEventListener("resize", moveFields);

  function moveFields() {
    moveElement({
      element: ".map-form__fields",
      from: ".map-form__fields-box",
      to: ".filters__fields",
      width: 991,
    });
  }

  /* Map */
  const $mapFrame = document.querySelector(".map__frame");
  const map = L.map($mapFrame).setView([52.505, 8.09], 7);

  // Map base
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Icons
  const defaultIcon = L.icon({
    iconUrl: "/assets/img/icons/map-pin-circle.svg",
    iconSize: [28, 28],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const activeIcon = L.icon({
    iconUrl: "/assets/img/icons/map-pin.svg",
    iconSize: [37, 44],
    iconAnchor: [22, 40],
    popupAnchor: [0, -32],
  });

  let markers = [];
  let markersMap = {};

  // ----------------------------
  // Handlers for list items
  // ----------------------------
  function attachItemEvents() {
    document.querySelectorAll(".map__item").forEach(($el) => {
      $el.addEventListener("mouseenter", () => {
        const id = $el.dataset.id;
        const marker = markersMap[id];
        if (marker) {
          markers.forEach((m) => m.setIcon(defaultIcon));
          marker.setIcon(activeIcon);
        }
      });

      $el.addEventListener("mouseleave", () => {
        const id = $el.dataset.id;
        const marker = markersMap[id];
        if (marker) {
          marker.setIcon(defaultIcon);
        }
      });
    });
  }

  // ----------------------------
  // Update visible items in the list
  // ----------------------------
  let updateTimeout;

  function updateVisibleItems() {
    const bounds = map.getBounds();
    let visibleCount = 0;

    document.querySelectorAll(".map__item").forEach(($el) => {
      const lat = parseFloat($el.dataset.lat);
      const lng = parseFloat($el.dataset.lng);

      if (bounds.contains([lat, lng])) {
        $el.classList.remove("map__item--hidden");
        visibleCount++;
      } else {
        $el.classList.add("map__item--hidden");
      }
    });

    const $count = document.querySelector(".map__sidebar-count");
    if ($count) {
      $count.textContent = `${visibleCount} results`;
    }

    const $notFound = document.querySelector(".map__not-found");
    if ($notFound) {
      if (visibleCount === 0) {
        $notFound.classList.add("map__not-found--active");
        $notFound.textContent = "No exact matches found.";
      } else {
        $notFound.classList.remove("map__not-found--active");
      }
    }
  }

  function scheduleUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(updateVisibleItems, 400);
  }

  map.on("moveend", scheduleUpdate);
  map.on("zoomend", scheduleUpdate);
  map.on("resize", scheduleUpdate);

  // ----------------------------
  // Recreate markers
  // ----------------------------
  let redrawTimeout;

  function redrawMarkers() {
    map.closePopup();
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
    markersMap = {};

    document.querySelectorAll(".map__item").forEach(($el) => {
      const item = {
        id: $el.dataset.id,
        location: $el.dataset.location,
        lat: $el.dataset.lat,
        lng: $el.dataset.lng,
        title: $el.dataset.title,
        price: $el.dataset.price,
        url: $el.dataset.url,
        image_url: $el.dataset.imageUrl,
      };

      const popupHtml = `
      <a class="location-card" href="${item.url}"> 
        <div class="location-card__img-box">
          <img class="location-card__img" src="${item.image_url}" alt="${item.title}" />
        </div>
        <div class="location-card__main">
          <div class="location-card__header">
            <div class="text text--sm text--iflex location-card__name">
              <img class="text__icon text__icon--mx-xs" src="assets/img/icons/location.svg" alt="" />
              <span>${item.location}</span>
            </div>
            <button class="location-card__close">
              <img src="assets/img/icons/exit.svg" alt="" />
            </button>
          </div>
          <div class="text text--3xl text--forum location-card__title">${item.title}</div>
          <div class="location-card__prices">
            <div class="text text--lh-13 text--bold location-card__price">from €${item.price} per night</div>
            <div class="text text--lh-13 text--primary location-card__price">7 days: from €${item.price * 7}</div>
          </div>
        </div>
      </a>
    `;

      const marker = L.marker([item.lat, item.lng], { icon: defaultIcon }).addTo(map).bindPopup(popupHtml, { maxWidth: 527 });

      marker.on("click", () => {
        markers.forEach((m) => m.setIcon(defaultIcon));
        marker.setIcon(activeIcon);
      });

      marker.on("popupclose", () => {
        marker.setIcon(defaultIcon);
      });

      marker.on("popupopen", (e) => {
        const popupEl = e.popup.getElement();
        const $closeBtn = popupEl.querySelector(".location-card__close");
        if ($closeBtn) {
          $closeBtn.addEventListener("click", (ev) => {
            ev.preventDefault();
            map.closePopup();
            marker.setIcon(defaultIcon);
          });
        }
      });

      markers.push(marker);
      markersMap[item.id] = marker;
    });

    attachItemEvents();
    updateVisibleItems();
  }

  function scheduleRedraw() {
    clearTimeout(redrawTimeout);
    const $notFound = document.querySelector(".map__not-found");
    $notFound?.classList.add("map__not-found--hidden");
    redrawTimeout = setTimeout(redrawMarkers, 400);
  }

  // ----------------------------
  // Observer for changes in .map__item list
  // ----------------------------
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        (mutation.type === "attributes" && mutation.target.classList.contains("map__item") && mutation.attributeName.startsWith("data-")) ||
        mutation.type === "childList"
      ) {
        const $notFound = document.querySelector(".map__not-found");
        $notFound?.classList.remove("map__not-found--active");
        
        scheduleRedraw();
        break;
      }
    }
  });

  const $mapList = document.querySelector(".map__list");
  if ($mapList) {
    observer.observe($mapList, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  // ----------------------------
  // Initial run
  // ----------------------------
  setTimeout(() => {
    redrawMarkers();
  }, 300);
}
