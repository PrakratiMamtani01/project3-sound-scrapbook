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
  const shuffleAudio  = document.getElementById('shuffleAudio');
  const scene2Audio   = document.getElementById('scene2Audio');
  const scene0        = document.getElementById('scene0');
  const scene1        = document.getElementById('scene1');
  const scene2        = document.getElementById('scene2');
  const hand          = document.getElementById('hand');
  const bag           = document.getElementById('bag');
  const startBtn      = document.getElementById('startBtn');
  const bookWrap      = document.querySelector('.book-container');
  const audioControls = document.getElementById('audioControls');
  const openBookBtn   = document.getElementById('openBookBtn');

  const HAND_TIME = 30;

  function revealBook() {
    scene2Audio.pause();
    scene2Audio.currentTime = 0;
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

  // scn1.mp3 ends → start shaking + play shuffle
  audio.addEventListener('ended', () => {
    bag.classList.add('shaking');
    shuffleAudio.play();
  });

  // hand appears at HAND_TIME during scn1 audio
  audio.addEventListener('timeupdate', () => {
    const t = audio.currentTime;
    if (t >= HAND_TIME && !hand.classList.contains('visible')) {
      hand.classList.add('visible');
    }
  });

  // bag click → stop shuffle, fade scene1, show scene2, play scene2Audio
  bag.addEventListener('click', () => {
    if (!shuffleAudio.paused === false && shuffleAudio.paused) return; // only clickable after shuffle starts
    bag.classList.remove('shaking');
    shuffleAudio.pause();
    shuffleAudio.currentTime = 0;
    scene1.classList.add('fade-out');
    scene2.style.zIndex = 101;
    setTimeout(() => scene1.classList.add('hidden'), 600);
    scene2.classList.remove('hidden');
    scene2Audio.play();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('scn2img').classList.add('expanded');
      });
    });
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

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) audioSlider.value = (audio.currentTime / audio.duration) * 100;
  });

  audioSlider.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = (audioSlider.value / 100) * audio.duration;
  });

  // scene2 button → book
  openBookBtn.addEventListener('click', revealBook);

  // scene2Audio ends → reveal book
  scene2Audio.addEventListener('ended', () => {
    if (!scene2.classList.contains('hidden')) revealBook();
  });
})();