type KnobProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export const Knob = ({ value, min, max, step = 1, onChange }: KnobProps) => {
  const percent = (value - min) / (max - min);
  const rotation = percent * 270 - 135;

  return (
    <div className="knob-wrapper">
      <input
        type="range"
        className="knob-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className="knob-face">
        <div
          className="knob-indicator"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="knob-line" />
        </div>
      </div>
    </div>
  );
};
