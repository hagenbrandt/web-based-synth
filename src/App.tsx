import * as Tone from 'tone';
import { PianoKeyboard } from './components/keyboard';
import './styles/main.css';

const synth = new Tone.Synth().toDestination();

function App() {
  const handleNoteDown = async (note: number) => {
    await Tone.start();
    const freq = Tone.Frequency(note, 'midi').toFrequency();
    synth.triggerAttack(freq);
  };

  const handleNoteUp = () => {
    synth.triggerRelease();
  };

  return (
    <div className="synth-wrapper">
      <PianoKeyboard onNoteDown={handleNoteDown} onNoteUp={handleNoteUp} />
    </div>
  );
}

export default App;
