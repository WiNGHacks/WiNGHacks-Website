import React, {useState, forwardRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from '../pictures/WiNGHacks_logo.png'
import Popup from './pages/Popup'
import AppCountDown from './AppCountDown';

const cookies = new Cookies();

const Header = ({}, ref) => {
    const token = cookies.get("TOKEN");
    const currentPath = window.location.pathname   
    let navigate = useNavigate();

    const adminClick = () => {
      setShowNavbar(false);

      const decoded = jwtDecode(token)
      navigate(`/admin/sendResult/${decoded.id}`, {replace: true});
    }

    const portalClick = () => {
      setShowNavbar(false);

      const decoded = jwtDecode(token)
      navigate(`/portal/${decoded.id}`, {replace: true});
    }

    const logoutClick = () => {
      setShowNavbar(false);

      if (window.confirm('Are you sure you want to logout?')) {
        cookies.remove("TOKEN", {
          path: "/",
        })
        window.location.replace('/login');
      }
      
    }

    const [showNavbar, setShowNavbar] = useState(false);

    const [openBanner, setOpenBanner] = useState(true)

    const handleClick = (type) => {
      var currHeight = document.getElementById('navbar').offsetHeight + 10;
      // console.log(currHeight);
      // var topVar = -currHeight? + ref?.current[type]?.offsetTop;
      // console.log(type)
      window.scrollTo({
        top: ref?.current[type]?.offsetTop - currHeight + 100,
        left: 0,
        behavior: "smooth",
      });

      setShowNavbar(false);

    }
    const clickedNavbar = () => {
      setShowNavbar(!showNavbar);
    };

    var currNavbarHeight = document?.getElementById('navbar')?.offsetHeight;

    return (
      <div style={{position: + "relative"}}>
        {/* {console.log(currentPath)} */}
      {token || currentPath === "/login" || currentPath === "/signup" || currentPath === "/forgetPassword" ? (<div/>) : (<Popup/>)}
      <div className = "navbar" id='navbar'>

      <Link to = "/#home"  onClick={() => handleClick('home')} className = "logo-container">
        <img src={logo} alt="Logo"/>
        {/* <b className='image-text'>WiNGHacks</b> */}
      </Link>
      <div className = {showNavbar ? "links links-open" : "links"}>
      <a id="mlh-trust-badge" className='mlh-banner-mobile' 
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2024-season&utm_content=blue" 
        target="_blank">
          <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2025/mlh-trust-badge-2025-blue.svg" 
              alt="Major League Hacking 2024 Hackathon Season" style={{width:100 + '%'}}/>
      </a>
        <Link to = "/#gallerywall"  onClick={() => handleClick('gallerywall')} className = "link">Gallery</Link>
        <Link to = "/#about"  onClick={() => handleClick('about')} className = "link">About Us</Link>
        <Link to = "/#schedule" onClick={() => handleClick('schedule')} className = "link">Schedule</Link>
        <Link to = "/#awards" onClick={() => handleClick('awards')} className = "link">Awards</Link>
        <Link to = "/#sponsor" onClick={() => handleClick('sponsor')} className = "link">Sponsors</Link>
        <Link to = "/#faq" onClick={() => handleClick('faq')} className = "link">FAQ</Link>
        

          { token ?
            ( 
              <div>
                {/* {console.log(jwtDecode(token).admin)} */}
                {jwtDecode(token).admin ? (
                  <div>
                    <div className = "link" onClick={adminClick}>Admin</div>
                    <div to="/login" className = "link" onClick={logoutClick}>Logout</div>
                  </div>
                
                ):(
                  <div className='dynamic lessSpace'>
                      <div className = "link" onClick={portalClick}>Portal</div>
                      <div to="/login" className = "link" onClick={logoutClick}>Logout</div>
                  </div> 

                )}
               
              </div>
            )
            :
            ( <div className='dynamic'>
                <Link to="/login" className = "link" onClick={clickedNavbar}>Login</Link>
                <Link to={process.env.REACT_APP_APPLICATION_FORM} target="_blank" className = "link apply button-glow" onClick={clickedNavbar}>Apply Now</Link>
              </div> )
          }
          
          <div className='mobile-nav'>
          {showNavbar ? 
          ( <button className="nav-btn close" onClick={clickedNavbar}> 
            <FaTimes /> </button> ) : 
            (<button className="nav-btn open" onClick={clickedNavbar}>
            <FaBars /> </button>  )
          }
        </div>
      </div>
      

    </div> 
    <div>
    <a id="mlh-trust-badge" className='mlh-banner' 
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2024-season&utm_content=blue" 
        target="_blank">
          <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2025/mlh-trust-badge-2025-blue.svg" 
              alt="Major League Hacking 2024 Hackathon Season" style={{width:100 + '%'}}/>
      </a>
    </div>
    {!token && openBanner &&
    <div>
      {/* <div className='application-banner'>Applications are now open!</div>  */}
        {/* <div className='application-banner'>
          <AppCountDown/>
        <div>
    </div>
   
    </div>  */}
  </div>    }
      
  </div>
  )
}

export default forwardRef(Header)