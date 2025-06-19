import { useEffect, useRef, useState } from 'react';

export type MidiMessage = {
  note: number;
  velocity: number;
  type: 'noteon' | 'noteoff';
};

export const useMidiInput = () => {
  const [midiMessages, setMidiMessages] = useState<MidiMessage[]>([]);
  const [midiActive, setMidiActive] = useState(false);
  const midiActivityTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (!navigator.requestMIDIAccess) return;

    navigator
      .requestMIDIAccess()
      .then((access) => {
        access.inputs.forEach((input) => {
          input.onmidimessage = (message) => {
            const [status, note, velocity] = message.data || [];
            const command = status & 0xf0;

            if (note == null || velocity == null) return;

            setMidiActive(true);
            if (midiActivityTimeout.current)
              clearTimeout(midiActivityTimeout.current);
            midiActivityTimeout.current = setTimeout(() => {
              setMidiActive(false);
            }, 100);

            if (command === 0x90 && velocity > 0) {
              setMidiMessages((prev) => [
                ...prev,
                { note, velocity, type: 'noteon' },
              ]);
            } else if (
              command === 0x80 ||
              (command === 0x90 && velocity === 0)
            ) {
              setMidiMessages((prev) => [
                ...prev,
                { note, velocity, type: 'noteoff' },
              ]);
            }
          };
        });
      })
      .catch((err) => {
        console.error('Failed to access MIDI devices:', err);
      });
  }, []);

  return {
    midiMessages,
    midiActive,
  };
};
