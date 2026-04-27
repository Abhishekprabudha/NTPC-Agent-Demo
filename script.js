const video = document.getElementById("demoVideo");
const playBtn = document.getElementById("playNarrated");
const restartBtn = document.getElementById("restart");

playBtn.addEventListener("click", async () => {
  video.currentTime = 0;
  await video.play();
});

restartBtn.addEventListener("click", async () => {
  video.currentTime = 0;
  await video.play();
});

video.addEventListener("ended", () => {
  playBtn.textContent = "Replay narrated demo";
});
