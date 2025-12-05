const video = document.getElementById("video");
const overlay = document.getElementById("touch-overlay");

// 자막 업로드 요소들
const uploadVideo = document.getElementById("upload-video");
const uploadEn = document.getElementById("upload-en");
const uploadKo = document.getElementById("upload-ko");

// ------------------------------
// 1) 비디오 기본 클릭 막기
// ------------------------------
video.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// ------------------------------
// 2) 업로드 기능
// ------------------------------
if (uploadVideo) {
  uploadVideo.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      video.src = URL.createObjectURL(file);
      video.load();
      video.play();
    }
  });
}

if (uploadEn) {
  uploadEn.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const track = document.getElementById("track-en");
      track.src = URL.createObjectURL(file);
      video.load();
    }
  });
}

if (uploadKo) {
  uploadKo.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const track = document.getElementById("track-ko");
      track.src = URL.createObjectURL(file);
      video.load();
    }
  });
}

// ------------------------------
// 3) 자막 토글 + 티저 제한
// ------------------------------
function initPlayer() {
  const tracks = video.textTracks;

  if (tracks.length < 2) {
    console.warn("Not enough text tracks");
    return;
  }

  const en = tracks[0];
  const ko = tracks[1];

  const showEn = () => {
    en.mode = "showing";
    ko.mode = "hidden";
  };

  const showKo = () => {
    en.mode = "hidden";
    ko.mode = "showing";
  };

  // 기본 한국어
  showKo();

  // 15초 티저
  video.addEventListener("timeupdate", () => {
    if (video.currentTime > 15) {
      video.pause();
      video.currentTime = 0;
    }
  });

  // ------------------------------
  // ⛑ 핵심: overlay에서만 pointer 이벤트 받기
  // ------------------------------
  overlay.addEventListener("pointerdown", () => {
    showEn();
  });

  overlay.addEventListener("pointerup", () => {
    showKo();
  });
}

// 비디오 준비되면 init 실행
if (video.readyState >= 1) {
  initPlayer();
} else {
  video.addEventListener("loadedmetadata", initPlayer);
}
