import { useState, useCallback, useMemo } from 'react';
import { useMidiInput } from '../hooks/useMidiInput';
import { useMidiActivity } from '../hooks/useMidiActivity';

type PianoKeyboardProps = {
  octaves: number;
  startNote?: number;
  onKeyDown?: (note: number) => void;
  onKeyUp?: (note: number) => void;
  activeNotes?: Set<number>; // optional for highlighting pressed keys
};

const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const SEMITONES_PER_OCTAVE = 12;
const DEFAULT_NUMBER_OF_OCTAVES = 1;
const MIDI_NOTE_C4 = 60;

const getNoteName = (midiNote: number) => {
  const name = NOTE_NAMES[midiNote % SEMITONES_PER_OCTAVE];
  const octave = Math.floor(midiNote / SEMITONES_PER_OCTAVE) - 1;
  return `${name}${octave}`;
};

const isWhiteKey = (midiNote: number) =>
  WHITE_KEYS.includes(midiNote % SEMITONES_PER_OCTAVE);

const ButtonKeyComponent = ({
  note,
  type,
  active,
  label,
  onNoteDown,
  onNoteUp,
}: {
  readonly note: number;
  readonly type: 'white' | 'black';
  readonly active: boolean;
  readonly label: string;
  readonly onNoteDown: (note: number) => void;
  readonly onNoteUp: (note: number) => void;
}) => {
  const handleStart = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onNoteDown(note);
  };

  const handleEnd = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onNoteUp(note);
  };

  return (
    <button
      className={`synth-key-${type} ${active ? 'active' : ''}`}
      aria-pressed={active}
      aria-label={label}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      data-note={note}
    />
  );
};

export const PianoKeyboard = ({
  onKeyDown,
  onKeyUp,
  octaves = DEFAULT_NUMBER_OF_OCTAVES,
  startNote = MIDI_NOTE_C4,
}: PianoKeyboardProps) => {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const { midiActive, triggerMidiActivity } = useMidiActivity();

  const noteRange = useMemo(
    () =>
      Array.from(
        { length: octaves * SEMITONES_PER_OCTAVE },
        (_, i) => startNote + i
      ),
    [octaves, startNote]
  );

  const handleNoteDown = useCallback(
    (note: number) => {
      setActiveNotes((prev) => new Set(prev).add(note));
      onKeyDown?.(note);
    },
    [onKeyDown]
  );

  const handleNoteUp = useCallback(
    (note: number) => {
      setActiveNotes((prev) => {
        const copy = new Set(prev);
        copy.delete(note);
        return copy;
      });
      onKeyUp?.(note);
    },
    [onKeyUp]
  );

  useMidiInput({
    onNoteDown: handleNoteDown,
    onNoteUp: handleNoteUp,
    onActivity: triggerMidiActivity,
    range: noteRange,
  });

  return (
    <div className="keyboard-wrapper">
      <div className="keyboard-side-panel">
        <div className={`midi-indicator ${midiActive ? 'on' : ''}`} />
      </div>
      <div className="synth-keyboard">
        {noteRange.filter(isWhiteKey).map((whiteNote) => {
          const active = activeNotes.has(whiteNote);
          const label = getNoteName(whiteNote);

          const blackNote = whiteNote + 1;
          const showBlack =
            noteRange.includes(blackNote) && !isWhiteKey(blackNote);

          return (
            <div key={whiteNote} className="key-group">
              <ButtonKeyComponent
                note={whiteNote}
                type="white"
                active={active}
                label={label}
                onNoteDown={handleNoteDown}
                onNoteUp={handleNoteUp}
              />

              {showBlack ? (
                <ButtonKeyComponent
                  note={blackNote}
                  type="black"
                  active={activeNotes.has(blackNote)}
                  label={getNoteName(blackNote)}
                  onNoteDown={handleNoteDown}
                  onNoteUp={handleNoteUp}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
