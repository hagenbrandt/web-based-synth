import { useRef, useState, useCallback } from 'react';

export const useMidiActivity = (timeoutMs = 120) => {
  const [midiActive, setMidiActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerMidiActivity = useCallback(() => {
    setMidiActive(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setMidiActive(false);
    }, timeoutMs);
  }, [timeoutMs]);

  return {
    midiActive,
    triggerMidiActivity,
  };
};
