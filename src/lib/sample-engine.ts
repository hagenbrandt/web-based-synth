import {
  ALLOWED_MIDI_NOTES,
  SAMPLE_BASE_MAP,
  isSampleNote,
} from './sample-map';

const audioContext = new AudioContext();

const sampleBuffers = new Map<number, AudioBuffer>();

/**
 * Loads all sample files into memory as AudioBuffers.
 */
export async function preloadSamples(): Promise<void> {
  const loadPromises = ALLOWED_MIDI_NOTES.map(async (note) => {
    const fileName = SAMPLE_BASE_MAP[note];
    if (!fileName) return;

    // const filePath = `/samples/glockenspiel/${fileName.toLowerCase()}.wav`;
    const filePath = `/samples/taped-vibes/${fileName.toLowerCase()}.wav`;
    // const filePath = `/samples/glockenspiel/${encodeURIComponent(fileName)}`;
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Fetch failed for ${filePath}: ${response.status}`);
      }
      const contentType = response.headers.get('Content-Type');
      console.log(`Loading ${filePath} with content type: ${contentType}`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      sampleBuffers.set(note, audioBuffer);
    } catch (err) {
      console.error(`Failed to load sample for MIDI ${note}:`, err);
    }
  });

  await Promise.all(loadPromises);
}

/**
 * Plays a preloaded sample buffer for the given MIDI note.
 */
export function playSampleBuffer(note: number): void {
  if (!isSampleNote(note)) return;

  const buffer = sampleBuffers.get(note);
  if (!buffer) {
    console.warn(`No buffer found for MIDI ${note}`);
    return;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.loop = false;
  source.start(0);
}

export function hasLoadedSamples(): boolean {
  return sampleBuffers.size > 0;
}
