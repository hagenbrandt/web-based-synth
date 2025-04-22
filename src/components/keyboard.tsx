import { useState, useCallback } from 'react';

const WHITE_MIDI_NOTES = [
  60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83,
] as const;
const BLACK_MIDI_NOTES = [61, 63, 66, 68, 70, 73, 75, 78, 80, 82] as const;

type WhiteNote = (typeof WHITE_MIDI_NOTES)[number];
type BlackNote = (typeof BLACK_MIDI_NOTES)[number];
type MidiNote = WhiteNote | BlackNote;

const noteLabels: Record<MidiNote, string> = {
  60: 'C4',
  61: 'C#4',
  62: 'D4',
  63: 'D#4',
  64: 'E4',
  65: 'F4',
  66: 'F#4',
  67: 'G4',
  68: 'G#4',
  69: 'A4',
  70: 'A#4',
  71: 'B4',
  72: 'C5',
  73: 'C#5',
  74: 'D5',
  75: 'D#5',
  76: 'E5',
  77: 'F5',
  78: 'F#5',
  79: 'G5',
  80: 'G#5',
  81: 'A5',
  82: 'A#5',
  83: 'B5',
};

type PianoKeyboardProps = {
  readonly onNoteDown?: (note: number) => void;
  readonly onNoteUp?: (note: number) => void;
};

const ButtonKeyComponent = ({
  note,
  type,
  active,
  label,
  onNoteDown,
  onNoteUp,
}: {
  readonly note: MidiNote;
  readonly type: 'white' | 'black';
  readonly active: boolean;
  readonly label: string;
  readonly onNoteDown: (note: MidiNote) => void;
  readonly onNoteUp: (note: MidiNote) => void;
}) => {
  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    onNoteUp(note);
    e.currentTarget.blur();
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    onNoteUp(note);
    e.currentTarget.blur();
  };

  return (
    <button
      className={`synth-key-${type} ${active ? 'active' : ''}`}
      aria-pressed={active}
      aria-label={label}
      onMouseDown={() => onNoteDown(note)}
      onMouseUp={() => onNoteUp(note)}
      onMouseLeave={() => onNoteUp(note)}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onTouchStart={() => onNoteDown(note)}
      onTouchEnd={() => onNoteUp(note)}
      data-note={note}
    />
  );
};

export const PianoKeyboard = ({ onNoteDown, onNoteUp }: PianoKeyboardProps) => {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  const handleNoteDown = useCallback(
    (note: number) => {
      setActiveNotes((prev) => new Set(prev).add(note));
      onNoteDown?.(note);
    },
    [onNoteDown]
  );

  const handleNoteUp = useCallback(
    (note: number) => {
      setActiveNotes((prev) => {
        const copy = new Set(prev);
        copy.delete(note);
        return copy;
      });
      onNoteUp?.(note);
    },
    [onNoteUp]
  );

  const isBlackMidiNote = (
    note: number
  ): note is (typeof BLACK_MIDI_NOTES)[number] => {
    return BLACK_MIDI_NOTES.includes(note as BlackNote);
  };

  return (
    <div className="synth-keyboard">
      {WHITE_MIDI_NOTES.map((whiteNote) => {
        const active = activeNotes.has(whiteNote);
        const label = noteLabels[whiteNote] || `MIDI ${whiteNote}`;

        const hasSharp = [60, 62, 65, 67, 69, 72, 74, 77, 79, 81].includes(
          whiteNote
        );
        const blackNote = whiteNote + 1;
        const showBlack = isBlackMidiNote(blackNote);

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

            {hasSharp && showBlack ? (
              <ButtonKeyComponent
                note={blackNote}
                type="black"
                active={activeNotes.has(blackNote)}
                label={noteLabels[blackNote]}
                onNoteDown={handleNoteDown}
                onNoteUp={handleNoteUp}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
