import './App.css';
import Leaves from './components/Leaves';
import AutumnDuskBackground from './components/AutumnDuskBackground';
import Window from './components/Window';

function App() {
  return (
    <section id="main-container">
      <AutumnDuskBackground>
        <Leaves />
        <Window />
      </AutumnDuskBackground>
    </section>
  );
}

export default App;
