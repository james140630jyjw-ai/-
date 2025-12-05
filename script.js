const video = document.getElementById("video");
const uploadVideo = document.getElementById("upload-video");
const uploadEn = document.getElementById("upload-en");
const uploadKo = document.getElementById("upload-ko");

// --------------------------------------------
// 1) 업로드 기능 (PC / 모바일 공통)
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
  // 3) 비디오 아래쪽 30% 영역만 "자막 토글 존"
  //    - 그 영역에서만 재생/멈춤 클릭을 막고
  //      자막만 영어/한국어로 전환
  //
  //    - 그 외 영역 클릭 → 기본 동작(재생/멈춤) 유지
  // --------------------------------------------

  let isInToggleZone = false;

  function isInBottomZone(event) {
    const rect = video.getBoundingClientRect();
    const y = event.clientY;
    const x = event.clientX;

    // 비디오 범위 밖이면 false
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      return false;
    }

    const relativeY = (y - rect.top) / rect.height; // 0 = 위, 1 = 아래

    // 아래쪽 30% 영역 (0.7 ~ 1.0)
    return relativeY >= 0.7;
  }

  // pointer 이벤트 지원 여부 확인
  const usePointer = "onpointerdown" in window;

  if (usePointer) {
    // 최신 브라우저: Pointer 이벤트
    video.addEventListener("pointerdown", (e) => {
      if (isInBottomZone(e)) {
        isInToggleZone = true;
        showEn();
        e.preventDefault();
        e.stopPropagation(); // 재생/멈춤 토글 막기
      } else {
        isInToggleZone = false;
      }
    });

    video.addEventListener("pointerup", (e) => {
      if (isInToggleZone) {
        showKo();
        e.preventDefault();
        e.stopPropagation();
        isInToggleZone = false;
      }
    });

    video.addEventListener("pointerleave", (e) => {
      if (isInToggleZone) {
        showKo();
        isInToggleZone = false;
      }
    });
  } else {
    // 구형 브라우저: mouse + touch fallback
    video.addEventListener("mousedown", (e) => {
      if (isInBottomZone(e)) {
        isInToggleZone = true;
        showEn();
        e.preventDefault();
        e.stopPropagation();
      } else {
        isInToggleZone = false;
      }
    });

    video.addEventListener("mouseup", (e) => {
      if (isInToggleZone) {
        showKo();
        e.preventDefault();
        e.stopPropagation();
        isInToggleZone = false;
      }
    });

    video.addEventListener("mouseleave", (e) => {
      if (isInToggleZone) {
        showKo();
        isInToggleZone = false;
      }
    });

    video.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      if (isInBottomZone(touch)) {
        isInToggleZone = true;
        showEn();
        e.preventDefault();
        e.stopPropagation();
      } else {
        isInToggleZone = false;
      }
    });

    video.addEventListener("touchend", (e) => {
      if (isInToggleZone) {
        showKo();
        e.preventDefault();
        e.stopPropagation();
        isInToggleZone = false;
      }
    });
  }
}

// 비디오가 준비되면 실행
if (video.readyState >= 1) {
  initPlayer();
} else {
  video.addEventListener("loadedmetadata", initPlayer);
}
