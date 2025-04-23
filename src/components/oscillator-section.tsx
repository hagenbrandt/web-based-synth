import { useEffect } from 'react';
import { Knob } from './knob';

export type OscType = 'sine' | 'triangle' | 'sawtooth' | 'square';

export const OscillatorSection = ({
  oscType,
  oscFreqOffset,
  setOscType,
  setOscFreqOffset,
  onDetuneChange,
}: {
  oscType: OscType;
  oscFreqOffset: number;
  setOscType: (type: OscType) => void;
  setOscFreqOffset: (value: number) => void;
  onDetuneChange: (detuneCents: number) => void;
}) => {
  const detune = oscFreqOffset * 100;

  useEffect(() => {
    onDetuneChange(detune);
  }, [detune, onDetuneChange]);

  return (
    <section className="module-section osc-section">
      <h2 className="module-section-title">Oscillator</h2>

      <div className="osc-control">
        <label className="sr-only" htmlFor="osc-type">
          Waveform
        </label>
        <select
          id="osc-type"
          className="osc-type-select"
          value={oscType}
          onChange={(e) => setOscType(e.target.value as OscType)}
        >
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="square">Square</option>
        </select>
      </div>
      <label htmlFor="frequency">Frequency</label>
      <Knob
        id="frequency"
        value={oscFreqOffset}
        min={-4.5}
        max={4.5}
        step={0.5}
        onChange={setOscFreqOffset}
      />
      <div className="knob-value">
        {oscFreqOffset >= 0 ? '+' : ''}
        {oscFreqOffset.toFixed(1)} st
      </div>
    </section>
  );
};
