import './App.css'
import Leaves from './components/Leaves'
import AutumnDuskBackground from './components/AutumnDuskBackground'

function App() {
  return (
    <section id="main-container">
      <AutumnDuskBackground>
        <Leaves />
      </AutumnDuskBackground>
    </section>
  )
}

export default App
