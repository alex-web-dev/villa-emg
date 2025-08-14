document.addEventListener('click', e => {
  const $playBtn = e.target.closest('.video__play');
  if (!$playBtn) return;

  const $player = $playBtn.closest('.video');
  if ($player.classList.contains('video--active')) return;

  const videoUrl = $player.dataset.src;
  const $video = document.createElement('video');
  $video.classList.add('video__player');
  $video.setAttribute('src', videoUrl);
  $video.setAttribute('controls', '');
  $video.setAttribute('playsinline', '');
  $video.setAttribute('muted', '');

  $player.prepend($video);
  $player.classList.add('video--active');
  $video.play().catch(() => {});
});