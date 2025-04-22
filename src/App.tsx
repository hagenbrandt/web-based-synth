import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { PianoKeyboard } from './components/keyboard';
import {
  OscillatorSection,
  type OscType,
} from './components/oscillator-section';
import './styles/main.css';

const synth = new Tone.Synth().toDestination();

function App() {
  const [oscType, setOscType] = useState<OscType>('sine');
  const [oscFreqOffset, setOscFreqOffset] = useState<number>(0);

  useEffect(() => {
    synth.detune.value = oscFreqOffset * 100;
  }, [oscFreqOffset]);

  const handleNoteDown = async (note: number) => {
    await Tone.start();
    const freq = Tone.Frequency(note, 'midi').toFrequency();
    synth.triggerAttack(freq);
  };

  const handleNoteUp = () => {
    synth.triggerRelease();
  };

  synth.oscillator.type = oscType;

  return (
    <div className="synth-wrapper">
      <OscillatorSection
        oscType={oscType}
        oscFreqOffset={oscFreqOffset}
        setOscType={setOscType}
        setOscFreqOffset={setOscFreqOffset}
      />
      <PianoKeyboard onNoteDown={handleNoteDown} onNoteUp={handleNoteUp} />
    </div>
  );
}

export default App;
