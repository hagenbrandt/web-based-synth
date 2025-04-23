import { useEffect } from 'react';
import { Knob } from './knob';

type FilterSectionProps = {
  cutoff: number;
  setCutoff: (value: number) => void;
  resonance: number;
  setResonance: (value: number) => void;
  onFilterChange: (cutoffHz: number, qValue: number) => void;
};

export const FilterSection = ({
  cutoff,
  setCutoff,
  resonance,
  setResonance,
  onFilterChange,
}: FilterSectionProps) => {
  const minFreq = 30;
  const maxFreq = 10000;

  const minQ = 1;
  const maxQ = 30;

  const cutoffNormalized = (cutoff + 4.5) / 9;
  const scaledCutoff =
    Math.pow(10, cutoffNormalized * Math.log10(maxFreq / minFreq)) * minFreq;

  const resonanceNormalized = resonance / 10;
  const qValue =
    Math.pow(10, resonanceNormalized * Math.log10(maxQ / minQ)) * minQ;

  useEffect(() => {
    onFilterChange(scaledCutoff, qValue);
  }, [scaledCutoff, qValue, onFilterChange]);

  return (
    <section className="module-section filter-section">
      <h2 className="module-section-title">Filter</h2>

      <div className="filter-knobs">
        <div className="synth-control">
          <label htmlFor="cutoff">Cutoff</label>
          <Knob
            id="cutoff"
            value={cutoff}
            min={-4.5}
            max={4.5}
            step={0.5}
            onChange={setCutoff}
          />
          <div className="knob-value">{cutoff.toFixed(1)}</div>
        </div>

        <div className="synth-control">
          <label htmlFor="emphasis">Emphasis</label>
          <Knob
            id="emphasis"
            value={resonance}
            min={0}
            max={10}
            step={0.5}
            onChange={setResonance}
          />
          <div className="knob-value">{resonance.toFixed(1)}</div>
        </div>
      </div>
    </section>
  );
};
