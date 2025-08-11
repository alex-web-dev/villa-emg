const $players = document.querySelectorAll('.video');
$players.forEach($player => {
  const $playBtn = $player.querySelector('.video__play');
  $playBtn.addEventListener('click', () => {
    if ($player.classList.contains('video--active')) {
      return;
    }

    const videoUrl = $player.dataset.src;
    const $video = document.createElement('video');
    $video.classList.add('video__player');
    $video.setAttribute('src', videoUrl);
    $video.setAttribute('controls', '');

    $player.prepend($video);
    $player.classList.add('video--active');
    $video.play();
  });
});