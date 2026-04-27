const video = document.getElementById("demoVideo");
const narrationAudio = document.getElementById("narrationAudio");
const playBtn = document.getElementById("playNarrated");
const restartBtn = document.getElementById("restart");
const toggleNarrationBtn = document.getElementById("toggleNarration");
const narrationStatus = document.getElementById("narrationStatus");

let narrationEnabled = true;

function syncNarrationToVideo() {
  if (!narrationEnabled) {
    narrationAudio.pause();
    return;
  }

  if (Math.abs(narrationAudio.currentTime - video.currentTime) > 0.35) {
    narrationAudio.currentTime = video.currentTime;
  }

  if (!video.paused) {
    narrationAudio.play().catch(() => {
      narrationStatus.textContent = "Narration audio could not autoplay. Click Play narrated demo to start audio.";
    });
  }
}

async function startPlaybackFromBeginning() {
  video.currentTime = 0;
  if (narrationEnabled) {
    narrationAudio.currentTime = 0;
  }

  await video.play();
  syncNarrationToVideo();
}

playBtn.addEventListener("click", async () => {
  await startPlaybackFromBeginning();
});

restartBtn.addEventListener("click", async () => {
  await startPlaybackFromBeginning();
});

toggleNarrationBtn.addEventListener("click", () => {
  narrationEnabled = !narrationEnabled;
  toggleNarrationBtn.textContent = narrationEnabled ? "Narration: On" : "Narration: Off";

  if (!narrationEnabled) {
    narrationAudio.pause();
    narrationStatus.textContent = "Narration fallback is paused.";
    return;
  }

  narrationStatus.textContent = "Narration fallback is enabled: if the MP4 audio track is missing or muted, the MP3 narration is played in sync.";
  syncNarrationToVideo();
});

video.addEventListener("play", syncNarrationToVideo);
video.addEventListener("pause", () => narrationAudio.pause());
video.addEventListener("seeking", syncNarrationToVideo);
video.addEventListener("timeupdate", syncNarrationToVideo);
video.addEventListener("ratechange", () => {
  narrationAudio.playbackRate = video.playbackRate;
  syncNarrationToVideo();
});
video.addEventListener("ended", () => {
  narrationAudio.pause();
  narrationAudio.currentTime = 0;
  playBtn.textContent = "Replay narrated demo";
});
