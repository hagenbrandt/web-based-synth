import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export const useOscilloscope = (
  analyser: Tone.Analyser
): React.RefObject<Float32Array> => {
  const waveformRef = useRef<Float32Array>(new Float32Array(analyser.size));

  useEffect(() => {
    let animationId: number;

    const update = () => {
      const values = analyser.getValue();

      if (Array.isArray(values)) {
        waveformRef.current.set(values[0]);
      } else if (values instanceof Float32Array) {
        waveformRef.current.set(values);
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationId);
  }, [analyser]);

  return waveformRef;
};
