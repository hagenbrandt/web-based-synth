import { useCallback, useEffect, useState } from 'react';
import { PianoKeyboard } from './components/keyboard';
import {
  OscillatorSection,
  type OscType,
} from './components/oscillator-section';
import { FilterSection } from './components/filter-section';
import './styles/main.css';
import {
  oscAnalyser,
  outputAnalyser,
  synth,
  filter,
  initAudioContext,
  playMidiNote,
  stopNote,
  setVolume,
} from './lib/audio-engine';
import { Envelope, EnvelopeSection } from './components/envelope-section';
import { Oscilloscope } from './components/oscilloscope';
import { useOscilloscope } from './hooks/useOscilloscope';
import { Toggle } from './components/toggle';
import { Output } from './components/output-sections';
import { playSampleBuffer, preloadSamples } from './lib/sample-engine';
import { SampleToggle } from './components/sample-toggle';
import { useMidiInput } from './hooks/useMidiInput';

const handleFilterChange = (cutoff: number, q: number) => {
  filter.frequency.value = cutoff;
  filter.Q.value = q;
};

const handleEnvelopeChange = (env: Envelope) => {
  synth.set({ envelope: env });
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
  const [showOscScope, setShowOscScope] = useState<boolean>(false);
  const oscWave = useOscilloscope(oscAnalyser);
  const outWave = useOscilloscope(outputAnalyser);
  const [volume, setVol] = useState(-6);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [playMode, setPlayMode] = useState<'synth' | 'sample'>('synth');
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  const { midiMessages, midiActive } = useMidiInput();

  useEffect(() => {
    if (playMode === 'sample' && !samplesLoaded) {
      preloadSamples().then(() => {
        setSamplesLoaded(true);
        console.log('All samples preloaded');
      });
    }
  }, [playMode, samplesLoaded]);

  useEffect(() => {
    synth.oscillator.type = oscType;
    synth.detune.value = oscFreqOffset * 100;
  }, [oscType, oscFreqOffset]);

  useEffect(() => {
    setVolume(volume);
  }, [volume]);

  const handleKeyDown = useCallback(
    async (note: number) => {
      setActiveNotes((prev) => new Set(prev).add(note));
      await initAudioContext();
      if (playMode === 'synth') {
        playMidiNote(note);
      } else {
        playSampleBuffer(note);
      }
    },
    [playMode]
  );

  const handleKeyUp = useCallback(
    (note: number) => {
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
      if (playMode === 'synth') {
        stopNote();
      }
    },
    [playMode]
  );

  useEffect(() => {
    if (midiMessages.length === 0) return;

    const latest = midiMessages[midiMessages.length - 1];
    if (latest.type === 'noteon') {
      handleKeyDown(latest.note);
    } else if (latest.type === 'noteoff') {
      handleKeyUp(latest.note);
    }
  }, [midiMessages, handleKeyDown, handleKeyUp]);

  const handleDetuneChange = (detuneCents: number) => {
    synth.detune.value = detuneCents;
  };

  return (
    <>
      <SampleToggle mode={playMode} setMode={setPlayMode} />
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
          <div className="vertical-wrapper vertical-wrapper-full-width">
            <div className="horizontal-wrapper">
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
              <Output volume={volume} onSetVolume={setVol} />
            </div>
            <section className="module-section oscilloscope-section accent-purple">
              <Toggle
                labelLeft="OSC"
                labelRight="Mix"
                value={showOscScope ? 'osc' : 'mix'}
                onChange={() => setShowOscScope(!showOscScope)}
              />
              {showOscScope ? (
                <Oscilloscope waveformRef={oscWave} label="Oscillator" />
              ) : (
                <Oscilloscope waveformRef={outWave} label="Mix" />
              )}
            </section>
          </div>
        </div>
        <PianoKeyboard
          octaves={2}
          startNote={playMode === 'sample' ? 24 : 60}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          activeNotes={activeNotes}
          midiActive={midiActive}
        />
      </div>
    </>
  );
};

export default App;
