// Azan Audio Service
// Supports local audio files in public/audio/ folder

export interface AzanConfig {
  prayerName: string;
  audioUrl: string;
  duration?: number; // Estimated duration in seconds
}

/**
 * Get the local audio file URL for a prayer
 * Uses a single azan file for all prayers
 * @param prayerName - Name of the prayer
 * @returns URL to local audio file
 */
export function getLocalAzanUrl(prayerName: string): string {
  // Using the same Mishary Rashid Alafasy azan for all prayers
  return '/audio/azan.mp3';
}

export function getAzanUrl(prayerName: string): string {
  return getLocalAzanUrl(prayerName);
}

export function markUrlAsFailed(_url: string): void {
  // Not needed for local files
}

export function resetFailedUrls(): void {
  // Not needed for local files
}

/**
 * Play azan audio for a specific prayer
 * @param prayerName - Name of the prayer (fajr, dhuhr, asr, maghrib, isha)
 * @param onEnded - Callback when audio finishes playing
 * @returns Audio object that can be controlled
 */
export function playAzan(prayerName: string, onEnded?: () => void): HTMLAudioElement {
  const audioUrl = getAzanUrl(prayerName);
  console.log(`[Azan] 🎵 Playing local audio: "${audioUrl}"`);

  const audio = new Audio(audioUrl);

  let hasPlayed = false;
  let startTime = 0;

  audio.addEventListener('loadedmetadata', () => {
    console.log(`[Azan] ✓ Metadata loaded - duration: ${audio.duration.toFixed(1)}s`);
  });

  audio.addEventListener('canplay', () => {
    console.log(`[Azan] ✓ Ready to play - duration: ${audio.duration.toFixed(1)}s`);
  });

  audio.addEventListener('play', () => {
    hasPlayed = true;
    startTime = Date.now();
    console.log(`[Azan] ▶️ Started playing`);
  });

  audio.addEventListener('ended', () => {
    const playDuration = hasPlayed ? (Date.now() - startTime) / 1000 : 0;
    console.log(`[Azan] ✓ Finished - played: ${playDuration.toFixed(1)}s`);
    if (onEnded) onEnded();
  });

  audio.addEventListener('error', (e) => {
    const target = e.target as HTMLAudioElement;
    const error = target.error;

    console.error(`[Azan] ✗ Error loading audio:`, {
      url: audioUrl,
      error: error ? {
        code: error.code,
        message: error.message,
      } : 'No error object',
      networkState: target.networkState,
      readyState: target.readyState,
      currentSrc: target.currentSrc,
    });

    console.log(`[Azan] 💡 Hint: Make sure you've placed ${audioUrl} in the public/audio/ folder`);
    if (onEnded) onEnded();
  });

  // Play audio
  audio.play().catch((error) => {
    console.error(`[Azan] ✗ Play failed:`, error);
    console.log(`[Azan] 💡 Hint: Audio files must be in public/audio/ folder`);
    if (onEnded) onEnded();
  });

  return audio;
}

/**
 * Stop currently playing azan
 * @param audio - Audio element to stop
 */
export function stopAzan(audio: HTMLAudioElement | null): void {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
