import { Knob } from './knob';

export type OscType = 'sine' | 'triangle' | 'sawtooth' | 'square';

export const OscillatorSection = ({
  oscType,
  oscFreqOffset,
  setOscType,
  setOscFreqOffset,
}: {
  oscType: OscType;
  oscFreqOffset: number;
  setOscType: (type: OscType) => void;
  setOscFreqOffset: (value: number) => void;
}) => {
  return (
    <section className="osc-section">
      <h2 className="osc-section-title">Oscillator</h2>

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
      <label>Frequency</label>
      <Knob
        value={oscFreqOffset}
        min={-24}
        max={24}
        onChange={setOscFreqOffset}
      />
      <div className="knob-value">
        {oscFreqOffset >= 0 ? '+' : ''}
        {oscFreqOffset} st
      </div>
    </section>
  );
};
