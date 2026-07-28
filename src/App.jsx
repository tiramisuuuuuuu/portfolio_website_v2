import './App.css';
import Leaves from './components/Leaves';
import AutumnDuskBackground from './components/AutumnDuskBackground';
import DesktopIcons from './components/DesktopIcons';

function App() {
  return (
    <section id="main-container">
      <AutumnDuskBackground>
        <Leaves />
        <DesktopIcons />
      </AutumnDuskBackground>
    </section>
  );
}

export default App;
