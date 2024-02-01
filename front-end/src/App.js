import { useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import Sponsors from './components/pages/Sponsors';
import FAQ from './components/pages/FAQ';
import Login from './components/pages/applications/Login'
import SignUp from './components/pages/applications/SignUp';
import UserPortal from './components/pages/applications/UserPortal';
import Cookies from "universal-cookie";
import Schedule from './components/pages/Schedule';
const cookies = new Cookies();

function App() {

  const ref = useRef({});

  return (
    <div className='app'>
      
        <Router>
          <Header ref = {ref} />
          <div className = "App">
            <Routes>
                <Route
                  path="/"
                  element={(
                    <>
                      <Home  ref = {ref} />
                      <AboutUs ref = {ref} />
                      <Schedule ref = {ref} />
                      <Sponsors  ref = {ref} />
                      <FAQ  ref = {ref} />
                    </>
                  )}
                />
              
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/signup" element={<SignUp/>}></Route>
              <Route path="/portal/:id" element={<UserPortal/>}></Route>
              
            </Routes> 
          </div>
      </Router>
    </div>
  );
}

export default App;
