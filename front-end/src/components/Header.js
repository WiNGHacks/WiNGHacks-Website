import { useSession } from "./auth/SessionProvider";
import React, {useState, forwardRef} from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from "react-icons/fa";
import logo from './pictures/2026_Logos/logo.png'
import Popup from './pages/Popup'
import AppCountDown from './AppCountDown';
import { FaDiscord, FaInstagram, FaLinkedin} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";


const Header = (_, ref) => {
    const { isSignedIn, signOut } = useSession();
    const logoutClick = () => {
      setShowNavbar(false);
      signOut();
    };

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
      <div style={{position: "relative"}}>
      <div className = "navbar" id='navbar'>

      <Link to = "/#home"  onClick={() => handleClick('home')} className = "logo-container">
        <img src={logo} alt="Logo"/>
        {/* <b className='image-text'>WiNGHacks</b> */}
      </Link>
      
      <div className = {showNavbar ? "links links-open" : "links"}>
      <a id="mlh-trust-badge" className='mlh-banner-mobile' 
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue" 
        target="_blank">
          <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-blue.svg" 
              alt="Major League Hacking 2024 Hackathon Season" style={{width:100 + '%'}}/>
      </a>
        <Link to = "/#home"  onClick={() => handleClick('home')} className = "link">Home</Link>
        <Link to = "/#sponsor"  onClick={() => handleClick('sponsor')} className = "link">Sponsors</Link>
        {/* <a href="https://discord.gg/8HSuT7gK" target="_blank" rel="noopener noreferrer" className="link">
          <FaDiscord />
        </a> */}
        <a href="https://www.instagram.com/winghacks?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="link">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com/company/winghacks" target="_blank" rel="noopener noreferrer" className="link">
            <FaLinkedin className='icons'/>
        </a>
        {/* <a href="mailto: uf.winghacks@gmail.com" target="_blank" rel="noopener noreferrer" className="link">
          <IoMdMail className='icons'/>
        </a> */}
        {/* <a href="https://docs.google.com/forms/d/e/1FAIpQLSdusvJ_vntBDq33Dqx5DgR0LXx7So5OtFqxHxqETg2j1qWn0Q/viewform" target="_blank" rel="noopener noreferrer" className="link">
          Apply
        </a> */}

        
        {/* <Link to = "/#gallerywall"  onClick={() => handleClick('gallerywall')} className = "link">Gallery</Link>
        <Link to = "/#about"  onClick={() => handleClick('about')} className = "link">About Us</Link>
        <Link to = "/#track" onClick={() => handleClick('track')} className = "link">Track</Link>
        <Link to = "/#schedule" onClick={() => handleClick('schedule')} className = "link">Schedule</Link>
        <Link to = "/#awards" onClick={() => handleClick('awards')} className = "link">Awards</Link>
        <Link to = "/#sponsor" onClick={() => handleClick('sponsor')} className = "link">Sponsors</Link>
        <Link to = "/#faq" onClick={() => handleClick('faq')} className = "link">FAQ</Link>
        <Link to = "/attendance" onClick={() => handleClick('attendance')} className = "link">Attendance</Link> */}
        

          {isSignedIn && <div className="dynamic lessSpace">
            <Link to="/portal" className="link" onClick={() => setShowNavbar(false)}>Portal</Link>
            <a href="/login" className="link" onClick={event => { event.preventDefault(); logoutClick(); }}>Logout</a>
          </div>}

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
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue" 
        target="_blank">
          <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-blue.svg" 
              alt="Major League Hacking 2024 Hackathon Season" style={{width:100 + '%'}}/>
      </a>
    </div>
    {!isSignedIn && openBanner &&
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
