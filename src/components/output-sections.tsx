import { Knob } from './knob';

type OutputProps = {
  volume: number;
  onSetVolume: (value: number) => void;
};

export const Output = ({ volume, onSetVolume }: OutputProps) => (
  <section className="module-section output-panel">
    <h2 className="module-section-title">Output</h2>
    <div className="volume-control accent-red">
      <label className="volume-control-label" htmlFor="volume">
        Volume
      </label>
      <Knob
        id="volume"
        value={volume}
        min={-48}
        max={0}
        step={1}
        onChange={onSetVolume}
      />
    </div>
  </section>
);
