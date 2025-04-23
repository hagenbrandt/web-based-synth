import { useEffect, useState } from 'react';
import { PianoKeyboard } from './components/keyboard';
import {
  OscillatorSection,
  type OscType,
} from './components/oscillator-section';
import { FilterSection } from './components/filter-section';
import './styles/main.css';
import {
  synth,
  filter,
  initAudioContext,
  playMidiNote,
  stopNote,
} from './lib/audio-engine';
import { Envelope, EnvelopeSection } from './components/envelope-section';

const handleFilterChange = (cutoff: number, q: number) => {
  filter.frequency.value = cutoff;
  filter.Q.value = q;
};

const handleEnvelopeChange = (env: Envelope) => {
  synth.envelope.attack = env.attack;
  synth.envelope.decay = env.decay;
  synth.envelope.sustain = env.sustain;
  synth.envelope.release = env.release;
};

const App = () => {
  const [oscType, setOscType] = useState<OscType>('sine');
  const [oscFreqOffset, setOscFreqOffset] = useState<number>(0);
  const [cutoff, setCutoff] = useState(0);
  const [resonance, setResonance] = useState(1);
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(0.3);

  useEffect(() => {
    synth.oscillator.type = oscType;
    synth.detune.value = oscFreqOffset * 100;
  }, [oscType, oscFreqOffset]);

  const handleNoteDown = async (note: number) => {
    await initAudioContext();
    playMidiNote(note);
  };

  const handleNoteUp = () => {
    stopNote();
  };

  const handleDetuneChange = (detuneCents: number) => {
    synth.detune.value = detuneCents;
  };

  synth.oscillator.type = oscType;

  return (
    <div className="synth-wrapper">
      <div className="module-wrapper">
        <div className="vertical-wrapper">
          <OscillatorSection
            oscType={oscType}
            oscFreqOffset={oscFreqOffset}
            setOscType={setOscType}
            setOscFreqOffset={setOscFreqOffset}
            onDetuneChange={handleDetuneChange}
          />
          <FilterSection
            cutoff={cutoff}
            setCutoff={setCutoff}
            resonance={resonance}
            setResonance={setResonance}
            onFilterChange={handleFilterChange}
          />
        </div>
        <EnvelopeSection
          attack={attack}
          decay={decay}
          sustain={sustain}
          release={release}
          setAttack={setAttack}
          setDecay={setDecay}
          setSustain={setSustain}
          setRelease={setRelease}
          onEnvelopeChange={handleEnvelopeChange}
        />
      </div>
      <PianoKeyboard onNoteDown={handleNoteDown} onNoteUp={handleNoteUp} />
    </div>
  );
};

export default App;
