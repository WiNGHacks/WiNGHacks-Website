import { useRef, useState, useEffect } from 'react';
import './App.css';
import './App-mobile.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Banner from './components/pages/Banner'
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import Track from './components/pages/Track';
import Sponsors from './components/pages/Sponsors';
import FAQ from './components/pages/FAQ';
import Login from './components/pages/applications/Login'
import SignUp from './components/pages/applications/SignUp';
import UserPortal from './components/pages/applications/UserPortal';
import Schedule from './components/pages/Schedule';
import Awards from './components/pages/Awards';
import VerificationEmail from './components/pages/applications/VerificationEmail';
import NotifyEmail from './components/pages/applications/NotifyEmail';
import axios from 'axios';
import SendResults from './components/pages/admin/SendResults';
import ForgetPassword from './components/pages/applications/ForgetPassword';
import Footer from './components/Footer';
import GalleryWall from './components/pages/Gallery';
import Leaderboard from './components/pages/Leaderboard';
import Attendance from './components/pages/Attendance';


function App() {

  const ref = useRef({});

  // Used to trigger the backend API to wake up 
  const[firstRender, setFirstRender] = useState(false)

  useEffect(() => {
    if(firstRender === false) {
      setFirstRender(true)
      axios.get(process.env.REACT_APP_TRIGGER_API_URL)
      .then((response) => {
        console.log(response)
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
                      <Banner ref = {ref} />
                      <Home  ref = {ref} />
                      <GalleryWall ref = {ref} />
                      <AboutUs ref = {ref} />
                      {/* <Track ref = {ref} /> */}
                      {/* <Leaderboard ref = {ref} /> */}
                      <Schedule ref = {ref} />
                      {/* <Awards ref = {ref} /> */}
                      <Sponsors  ref = {ref} />
                      <FAQ  ref = {ref} />
                    </>
                  )}
                />
              
              {/* <Route path="/login" element={<Login/>}></Route> */}
              <Route path="/signup" element={<SignUp/>}></Route>
              <Route path="/portal/:id" element={<UserPortal/>}></Route>
              <Route path="/verify/:token" element={<VerificationEmail/>}></Route>
              <Route path="/notify/email/:emailToken" element={<NotifyEmail/>}></Route>
              <Route path="/admin/sendResult/:id" element={<SendResults/>}></Route>
              <Route path="/forgetPassword" element={<ForgetPassword/>}></Route>
              <Route path="/attendance" element={<Attendance/>}></Route>
              
            </Routes> 
            <Footer/>
          </div>
      </Router>
    </div>
  );
}

export default App;
