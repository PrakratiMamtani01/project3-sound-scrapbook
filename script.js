window.addEventListener("load", () => {
    const mainAudio    = document.getElementById('mainAudio');
    const shuffleAudio = document.getElementById('shuffleAudio');
    const scene2Audio  = document.getElementById('scene2Audio');
    const scene0       = document.getElementById('scene0');
    const scene1       = document.getElementById('scene1');
    const scene2       = document.getElementById('scene2');
    const hand         = document.getElementById('hand');
    const bag          = document.getElementById('bag');
    const bagGlow      = document.getElementById('bagGlow');
    const startBtn     = document.getElementById('startBtn');
    const openBookBtn  = document.getElementById('openBookBtn');
    const book         = document.getElementById('book');
    const HAND_TIME    = 30;

    let mainAudioEnded = false;

    function revealBook() {
        scene2Audio.pause();
        scene2Audio.currentTime = 0;
        scene2.classList.add('fade-out');
        audioControls.classList.add('hidden');
        setTimeout(() => {
            scene2.classList.add('hidden');
            book.classList.remove('book-hidden');
            audioControls.classList.remove('hidden');
            playSceneAudio(0);
        }, 600);
    }

    startBtn.addEventListener('click', () => {
        scene0.classList.add('fade-out');
        setTimeout(() => {
            scene0.classList.add('hidden');
            scene1.classList.remove('hidden');
            audioControls.classList.remove('hidden');
            currentAudio = mainAudio;
            mainAudio.play();
        }, 600);
    });

    mainAudio.addEventListener('ended', () => {
        mainAudioEnded = true;
        bag.classList.add('shaking');
        bagGlow.classList.add('active');
        shuffleAudio.play();
    });

    // bidirectional hand + bag sync
    mainAudio.addEventListener('timeupdate', () => {
        const t = mainAudio.currentTime;

        if (t >= HAND_TIME) {
            hand.classList.add('visible');
        } else {
            hand.classList.remove('visible');
        }

        // if scrubbed back while in ended state, reset bag
        if (mainAudioEnded && !mainAudio.ended) {
            mainAudioEnded = false;
            bag.classList.remove('shaking');
            bagGlow.classList.remove('active');
            shuffleAudio.pause();
            shuffleAudio.currentTime = 0;
        }
    });

    bag.addEventListener('click', () => {
        if (shuffleAudio.paused) return;
        bag.classList.remove('shaking');
        bagGlow.classList.remove('active');
        shuffleAudio.pause();
        shuffleAudio.currentTime = 0;
        scene1.classList.add('fade-out');
        scene2.style.zIndex = 101;
        setTimeout(() => scene1.classList.add('hidden'), 600);
        scene2.classList.remove('hidden');
        currentAudio = scene2Audio;
        scene2Audio.play();
        requestAnimationFrame(() => requestAnimationFrame(() => {
            document.getElementById('scn2img').classList.add('expanded');
        }));
    });

    openBookBtn.addEventListener('click', revealBook);
    scene2Audio.addEventListener('ended', () => {
        if (!scene2.classList.contains('hidden')) revealBook();
    });

    [mainAudio, shuffleAudio, scene2Audio].forEach(a => {
        a.addEventListener('play', () => {
            if (a === currentAudio) {
                iconPlay.classList.add('hidden');
                iconPause.classList.remove('hidden');
            }
        });
        a.addEventListener('pause', () => {
            if (a === currentAudio) {
                iconPlay.classList.remove('hidden');
                iconPause.classList.add('hidden');
            }
        });
        a.addEventListener('timeupdate', () => {
            if (a === currentAudio && a.duration) {
                audioSlider.value = (a.currentTime / a.duration) * 100;
            }
        });
    });

    // expose to global scope for onclick handlers
    window.goToScene2 = function () {
        allAudios.forEach(a => { a.pause(); a.currentTime = 0; });
        book.classList.add('book-hidden');
        pages.forEach(p => { p.classList.remove('flipped'); p.style.zIndex = ''; });
        currentPage = 0;
        updateFlipBtn();
        scene2.classList.remove('hidden');
        scene2.classList.remove('fade-out');
        scene2.style.zIndex = '';
        // keep cover expanded since user has already opened it
        document.getElementById('scn2img').classList.add('expanded');
        currentAudio = scene2Audio;
        scene2Audio.currentTime = 0;
        scene2Audio.play();
    };

    window.goToScene1 = function () {
        scene2Audio.pause();
        scene2Audio.currentTime = 0;
        scene2.classList.add('hidden');
        scene2.classList.remove('fade-out');
        // reset cover so re-clicking bag re-animates it
        document.getElementById('scn2img').classList.remove('expanded');
        scene1.classList.remove('hidden');
        scene1.classList.remove('fade-out');
        // restart scn1 from beginning
        mainAudioEnded = false;
        bag.classList.remove('shaking');
        bagGlow.classList.remove('active');
        shuffleAudio.pause();
        shuffleAudio.currentTime = 0;
        hand.classList.remove('visible');
        mainAudio.currentTime = 0;
        currentAudio = mainAudio;
        mainAudio.play();
    };
});

