import * as Tone from 'tone';

export const oscAnalyser = new Tone.Analyser('waveform', 1024);
export const outputAnalyser = new Tone.Analyser('waveform', 1024);

export const filter = new Tone.Filter({
  type: 'lowpass',
  frequency: 800,
  Q: 1,
});

export const synth = new Tone.Synth({
  oscillator: {
    type: 'sine',
  },
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.7,
    release: 0.3,
  },
});

export const volume = new Tone.Volume(0);

synth.connect(oscAnalyser);
oscAnalyser.connect(filter);
filter.connect(outputAnalyser);
outputAnalyser.connect(volume);
volume.toDestination();

export const initAudioContext = async () => {
  await Tone.start();
};

export const playMidiNote = (note: number, rate = 1) => {
  const freq = Tone.Frequency(note, 'midi').toFrequency();
  synth.triggerAttack(freq, rate);
};

export const stopNote = () => {
  synth.triggerRelease();
};

export const setVolume = (value: number) => {
  volume.volume.value = value; // value in dB
};
