import * as Tone from 'tone';

export const filter = new Tone.Filter({
  type: 'lowpass',
  frequency: 800,
  Q: 1,
}).toDestination();

export const synth = new Tone.Synth().connect(filter);

export const initAudioContext = async () => {
  await Tone.start();
};

export const playMidiNote = (note: number) => {
  const freq = Tone.Frequency(note, 'midi').toFrequency();
  synth.triggerAttack(freq);
};

export const stopNote = () => {
  synth.triggerRelease();
};
