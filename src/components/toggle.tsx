type ToggleProps = {
  labelLeft: string;
  labelRight: string;
  value: 'osc' | 'mix';
  onChange: (val: 'osc' | 'out') => void;
};

export const Toggle = ({
  labelLeft,
  labelRight,
  value,
  onChange,
}: ToggleProps) => (
  <div className="osc-toggle-wrapper">
    <span className={`toggle-label ${value === 'osc' ? 'active' : ''}`}>
      {labelLeft}
    </span>
    <button
      className="osc-toggle"
      role="switch"
      aria-checked={value === 'mix'}
      onClick={() => onChange(value === 'osc' ? 'out' : 'osc')}
    >
      <div className="osc-toggle-thumb" />
    </button>
    <span className={`toggle-label ${value === 'mix' ? 'active' : ''}`}>
      {labelRight}
    </span>
  </div>
);
