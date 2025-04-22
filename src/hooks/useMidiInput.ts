import { useEffect } from 'react';

import { type MidiNote } from '../components/keyboard';

export function useMidiInput({
  onNoteDown,
  onNoteUp,
  range,
}: {
  onNoteDown: (note: number) => void;
  onNoteUp: (note: number) => void;
  range?: number[];
}) {
  useEffect(() => {
    if (!navigator.requestMIDIAccess) return;

    navigator
      .requestMIDIAccess()
      .then((access) => {
        for (const input of access.inputs.values()) {
          input.onmidimessage = (message) => {
            if (!message.data) return;

            const [status, note, velocity] = message.data;
            const command = status & 0xf0;
            const isNoteInRange = range ? range.includes(note) : true;

            if (command === 0x90 && velocity > 0 && isNoteInRange) {
              onNoteDown(note as MidiNote);
            } else if (
              command === 0x80 ||
              (command === 0x90 && velocity === 0)
            ) {
              onNoteUp(note as MidiNote);
            }
          };
        }
      })
      .catch((err) => {
        console.error('Failed to access MIDI devices:', err);
      });
  }, [onNoteDown, onNoteUp, range]);
}
