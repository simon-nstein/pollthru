import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from './components/auth';
import { DC } from './components/daily_challenge';
import { Start } from './components/start'


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* The inital screen is "/" */}
          <Route path="/" element={<Start />} /> 
          <Route path="/login" element={<Auth />} />
          <Route path="/daily_challenge" element={<DC />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
