let currentPage = 0;
const pages = document.querySelectorAll(".flip-page");

function flipPage() {
    if (currentPage < pages.length) {
        pages[currentPage].classList.add("flipped");
        currentPage++;
    }
}

(function () {
  const audio         = document.getElementById('mainAudio');
  const scene0        = document.getElementById('scene0');
  const scene1        = document.getElementById('scene1');
  const scene2        = document.getElementById('scene2');
  const hand          = document.getElementById('hand');
  const startBtn      = document.getElementById('startBtn');
  const bookWrap      = document.querySelector('.book-container');
  const audioControls = document.getElementById('audioControls');
  const openBookBtn   = document.getElementById('openBookBtn');

  const HAND_TIME = 34;
  const TADA_TIME = 39;

  function revealBook() {
    scene2.classList.add('fade-out');
    audioControls.classList.add('hidden');
    setTimeout(() => {
      scene2.classList.add('hidden');
      bookWrap.style.display = 'block';
    }, 600);
  }

  // scene0 → scene1
  startBtn.addEventListener('click', () => {
    scene0.classList.add('fade-out');
    setTimeout(() => {
      scene0.classList.add('hidden');
      scene1.classList.remove('hidden');
      audioControls.classList.remove('hidden');
      audio.play();
    }, 600);
  });

  // timeupdate: hand + scene1→scene2 transition
  audio.addEventListener('timeupdate', () => {
    const t = audio.currentTime;

    if (t >= HAND_TIME && !hand.classList.contains('visible')) {
      hand.classList.add('visible');
    }

    if (t >= TADA_TIME && !scene1.classList.contains('fade-out')) {
      scene1.classList.add('fade-out');
      scene2.style.zIndex = 101;
      setTimeout(() => scene1.classList.add('hidden'), 600);
      scene2.classList.remove('hidden');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById('scn2img').classList.add('expanded');
        });
      });
    }
  });

  // play/pause
  const playPauseBtn = document.getElementById('playPauseBtn');
  const iconPlay     = document.getElementById('iconPlay');
  const iconPause    = document.getElementById('iconPause');
  const audioSlider  = document.getElementById('audioSlider');

  playPauseBtn.addEventListener('click', () => {
    audio.paused ? audio.play() : audio.pause();
  });

  audio.addEventListener('play',  () => { iconPlay.classList.add('hidden');    iconPause.classList.remove('hidden'); });
  audio.addEventListener('pause', () => { iconPlay.classList.remove('hidden'); iconPause.classList.add('hidden');    });

  // slider sync
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) audioSlider.value = (audio.currentTime / audio.duration) * 100;
  });

  audioSlider.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = (audioSlider.value / 100) * audio.duration;
  });

  // scene2 button → book
  openBookBtn.addEventListener('click', revealBook);

  // audio ends → reveal book automatically if user hasn't clicked yet
  audio.addEventListener('ended', () => {
    if (!scene2.classList.contains('hidden')) revealBook();
  });
})();