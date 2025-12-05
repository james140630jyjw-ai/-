const video = document.getElementById("video");

// 자막/티저 설정을 초기화하는 함수
function initPlayer() {
  const tracks = video.textTracks;

  // 트랙이 2개(영어/한국어) 있는지 확인
  if (tracks.length < 2) {
    console.warn("Not enough text tracks");
    return;
  }

  const en = tracks[0]; // 첫 번째 트랙: English
  const ko = tracks[1]; // 두 번째 트랙: Korean

  // ✅ 기본은 한국어 자막 보이기
  en.mode = "hidden";
  ko.mode = "showing";

  // 자막 전환 함수
  const showEn = () => {
    en.mode = "showing";
    ko.mode = "hidden";
  };

  const showKo = () => {
    en.mode = "hidden";
    ko.mode = "showing";
  };

  // 🔁 15초 티저 제한
  video.addEventListener("timeupdate", () => {
    if (video.currentTime > 15) {
      video.pause();
      video.currentTime = 0; // 처음으로 되돌리기
    }
  });

  // 🖱 마우스 눌렀을 때 → 영어
  document.body.addEventListener("mousedown", showEn);
  // 🖱 손 뗄 때 → 한국어
  document.body.addEventListener("mouseup", showKo);

  // 📱 터치 시작 → 영어
  document.body.addEventListener("touchstart", showEn);
  // 📱 터치 끝 → 한국어
  document.body.addEventListener("touchend", showKo);
}

// 비디오 메타데이터가 준비된 후에 textTracks 접근
if (video.readyState >= 1) {
  initPlayer();
} else {
  video.addEventListener("loadedmetadata", initPlayer);
}
