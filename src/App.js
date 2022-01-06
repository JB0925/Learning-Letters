import './App.css';
import { LetterGameProvider } from './useUpdateLetters';
import GameContainer from './Components/GameContainer';

function App() {
  return (
    <div className="App">
      <LetterGameProvider>
        <GameContainer />
      </LetterGameProvider>
    </div>
  );
}

export default App;
