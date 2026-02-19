# Azan Audio Files

This folder contains the azan (call to prayer) audio files by Mishary Rashid Alafasy.

## Current Setup:

Two different azan recordings:
- **fajr.mp3** (3.4 MB) - Special Fajr azan with "Assalaatu khairun minan nawm"
- **others.mp3** (2.9 MB) - General azan for Dhuhr, Asr, Maghrib, Isha

## Reciter:

Mishary Rashid Alafasy
- One of the most famous Quran reciters
- Beautiful, clear voice
- Traditional melody

## Usage:

- **Fajr (Subuh)** → Uses fajr.mp3
- **Dhuhr, Asr, Maghrib, Isha** → Uses others.mp3
- **Syuruk (Sunrise)** → Uses others.mp3

## Recommended Audio Format:

- **Format:** MP3
- **Bitrate:** 128kbps
- **Sample Rate:** 44.1kHz
- **Channels:** Stereo or Mono
- **Typical file size:** ~500KB - 1MB

## Where to Download Azan Recordings:

### Free Sources:

1. **Quranicaudio**
   https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/
   - Search for "adhan" files

2. **EveryAyah**
   https://everyayah.com/
   - High quality MP3 files

3. **Search for:**
   - "Mishary Rashid Alafasy adhan mp3 download"
   - "Abdul Rahman Al-Sudais adhan mp3"

### Recommended Reciters:

- Mishary Rashid Alafasy (most popular, clear voice)
- Abdul Rahman Al-Sudais
- Maher Al-Muaiqly

## How to Convert if Needed:

If you have azan in other formats, use one of these free tools:

1. **Online Converter:** https://online-audio-converter.com/
   - Upload your file
   - Select MP3 format
   - Set bitrate to 128kbps
   - Download

2. **Audacity** (Free Desktop Software):
   - Import your audio file
   - File → Export → Export as MP3
   - Set quality to 128kbps

3. **FFmpeg** (Command Line):
   ```
   ffmpeg -i input.wav -b:a 128k -ar 44100 output.mp3
   ```

## Testing:

After adding files, test by clicking the debug button (▶) on any prayer card.

Expected console logs:
```
[Azan] 🎵 Playing local audio: "/audio/fajr.mp3"
[Azan] ✓ Metadata loaded - duration: 45.2s
[Azan] ▶️ Started playing
[Azan] ✓ Finished - played: 45.2s
```

## Troubleshooting:

**Issue:** Audio not playing
**Solution:** Check browser console for errors, verify files are in this folder

**Issue:** Files not loading
**Solution:** Make sure filenames match exactly (lowercase, .mp3 extension)

**Issue:** Build not including audio files
**Solution:** Files in public/ folder are automatically included
