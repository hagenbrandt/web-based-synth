import * as Tone from 'tone';

export const ALLOWED_MIDI_NOTES = [
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
  43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
] as const;

export type SampleMidiNote = (typeof ALLOWED_MIDI_NOTES)[number];

export const sampleMap: Record<string, string> = {
  A2: 'a2.wav',
  'A#2': 'a-sharp2.wav',
  B2: 'b2.wav',
  C2: 'c2.wav',
  'C#2': 'c-sharp2.wav',
  D2: 'd2.wav',
  'D#2': 'd-sharp2.wav',
  E2: 'e2.wav',
  F2: 'f2.wav',
  'F#2': 'f-sharp2.wav',
  G2: 'g2.wav',
  'G#2': 'g-sharp2.wav',

  A3: 'a3.wav',
  'A#3': 'a-sharp3.wav',
  B3: 'b3.wav',
  C3: 'c3.wav',
  'C#3': 'c-sharp3.wav',
  D3: 'd3.wav',
  'D#3': 'd-sharp3.wav',
  E3: 'e3.wav',
  F3: 'f3.wav',
  'F#3': 'f-sharp3.wav',
  G3: 'g3.wav',
  'G#3': 'g-sharp3.wav',

  A4: 'a4.wav',
  'A#4': 'a-sharp4.wav',
  B4: 'b4.wav',
  C4: 'c4.wav',
  'C#4': 'c-sharp4.wav',
  D4: 'd4.wav',
  'D#4': 'd-sharp4.wav',
  E4: 'e4.wav',
  F4: 'f4.wav',
  'F#4': 'f-sharp4.wav',
  G4: 'g4.wav',
  'G#4': 'g-sharp4.wav',

  C5: 'c5.wav',
};

export const SAMPLE_BASE_MAP: Record<number, string | undefined> = {
  45: 'A2',
  46: 'A#2',
  47: 'B2',
  48: 'C3',
  49: 'C#3',
  50: 'D3',
  51: 'D#3',
  52: 'E3',
  53: 'F3',
  54: 'F#3',
  55: 'G3',
  56: 'G#3',
  57: 'A3',
  58: 'A#3',
  59: 'B3',
  60: 'C4',
  61: 'C#4',
  62: 'D4',
  63: 'D#4',
  64: 'E4',
  65: 'F4',
  66: 'F#4',
  67: 'G4',
  68: 'G#4',
  69: 'A4',
  70: 'A#4',
  71: 'B4',
  72: 'C5',
};

export function isSampleNote(note: number): note is SampleMidiNote {
  return ALLOWED_MIDI_NOTES.includes(note as SampleMidiNote);
}

export function playSampleNote(note: number, sampler: Tone.Sampler): void {
  if (!isSampleNote(note)) return;
  const key = SAMPLE_BASE_MAP[note];
  if (!key) return;

  sampler.triggerAttack(key);
}
