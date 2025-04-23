import * as Tone from 'tone';

export const filter = new Tone.Filter({
  type: 'lowpass',
  frequency: 800,
  Q: 1,
}).toDestination();

export const synth = new Tone.Synth().connect(filter);
