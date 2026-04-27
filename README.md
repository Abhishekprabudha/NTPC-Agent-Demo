# NTPC Procurement Agent × AIonOS Demo Repo

A static HTML demo package for the NTPC Procurement Agent screen recording.

This repo contains a fast-paced 90-second version of the original ~7 minute video, a matched narration MP3, and a final narrated MP4 export.

## Deliverables

- `assets/ntpc-procurement-agent-demo-fast.mp4` — compressed / fast-paced 90-second video
- `assets/demo-narration.mp3` — narration track aligned to the 90-second runtime
- `assets/ntpc-procurement-agent-demo-narrated.mp4` — final MP4 with narration muxed into the video
- `assets/narration.txt` — editable narration script
- `index.html` — local/static preview page
- `styles.css` — page styling
- `script.js` — playback and sync logic
- `scripts/generate_narration.py` — regenerates narration MP3 from `assets/narration.txt`
- `scripts/render_narrated_mp4.sh` — renders the narrated MP4 from the fast video and MP3

## Demo storyline

The narration positions the NTPC Procurement Agent as an AI decision cockpit for coal procurement. It covers:

1. dashboard consolidation across procurement, suppliers, transport, inventory, and coal availability
2. insight generation across coal companies, grades, quantities, freight, risk, and landed-cost exposure
3. ground-scenario simulation for disruption, demand surge, freight bottlenecks, rake unavailability, dispatch delay, and quality variation
4. optimized coal procurement recommendations balancing cost, availability, reliability, inventory cover, and route feasibility
5. power-generation forecasting from coal availability with automatic supplier and plant notifications

## Runtime

- Original uploaded recording: approximately 7 minutes 26 seconds
- Fast-paced output: exactly 90 seconds
- Speed-up factor used: approximately 4.96×

## How to preview locally

Open `index.html` in a browser and click **Play narrated demo**.

## Regenerate narration MP3

Update `assets/narration.txt`, then run:

```bash
python scripts/generate_narration.py
```

The script defaults to a British female narration voice (`en-GB-LibbyNeural`) using `edge-tts`.
If `edge-tts` is unavailable or fails, the script now exits by default (to avoid robotic narration in deliverables).

If you explicitly want a fallback robotic track, run:

```bash
python scripts/generate_narration.py --allow-fallback
```

This fallback uses a female-leaning British eSpeak voice (`en-gb+f3`) with `ffmpeg`.

## Re-render narrated MP4

```bash
bash scripts/render_narrated_mp4.sh
```

The renderer muxes the fast video with `assets/demo-narration.mp3` and writes:

```text
assets/ntpc-procurement-agent-demo-narrated.mp4
```

## GitHub Actions automation

- On merge/push to `main`, changing `assets/narration.txt` or `scripts/generate_narration.py` triggers `.github/workflows/generate-narration.yml` to regenerate `assets/demo-narration.mp3` with Edge TTS.
- When `assets/demo-narration.mp3` changes on `main`, `.github/workflows/render-narrated-mp4.yml` triggers to regenerate `assets/ntpc-procurement-agent-demo-narrated.mp4`.
- Both workflows are also available via manual `workflow_dispatch`.
