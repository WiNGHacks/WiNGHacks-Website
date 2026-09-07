import { useRef, useState, useEffect } from "react";
import "./App.css";
import "./App-mobile.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import MeadowHome from "./components/pages/MeadowHome";
import SignUp from "./components/pages/applications/SignUp";
import UserPortal from "./components/pages/applications/UserPortal";
import VerificationEmail from "./components/pages/applications/VerificationEmail";
import NotifyEmail from "./components/pages/applications/NotifyEmail";
import axios from "axios";
import SendResults from "./components/pages/admin/SendResults";
import ForgetPassword from "./components/pages/applications/ForgetPassword";
import Footer from "./components/Footer";
import Attendance from "./components/pages/Attendance";

function LegacyHeader({ headerRef }) {
  const { pathname } = useLocation();
  return pathname === "/" ? null : <Header ref={headerRef} />;
}
function LegacyFooter() {
  const { pathname } = useLocation();
  return pathname === "/" ? null : <Footer />;
}

function App() {
  const ref = useRef({});

  // Used to trigger the backend API to wake up
  const [firstRender, setFirstRender] = useState(false);

  useEffect(() => {
    if (firstRender === false) {
      setFirstRender(true);
      axios
        .get(process.env.REACT_APP_TRIGGER_API_URL)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          // console.log(error)
        });
    }
    // console.log(firstRender)
  });

  return (
    <div className="app">
      <Router>
        <LegacyHeader headerRef={ref} />
        <div className="App">
          <Routes>
            <Route path="/" element={<MeadowHome />} />

            {/* <Route path="/login" element={<Login/>}></Route> */}
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/portal/:id" element={<UserPortal />}></Route>
            <Route
              path="/verify/:token"
              element={<VerificationEmail />}
            ></Route>
            <Route
              path="/notify/email/:emailToken"
              element={<NotifyEmail />}
            ></Route>
            <Route
              path="/admin/sendResult/:id"
              element={<SendResults />}
            ></Route>
            <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
            <Route path="/attendance" element={<Attendance />}></Route>
          </Routes>
          <LegacyFooter />
        </div>
      </Router>
    </div>
  );
}

export default App;
