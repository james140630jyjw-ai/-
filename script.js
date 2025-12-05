const video = document.getElementById("video");
const trackEn = document.getElementById("track-en");
const trackKo = document.getElementById("track-ko");

// 기본은 영어 자막 보이기
trackEn.mode = "showing";
trackKo.mode = "hidden";

// ▼ 15초 티저 제한
video.addEventListener("timeupdate", () => {
  if (video.currentTime > 15) {
    video.pause();
    video.currentTime = 0; // 처음으로 돌아가 반복 가능
  }
});

// ▼ 마우스 눌렀을 때 영어 / 때면 한국어
document.body.addEventListener("mousedown", () => {
  trackEn.mode = "showing";
  trackKo.mode = "hidden";
});

document.body.addEventListener("mouseup", () => {
  trackEn.mode = "hidden";
  trackKo.mode = "showing";
});

// ▼ 모바일 터치
document.body.addEventListener("touchstart", () => {
  trackEn.mode = "showing";
  trackKo.mode = "hidden";
});

document.body.addEventListener("touchend", () => {
  trackEn.mode = "hidden";
  trackKo.mode = "showing";
});

// ▼ 사용자 업로드: 영상
document.getElementById("upload-video").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  video.src = url;

  // 트랙 새로고침
  video.load();
  video.play();
});

// ▼ 사용자 업로드: 영어 자막
document.getElementById("upload-en").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  trackEn.src = URL.createObjectURL(file);
  video.load();
});

// ▼ 사용자 업로드: 한국어 자막
document.getElementById("upload-ko").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  trackKo.src = URL.createObjectURL(file);
  video.load();
});
