import { useEffect } from 'react';

export type Envelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

type EnvelopeAction = {
  setAttack: (value: number) => void;
  setDecay: (value: number) => void;
  setSustain: (value: number) => void;
  setRelease: (value: number) => void;
};

type Props = Envelope &
  EnvelopeAction & {
    onEnvelopeChange: (env: Envelope) => void;
  };

type EnvelopeItem = {
  label: 'A' | 'D' | 'S' | 'R';
  value: number;
  set: (value: number) => void;
  min: number;
  max: number;
  step: number;
  accent: string;
};

export function EnvelopeSection({
  attack,
  decay,
  sustain,
  release,
  setAttack,
  setDecay,
  setSustain,
  setRelease,
  onEnvelopeChange,
}: Props) {
  useEffect(() => {
    onEnvelopeChange({ attack, decay, sustain, release });
  }, [attack, decay, sustain, release, onEnvelopeChange]);

  const envItems = [
    {
      label: 'A',
      value: attack,
      set: setAttack,
      min: 0,
      max: 5,
      step: 0.1,
      accent: '',
    },
    {
      label: 'D',
      value: decay,
      set: setDecay,
      min: 0,
      max: 5,
      step: 0.1,
      accent: 'accent-blue',
    },
    {
      label: 'S',
      value: sustain,
      set: setSustain,
      min: 0,
      max: 1,
      step: 0.05,
      accent: 'accent-purple',
    },
    {
      label: 'R',
      value: release,
      set: setRelease,
      min: 0,
      max: 5,
      step: 0.1,
      accent: 'accent-red',
    },
  ] satisfies EnvelopeItem[];

  return (
    <section className="module-section envelope-section">
      <h2 className="synth-section-title">Envelope</h2>
      <div className="envelope-sliders">
        {envItems.map(({ accent, label, value, set, min, max, step }) => (
          <div className={`slider-control ${accent}`} key={label}>
            <label>{label}</label>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(parseFloat(e.target.value))}
              className="vertical-slider"
            />
            <div className="slider-value">{value.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
