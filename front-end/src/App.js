import { useRef, lazy, Suspense } from "react";
import "./App.css";
import "./App-mobile.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import MeadowHome from "./components/pages/MeadowHome";

const Header = lazy(() => import("./components/Header"));
const SignUp = lazy(() => import("./components/pages/applications/SignUp"));
const UserPortal = lazy(() => import("./components/pages/applications/UserPortal"));
const VerificationEmail = lazy(() => import("./components/pages/applications/VerificationEmail"));
const NotifyEmail = lazy(() => import("./components/pages/applications/NotifyEmail"));

const SendResults = lazy(() => import("./components/pages/admin/SendResults"));
const ForgetPassword = lazy(() => import("./components/pages/applications/ForgetPassword"));
const Footer = lazy(() => import("./components/Footer"));
const Attendance = lazy(() => import("./components/pages/Attendance"));

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

  return (
    <div className="app">
      <Router>
        <Suspense fallback={<p role="status">Loading…</p>}>
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
      </Suspense>
      </Router>
    </div>
  );
}

export default App;
