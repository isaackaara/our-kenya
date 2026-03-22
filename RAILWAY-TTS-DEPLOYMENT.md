# Railway TTS Batch Deployment Guide

## Overview

This guide deploys a one-shot TTS generation job on Railway to pre-generate audio for all 8,000+ Our Kenya notes.

**Expected runtime:** 4-6 hours (one-time, overnight job)  
**Cost:** Free (within Railway free tier)  
**Output:** MP3 files at `public/audio/{slug}.mp3`

---

## Deployment Steps

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
# or
brew install railway
```

### 2. Authenticate with Railway

```bash
railway login
```

Follow the browser auth flow.

### 3. Deploy the Job

From the `kenya-history` directory:

```bash
# Create new Railway project
railway init

# When prompted:
# Project name: our-kenya-tts-batch
# Dockerfile: Use Dockerfile.tts

# Deploy
railway deploy
```

Or use the Railway dashboard (faster):
1. Go to https://railway.app/dashboard
2. Create new project → GitHub repo → isaackaara/our-kenya
3. Configure:
   - **Service name:** our-kenya-tts-batch
   - **Dockerfile:** `Dockerfile.tts`
   - **Start command:** `python3 scripts/batch-tts-generation.py`
4. Deploy

### 4. Monitor Progress

```bash
# View logs
railway logs

# Watch in real-time
railway logs --follow
```

Or from dashboard: Deployments tab → View logs

---

## Expected Output

**First 5 minutes:**
```
[2026-03-22T...] [INFO] Starting batch TTS generation for Our Kenya
[2026-03-22T...] [INFO] Found 8000 markdown files
[2026-03-22T...] [INFO] Loading tts_models/en/ljspeech/glow-tts model...
```

**Progress (every 5 items):**
```
[2026-03-22T...] [INFO] Generating audio for 1963-independence-election (2847 chars)...
[2026-03-22T...] [INFO] ✓ 1963-independence-election (482.3 KB)
[2026-03-22T...] [INFO] Checkpoint: 5/8000 done (0.25 files/sec, ~8.9h remaining)
```

**Completion:**
```
[2026-03-22T...] [INFO] COMPLETE: 7998 generated, 2 failed
[2026-03-22T...] [INFO] Audio saved to: public/audio/
```

---

## Resuming if Job Dies

The script saves a checkpoint every 5 files. If Railway times out or fails:

1. Check logs for failure reason
2. Fix (if needed) and redeploy
3. Script automatically resumes from checkpoint

Checkpoint file: `.tts-checkpoint.json`

---

## After Generation Complete

### 1. Download Generated Audio

```bash
# Copy audio from Railway to local
railway connect postgres  # (if using remote DB, skip otherwise)

# Or manually download from dashboard:
# Deployments → Files → public/audio/

# Or via git (if uploading to repo):
git clone isaac@kaara/our-kenya
cd our-kenya
# Check if public/audio/ exists with MP3 files
```

### 2. Upload to CDN / Static Storage

Option A: Commit to Git (if file size < 2GB total)
```bash
git add public/audio/
git commit -m "Add pre-generated TTS audio for all notes"
git push
```

Option B: Upload to Cloudflare R2 (preferred for large assets)
```bash
# Use Cloudflare R2 API
# Bucket: our-kenya-audio
# Sync public/audio/ to R2
```

Option C: Keep on Railway filesystem
- Audio serves directly from `public/audio/` on deployed site
- No additional upload needed

### 3. Update Edge Function (Optional)

Current edge function (`functions/api/tts.ts`) calls OpenAI for on-demand.

**Option 1: Keep as-is** (new notes only)
- Existing notes: Serve pre-generated MP3 from `public/audio/{slug}.mp3`
- New notes: Generate on-demand via OpenAI (20-40s wait)

**Option 2: Switch to Nvidia** (zero cost ongoing)
- Deploy Nvidia inference service on Railway
- Update `functions/api/tts.ts` to call Nvidia instead of OpenAI
- New notes: 2-5s audio generation (vs 20-40s)

---

## Troubleshooting

### Job times out (>10 hours)
- Likely cause: CPU throttling on Railway free tier
- Solution: Increase batch size to 10 files before checkpoint

### Out of memory
- Likely cause: Model not releasing memory between notes
- Solution: Restart Python process every 20 files (modify batch-tts-generation.py)

### Some notes fail
- Check `.tts-checkpoint.json` for failed list
- Inspect logs for specific errors
- Most common: Markdown parsing issues (fix and redeploy)

### Audio quality is poor
- Check `TTS_QUALITY` in railway.json (lower = better)
- Default: 5 (128kbps MP3)
- Change to 3 for higher quality (larger files)

---

## File Structure

```
kenya-history/
├── scripts/
│   └── batch-tts-generation.py    # Main batch script
├── content/                        # All .md files
├── public/
│   └── audio/                      # OUTPUT: Generated MP3 files
├── Dockerfile.tts                  # Railway Docker config
├── requirements-tts.txt            # Python dependencies
├── railway.json                    # Railway metadata
└── RAILWAY-TTS-DEPLOYMENT.md       # This file
```

---

## Cost Breakdown

**Railway Free Tier:**
- 500 compute hours/month
- Batch job: ~5-6 hours = ~1% of monthly quota
- Cost: $0

**If upgrading to Pro ($5/month):**
- Unlimited compute hours
- Recommended if running jobs frequently
- Still dirt cheap

---

## Next Steps

### 1. Deploy (30 min)
```bash
railway init
railway deploy
# Monitor logs
```

### 2. Wait for completion (4-6 hours, overnight)
- Check logs in morning
- Confirm all 8,000 notes generated

### 3. Upload audio (15 min)
- Git commit + push
- Or upload to R2 CDN

### 4. Test (10 min)
- Visit our-kenya.com
- Click "Listen" on a note
- Verify audio loads instantly (no 20-40s wait)

### 5. Update Edge function (30 min, optional)
- Replace OpenAI with Nvidia for new notes
- Reduces cost + latency going forward

---

## Questions?

Check:
- Railway dashboard for logs: https://railway.app/dashboard
- Script output: `batch-tts-generation.log`
- Checkpoint status: `.tts-checkpoint.json`
