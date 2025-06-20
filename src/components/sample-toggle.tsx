export type SynthMode = 'synth' | 'sample';

type SampleToggleProps = {
  mode: SynthMode;
  setMode: (mode: SynthMode) => void;
};

export const SampleToggle = ({ mode, setMode }: SampleToggleProps) => (
  <div className="toggle-wrapper">
    <label className="toggle-label">
      <input
        type="checkbox"
        checked={mode === 'sample'}
        onChange={() => setMode(mode === 'synth' ? 'sample' : 'synth')}
      />
      <span className="toggle-slider" />
    </label>
    <div className="toggle-text">
      <span className={mode === 'synth' ? 'active' : ''}>Synth</span>
      <span className={mode === 'sample' ? 'active' : ''}>Sample</span>
    </div>
  </div>
);
