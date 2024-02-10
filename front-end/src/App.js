import { useRef, useState, useEffect } from 'react';
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
import Schedule from './components/pages/Schedule';

import VerificationEmail from './components/pages/applications/VerificationEmail';
import NotifyEmail from './components/pages/applications/NotifyEmail';
import axios from 'axios';

function App() {

  const ref = useRef({});

  // Used to trigger the backend API to wake up 
  const[firstRender, setFirstRender] = useState(false)

  useEffect(() => {
    if(firstRender === false) {
      setFirstRender(true)
      axios.get(process.env.REACT_APP_TRIGGER_API_URL)
      .then((response) => {
        // console.log(response)
      })
      .catch(error => {
        // console.log(error)
      })
    }
    // console.log(firstRender)
  })

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
              <Route path="/verify/:token" element={<VerificationEmail/>}></Route>
              <Route path="/notify/email/:emailToken" element={<NotifyEmail/>}></Route>
              
            </Routes> 
          </div>
      </Router>
    </div>
  );
}

export default App;
