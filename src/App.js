import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from './components/auth';
import { DC } from './components/daily_challenge';
import { Start } from './components/start'
import { Circle } from './components/circle'
import { CircularSlider } from './components/circ-slider'




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* The inital screen is "/" */}
          <Route path="/" element={<CircularSlider />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/daily_challenge" element={<DC />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
