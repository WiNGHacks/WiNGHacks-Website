import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import Sponsors from './components/pages/Sponsors';
import FAQ from './components/pages/FAQ';
import Login from './components/pages/applications/Login'
import SignUp from './components/pages/applications/SignUp';


function App() {
  return (
    <div className='app'>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/aboutus" element={<AboutUs/>}></Route>
          <Route path="/sponsors" element={<Sponsors/>}></Route>
          <Route path="/faq" element={<FAQ/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
