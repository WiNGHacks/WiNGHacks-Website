import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import Sponsors from './components/pages/Sponsors';
import FAQ from './components/pages/FAQ';


function App() {
  return (
    <div className='app'>
      <Router>
        <Header />
        <div className = "App">
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/aboutus" element={<AboutUs/>}></Route>
          <Route path="/sponsors" element={<Sponsors/>}></Route>
          <Route path="/faq" element={<FAQ/>}></Route>
        </Routes>
        </div>
      </Router>

    </div>
  );
}

export default App;
