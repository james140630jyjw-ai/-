const video = document.getElementById("video");
const uploadVideo = document.getElementById("upload-video");
const uploadEn = document.getElementById("upload-en");
const uploadKo = document.getElementById("upload-ko");

// ---------------------------------------------------------
// 1) 🔒 비디오 화면 클릭해도 재생/일시정지 안 되도록 막기
// ---------------------------------------------------------
video.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// ---------------------------------------------------------
// 2) 사용자 업로드 기능
// ---------------------------------------------------------
uploadVideo.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    video.src = URL.createObjectURL(file);
  }
});

uploadEn.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const track = document.getElementById("track-en");
    track.src = URL.createObjectURL(file);
  }
});

uploadKo.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const track = document.getElementById("track-ko");
    track.src = URL.createObjectURL(file);
  }
});

// ---------------------------------------------------------
// 3) 자막 토글 함수
// ---------------------------------------------------------
function initPlayer() {
  const tracks = video.textTracks;

  if (tracks.length < 2) {
    console.warn("Not enough text tracks");
    return;
  }

  const en = tracks[0]; // English
  const ko = tracks[1]; // Korean

  // 기본 한국어 표시
  en.mode = "hidden";
  ko.mode = "showing";

  const showEn = () => {
    en.mode = "showing";
    ko.mode = "hidden";
  };

  const showKo = () => {
    en.mode = "hidden";
    ko.mode = "showing";
  };

  // ---------------------------------------------------------
  // 4) 15초 티저 제한
  // ---------------------------------------------------------
  video.addEventListener("timeupdate", () => {
    if (video.currentTime > 15) {
      video.pause();
      video.currentTime = 0;
    }
  });

  // ---------------------------------------------------------
  // 5) 마우스/터치 홀드로 자막 전환
  // ---------------------------------------------------------
  document.addEventListener("mousedown", (e) => {
    showEn();
  });

  document.addEventListener("mouseup", (e) => {
    showKo();
  });

  document.addEventListener("touchstart", (e) => {
    showEn();
  });

  document.addEventListener("touchend", (e) => {
    showKo();
  });
}

// ---------------------------------------------------------
// 비디오가 준비되면 초기화 실행
// ---------------------------------------------------------
if (video.readyState >= 1) {
  initPlayer();
} else {
  video.addEventListener("loadedmetadata", initPlayer);
}
