let currentPage = 0;

const pages = document.querySelectorAll(".flip-page");

function flipPage() {
    if (currentPage < pages.length) {
        pages[currentPage].classList.add("flipped");
        currentPage++;
    }
}

// SCENE 1 + 2 LOGIC
(function () {
  const audio         = document.getElementById('mainAudio');
  const scene0        = document.getElementById('scene0');
  const scene1        = document.getElementById('scene1');
  const scene2        = document.getElementById('scene2');
  const hand          = document.getElementById('hand');
  const startBtn      = document.getElementById('startBtn');
  const bookWrap      = document.querySelector('.book-container');
  const audioControls = document.getElementById('audioControls');

  // scene0 start button → show scene1 + play audio + show controls
  startBtn.addEventListener('click', () => {
    scene0.classList.add('fade-out');
    setTimeout(() => {
      scene0.classList.add('hidden');
      scene1.classList.remove('hidden');
      audioControls.classList.remove('hidden');
      audio.play();
    }, 600);
  });

  const HAND_TIME = 34;
  const TADA_TIME = 39;

  audio.addEventListener('timeupdate', () => {
    const t = audio.currentTime;

    // show hand on top of bag
    if (t >= HAND_TIME && !hand.classList.contains('visible')) {
      hand.classList.add('visible');
    }

    // swap scene 1 → scene 2
    if (t >= TADA_TIME && !scene1.classList.contains('fade-out')) {
      scene1.classList.add('fade-out');
      // bring scene2 above fading scene1
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

  // play/pause button
  const playPauseBtn = document.getElementById('playPauseBtn');
  const iconPlay     = document.getElementById('iconPlay');
  const iconPause    = document.getElementById('iconPause');
  const audioSlider  = document.getElementById('audioSlider');

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
  });

  audio.addEventListener('pause', () => {
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
  });

  // sync slider to audio
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      audioSlider.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  // scrub audio from slider
  audioSlider.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (audioSlider.value / 100) * audio.duration;
    }
  });

    // click scene2 cover → reveal book
    scene2.addEventListener('click', () => {
        scene2.classList.add('fade-out');
        audioControls.classList.add('hidden');
        setTimeout(() => {
            scene2.classList.add('hidden');
            bookWrap.classList.remove('book-hidden');
        }, 600);
    });

    // when audio ends → go to book (scene 5)
    audio.addEventListener('ended', () => {
        scene2.classList.add('fade-out');
        audioControls.classList.add('hidden');
        setTimeout(() => {
            scene2.classList.add('hidden');
            bookWrap.classList.remove('book-hidden');
        }, 600);
    });
})();