const video = document.getElementById("video");
const toggleZone = document.getElementById("subtitle-toggle-zone");

const uploadVideo = document.getElementById("upload-video");
const uploadEn = document.getElementById("upload-en");
const uploadKo = document.getElementById("upload-ko");

// ---------------------------------------------------------
// 1) 비디오 화면 클릭해도 재생/일시정지 안 되도록 막기
//    (재생/멈춤은 컨트롤바(플레이 버튼)로만 컨트롤)
// ---------------------------------------------------------
video.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// ---------------------------------------------------------
// 2) 업로드 기능 (PC/모바일 공통)
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
// 3) 플레이어 초기화 + 자막 토글 로직
// ---------------------------------------------------------
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
  // 5) 자막 토글: 아래 회색 바에서만 처리
  //    - PC: 마우스 눌렀을 때 → 영어, 뗄 때 → 한국어
  //    - 모바일: 터치 눌렀을 때 → 영어, 뗄 때 → 한국어
  // ---------------------------------------------------------

  const usePointer = "onpointerdown" in window;

  if (usePointer) {
    // 최신 브라우저: Pointer 이벤트
    toggleZone.addEventListener(
      "pointerdown",
      () => {
        showEn();
      },
      { passive: true }
    );

    toggleZone.addEventListener(
      "pointerup",
      () => {
        showKo();
      },
      { passive: true }
    );

    toggleZone.addEventListener(
      "pointerleave",
      () => {
        showKo();
      },
      { passive: true }
    );
  } else {
    // 구형 브라우저: mouse + touch fallback
    toggleZone.addEventListener("mousedown", () => {
      showEn();
    });

    toggleZone.addEventListener("mouseup", () => {
      showKo();
    });

    toggleZone.addEventListener("mouseleave", () => {
      showKo();
    });

    toggleZone.addEventListener("touchstart", (e) => {
      e.preventDefault();
      showEn();
    });

    toggleZone.addEventListener("touchend", (e) => {
      e.preventDefault();
      showKo();
    });
  }
}

// 비디오 메타데이터 로드 후 실행
if (video.readyState >= 1) {
  initPlayer();
} else {
  video.addEventListener("loadedmetadata", initPlayer);
}
