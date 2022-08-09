import { Routes, Route } from 'react-router-dom';
import NavBar from "./Components/NavBar/NavBar";
import Clock from './Pages/Clock/Clock';
import CountDown from './Pages/CountDown/CountDown';
import StopWatch from './Pages/StopWatch/StopWatch';
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="AppWrap">
        <NavBar />
        <Routes>
          <Route path='/' element={<Clock />} />
          <Route path='/clock' element={<Clock />} />
          <Route path='/count-down' element={<CountDown />} />
          <Route path='/stop-watch' element={<StopWatch />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;
