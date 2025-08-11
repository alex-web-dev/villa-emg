const $map = document.querySelector(".map");
if ($map) {
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
    return [100, 432, window.innerHeight - $mapHeader.offsetHeight - $pageHeader.offsetHeight];
  }
}
