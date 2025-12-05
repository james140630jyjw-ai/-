const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const fsBtn = document.getElementById("fullscreen-btn");
const wrapper = document.getElementById("player-wrapper");

// ===============================
// 자막 초기화
// ===============================
let tracks;

function initTracks() {
  tracks = video.textTracks;
  if (tracks.length < 2) return;

  const en = tracks[0];
  const ko = tracks[1];

  en.mode = "hidden";
  ko.mode = "showing";

  return { en, ko };
}

let { en, ko } = initTracks();

// ===============================
// 자막 전환
// ===============================
function showEn() {
  en.mode = "showing";
  ko.mode = "hidden";
}

function showKo() {
  en.mode = "hidden";
  ko.mode = "showing";
}

// ===============================
// 비디오 아래 30% 영역 판별
// ===============================
function isBottomZone(e) {
  const rect = video.getBoundingClientRect();
  const y = e.clientY;
  const x = e.clientX;

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    return false;
  }

  const relativeY = (y - rect.top) / rect.height;
  return relativeY >= 0.70; // 아래 30%
}

// ===============================
// overlay 터치로 자막 전환
// ===============================
let active = false;

overlay.addEventListener("pointerdown", (e) => {
  if (isBottomZone(e)) {
    active = true;
    showEn();
    e.preventDefault();
    e.stopPropagation();
  }
});

overlay.addEventListener("pointerup", (e) => {
  if (active) {
    showKo();
    active = false;
    e.preventDefault();
    e.stopPropagation();
  }
});

overlay.addEventListener("pointerleave", () => {
  if (active) {
    showKo();
    active = false;
  }
});

// ===============================
// 15초 티저 제한
// ===============================
video.addEventListener("timeupdate", () => {
  if (video.currentTime > 15) {
    video.pause();
    video.currentTime = 0;
  }
});

// ===============================
// 가짜 전체화면 토글
// ===============================
let fs = false;

fsBtn.addEventListener("click", () => {
  fs = !fs;

  if (fs) {
    wrapper.classList.add("fullscreen-mode");
    fsBtn.innerText = "⛶ 종료";
  } else {
    wrapper.classList.remove("fullscreen-mode");
    fsBtn.innerText = "⛶ 전체화면";
  }
});
