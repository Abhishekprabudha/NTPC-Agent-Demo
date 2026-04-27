const video = document.getElementById("demoVideo");
const narrationAudio = document.getElementById("narrationAudio");
const playBtn = document.getElementById("playNarrated");
const restartBtn = document.getElementById("restart");
const toggleNarrationBtn = document.getElementById("toggleNarration");
const narrationStatus = document.getElementById("narrationStatus");

let narrationEnabled = true;

function setNarrationStatus(message) {
  narrationStatus.textContent = message;
}

function getNarrationEnabledMessage() {
  return "Narration fallback is enabled: if the MP4 audio track is missing or muted, the MP3 narration is played in sync.";
}

async function playNarrationFromCurrentTime(preferUserGesture = false) {
  if (!narrationEnabled) {
    narrationAudio.pause();
    return;
  }

  if (Math.abs(narrationAudio.currentTime - video.currentTime) > 0.35) {
    narrationAudio.currentTime = video.currentTime;
  }

  narrationAudio.playbackRate = video.playbackRate;

  if (video.paused) {
    return;
  }

  try {
    await narrationAudio.play();
    setNarrationStatus(getNarrationEnabledMessage());
  } catch (error) {
    // Browsers can block non-user-gesture audio playback. Explicitly calling
    // narrationAudio.play() inside click handlers keeps user activation and fixes
    // intermittent "missing narration" behavior after replay.
    if (preferUserGesture) {
      setNarrationStatus("Narration audio could not start. Click Play narrated demo again to re-enable narration.");
    } else {
      setNarrationStatus("Narration audio autoplay is blocked. Use Play narrated demo to resume narration.");
    }
  }
}

async function startPlaybackFromBeginning(preferUserGesture = false) {
  video.currentTime = 0;
  if (narrationEnabled) {
    narrationAudio.currentTime = 0;
  }

  await video.play();
  await playNarrationFromCurrentTime(preferUserGesture);
}

playBtn.addEventListener("click", async () => {
  await startPlaybackFromBeginning(true);
});

restartBtn.addEventListener("click", async () => {
  await startPlaybackFromBeginning(true);
});

toggleNarrationBtn.addEventListener("click", async () => {
  narrationEnabled = !narrationEnabled;
  toggleNarrationBtn.textContent = narrationEnabled ? "Narration: On" : "Narration: Off";

  if (!narrationEnabled) {
    narrationAudio.pause();
    setNarrationStatus("Narration fallback is paused.");
    return;
  }

  setNarrationStatus(getNarrationEnabledMessage());
  await playNarrationFromCurrentTime(true);
});

video.addEventListener("play", () => {
  void playNarrationFromCurrentTime(false);
});
video.addEventListener("pause", () => narrationAudio.pause());
video.addEventListener("seeking", () => {
  void playNarrationFromCurrentTime(false);
});
video.addEventListener("timeupdate", () => {
  void playNarrationFromCurrentTime(false);
});
video.addEventListener("ratechange", () => {
  narrationAudio.playbackRate = video.playbackRate;
  void playNarrationFromCurrentTime(false);
});
video.addEventListener("ended", () => {
  narrationAudio.pause();
  narrationAudio.currentTime = 0;
  playBtn.textContent = "Replay narrated demo";
});

setNarrationStatus(getNarrationEnabledMessage());