let currentPage = 0;
const pages = document.querySelectorAll(".flip-page");

const sceneFlowAudios = [
    document.getElementById("scene3Audio"),
    document.getElementById("scene4Audio"),
    document.getElementById("scene5Audio"),
    document.getElementById("scene6Audio"),
    document.getElementById("scene7Audio"),
    document.getElementById("scene8Audio"),
];

const allAudios = [
    ...sceneFlowAudios,
    document.getElementById("checklistAudio"),
    document.getElementById("trainAudio"),
    document.getElementById("dialogueAudio"),
];

let currentAudio = sceneFlowAudios[0];

const flipBtn = document.querySelector(".flip-btn");

function updateFlipBtn() {
    flipBtn.classList.toggle("hidden", currentPage >= pages.length);
}

function flipPage() {
    if (currentPage < pages.length) {
        const page = pages[currentPage];
        page.style.zIndex = 100 + currentPage;
        page.classList.add("flipped");
        currentPage++;
        playSceneAudio(currentPage);
        updateFlipBtn();

        if (currentPage === pages.length) {
            const endScreen = document.getElementById('sceneEnd');
            const endAudio  = document.getElementById('endAudio');
            endScreen.classList.remove('hidden');
            requestAnimationFrame(() => requestAnimationFrame(() => {
                endScreen.classList.add('visible');
            }));
            playSpecificAudio(endAudio);
        }
    }
}

function goBack() {
    const endScreen = document.getElementById('sceneEnd');
    if (!endScreen.classList.contains('hidden')) {
        endScreen.classList.remove('visible');
        setTimeout(() => endScreen.classList.add('hidden'), 1500);
    }

    if (currentPage > 0) {
        currentPage--;
        const page = pages[currentPage];
        page.classList.remove("flipped");
        page.style.zIndex = "";
        playSceneAudio(currentPage);
        updateFlipBtn();
    }
}

function revealMessage(event) {
    const img = event.currentTarget.querySelector("img");
    const trainAudio = document.getElementById("trainAudio");
    if (img.src.includes("train1.jpg")) {
        img.src = "assets/scene5/train2.jpg";
        playSpecificAudio(trainAudio);
    } else {
        img.src = "assets/scene5/train1.jpg";
    }
}

function revealChecklist(event) {
    const img = event.currentTarget.querySelector("img");
    const checklistAudio = document.getElementById("checklistAudio");
    if (img.src.includes("checklist1.jpg")) {
        img.src = "assets/scene4/checklist2.jpg";
        playSpecificAudio(checklistAudio);
    } else {
        img.src = "assets/scene4/checklist1.jpg";
    }
}

function sayDialogue(event) {
    const dialogueAudio = document.getElementById("dialogueAudio");
    playSpecificAudio(dialogueAudio);
}

function playSceneAudio(index) {
    const audio = sceneFlowAudios[index];
    if (!audio) return;
    playSpecificAudio(audio);
}

function playSpecificAudio(audio) {
    allAudios.forEach(a => { a.pause(); a.currentTime = 0; });
    currentAudio = audio;
    currentAudio.play();
}

const playPauseBtn = document.getElementById('playPauseBtn');
const iconPlay     = document.getElementById('iconPlay');
const iconPause    = document.getElementById('iconPause');
const audioSlider  = document.getElementById('audioSlider');
const audioControls = document.getElementById('audioControls');

playPauseBtn.addEventListener('click', () => {
    if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
});

allAudios.forEach(audio => {
    audio.addEventListener('play', () => {
        if (audio === currentAudio) {
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
        }
    });
    audio.addEventListener('pause', () => {
        if (audio === currentAudio) {
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
        }
    });
});

allAudios.forEach(audio => {
    audio.addEventListener('timeupdate', () => {
        if (audio === currentAudio && audio.duration) {
            audioSlider.value = (audio.currentTime / audio.duration) * 100;
        }
    });
});

audioSlider.addEventListener('input', () => {
    if (currentAudio.duration) {
        currentAudio.currentTime = (audioSlider.value / 100) * currentAudio.duration;
    }
});