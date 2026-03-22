# LuxTTS Railway Deployment (Parallel Track)

**Goal:** Deploy LuxTTS single-sample generation alongside Nvidia to compare quality.

---

## Quick Deploy (Railway Dashboard)

### Option A: New Service in Existing Project

1. **Go to Railway project:** our-kenya
2. **Click "+ New"** → **Empty Service**
3. **Service Settings:**
   - Name: `our-kenya-luxtts`
   - Connect to GitHub: `isaackaara/our-kenya` (same repo)
   - Branch: `main`
4. **Configure deployment:**
   - Settings → Build → Dockerfile Path: `Dockerfile.luxtts`
   - Settings → Deploy → Restart Policy: `Never`
5. **Deploy:** Railway auto-builds on push

### Option B: Separate Project (Cleaner)

1. **New Project:** our-kenya-luxtts
2. **Deploy from GitHub:** isaackaara/our-kenya, branch main
3. **Configure:** Same dockerfile path as above

---

## What Happens

1. **Railway clones repo** (latest main branch)
2. **Builds Dockerfile.luxtts:**
   - Installs Python 3.10 + ffmpeg
   - Clones official LuxTTS repo
   - Installs LuxTTS dependencies (~2-3 min)
3. **Downloads models** (~1GB, ~2-3 min)
4. **Loads reference audio** (reference-voice.wav = OpenAI sample)
5. **Generates speech** (Kenya independence text, ~2-3 min)
6. **Saves output:** `public/audio/1963-independence-election-luxtts.mp3`

**Total time:** ~10-15 minutes (faster than Nvidia's 20+ min)

---

## Output Location

Same as Nvidia: `public/audio/1963-independence-election-luxtts.mp3`

---

## Comparison Setup

After both complete:

| Sample | Path | Quality | Speed |
|--------|------|---------|-------|
| **OpenAI** | ~/clawd/sample-audio-openai.mp3 | 9/10 baseline | N/A (API) |
| **Nvidia** | public/audio/1963-independence-election.mp3 | TBD | 20+ min |
| **LuxTTS** | public/audio/1963-independence-election-luxtts.mp3 | TBD | ~10-15 min |

---

## Reference Audio Strategy

**Current:** Using OpenAI sample as voice cloning reference (meta approach).

**Why:** LuxTTS clones voices, so it will mimic OpenAI's narrator style. This makes comparison fair - same voice, different TTS engine.

**Alternative:** Record custom narrator voice (3-5 sec) and replace `reference-voice.wav` before deploy.

---

## Troubleshooting

### Build Fails

Check:
- LuxTTS repo clone succeeded
- pip install from LuxTTS requirements.txt completed
- No dependency conflicts (less likely than Nvidia)

### Runtime Fails

Check logs for:
- Reference audio file found and loaded
- Model download completed (1GB, can timeout on slow Railway instances)
- CUDA device availability (falls back to CPU if unavailable)

### Output Missing

- Check if script ran to completion
- Look for `✓ MP3 saved:` in logs
- Verify ffmpeg installed (used for WAV→MP3 conversion)

---

## Cost Estimate

**Railway free tier:**
- Build: ~5-10 min (Docker + dependencies)
- Run: ~10-15 min (model load + generation)
- Total: ~20-25 min compute
- Well within free tier for testing

**Batch (8K notes):**
- Estimated: 1-2 hours total
- Requires paid tier (but 3x cheaper than Nvidia's 4-6 hours)

---

## Next Steps After Deploy

1. **Wait for both to complete** (Nvidia + LuxTTS)
2. **Download both MP3s** from Railway deployments
3. **Listen to all three:**
   - OpenAI (baseline)
   - Nvidia (current attempt)
   - LuxTTS (new contender)
4. **Decide winner:**
   - Quality comparison
   - File size comparison
   - Production-readiness assessment
5. **Full batch deploy** with winning TTS engine

---

*Created 2026-03-22 by Jack for parallel TTS evaluation.*
