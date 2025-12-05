const video = document.getElementById("video");
const toggleZone = document.getElementById("subtitle-toggle-zone");

const uploadVideo = document.getElementById("upload-video");
const uploadEn = document.getElementById("upload-en");
const uploadKo = document.getElementById("upload-ko");

// --------------------------------------------
// 1) 업로드 기능 (PC/모바일 공통)
// --------------------------------------------
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

// --------------------------------------------
// 2) 플레이어 초기화 + 자막 토글 로직
// --------------------------------------------
function initPlayer() {
  const tracks = video.textTracks;

  if (tracks.length < 2) {
    console.warn("Not enough text tracks");
    return;
  }

  const en = tracks[0]; // English
  const ko = tracks[1]; // Korean

  const showEn = () => {
    en.mode = "showing";
    ko.mode = "hidden";
  };

  const showKo = () => {
    en.mode = "hidden";
    ko.mode = "showing";
  };

  // ✅ 기본: 한국어 자막
  showKo();

  // 15초 티저 제한
  video.addEventListener("timeupdate", () => {
    if (video.currentTime > 15) {
      video.pause();
      video.currentTime = 0;
    }
  });

  // --------------------------------------------
  // 3) 자막 토글: 아래 회색 바에서만 처리
  //    - PC: 마우스 눌렀을 때 → 영어, 뗄 때 → 한국어
  //    - 모바일: 터치 눌렀을 때 → 영어, 뗄 때 → 한국어
  // --------------------------------------------

  // PC 마우스
  toggleZone.addEventListener("mousedown", () => {
    showEn();
  });

  toggleZone.addEventListener("mouseup", () => {
    showKo();
  });

  toggleZone.addEventListener("mouseleave", () => {
    showKo();
  });

  // 모바일 터치
  toggleZone.addEventListener("touchstart", (e) => {
    e.preventDefault(); // 스크롤/텍스트 선택 방지
    showEn();
  });

  toggleZone.addEventListener("touchend", (e) => {
    e.preventDefault();
    showKo();
  });
}

// 비디오 메타데이터 로드 후 실행
if (video.readyState >= 1) {
  initPlayer();
} else {
  video.addEventListener("loadedmetadata", initPlayer);
}
