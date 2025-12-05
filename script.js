const video = document.getElementById("video");
const uploadVideo = document.getElementById("upload-video");
const uploadEn = document.getElementById("upload-en");
const uploadKo = document.getElementById("upload-ko");

// ---------------------------------------------------------
// 1) 🔒 비디오 화면 클릭해도 재생/일시정지 안 되도록 막기
//    (컨트롤바 버튼으로만 재생/멈춤 가능)
// ---------------------------------------------------------
video.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// ---------------------------------------------------------
// 2) 사용자 업로드 기능 (PC/모바일 공통)
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// 3) 플레이어 초기화 + 자막 토글
// ---------------------------------------------------------
function initPlayer() {
  const tracks = video.textTracks;

  if (tracks.length < 2) {
    console.warn("Not enough text tracks");
    return;
  }

  const en = tracks[0]; // English
  const ko = tracks[1]; // Korean

  // ✅ 기본은 한국어 자막
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
  // 4) 15초 티저 제한 (15초 넘으면 처음으로 되돌리기)
  // ---------------------------------------------------------
  video.addEventListener("timeupdate", () => {
    if (video.currentTime > 15) {
      video.pause();
      video.currentTime = 0;
    }
  });

  // ---------------------------------------------------------
  // 5) 🖱 / 📱 마우스 + 터치 통합: pointer 이벤트로 처리
  //    - pointerdown: 누르는 동안 영어
  //    - pointerup  : 떼면 한국어
  // ---------------------------------------------------------
  window.addEventListener(
    "pointerdown",
    () => {
      showEn();
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerup",
    () => {
      showKo();
    },
    { passive: true }
  );
}

// 비디오 메타데이터 로드 후 초기화
if (video.readyState >= 1) {
  initPlayer();
} else {
  video.addEventListener("loadedmetadata", initPlayer);
}
