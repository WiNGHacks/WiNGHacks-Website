import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import '../App.css';
import logo from './pictures/littleLady.png'

const cookies = new Cookies();

const Header = () => {
    const token = cookies.get("TOKEN");

    let navigate = useNavigate();

    const portalClick = () => {
        const decoded = jwtDecode(token)
        navigate(`/portal/${decoded.id}`, {replace: true});
    }

    const logoutClick = () => {
        cookies.remove("TOKEN", {
            path: "/",
        })
        window.location.replace('/login');
    }


    return (
      <div className = "navbar">

      <Link to="/" className = "logo-container">
        <img src={logo} alt="Logo"/>
        <b className='image-text'>WiNGHacks</b>
      </Link>

      <div className = "links">
        <Link to="/aboutus" className = "link">About Us</Link>
        <Link to="/sponsors" className = "link">Sponsors</Link>
        <Link to="/faq" className = "link">FAQ</Link>
          { token ?
            (
              <div>
                {/* PlaceHolder for now Update Later */}
                {/* <Link to="/portal">Portal</Link>  */}
                <a style={{textDecoration: 'underline'}} onClick={portalClick}>Portal</a>
                <a style={{textDecoration: 'underline'}} onClick={logoutClick}>Logout</a>
              </div>
            )
            :
            ( <Link to="/login" className = "link">Apply Now</Link> )
          }

      </div>
    </div> 

    // <div className = "navbar">

    //   <Link to="/" className = "logo-container">
    //     <img src={logo} alt="Logo"/>
    //     <b className='image-text'>WiNGHacks</b>
    //   </Link>

    //   <div className = "links">
    //     <div className = "link">About Us</div>
    //     <div className = "link">Sponsors</div>
    //     <div className = "link">FAQ</div>

    //     {/* PlaceHolder for now Update Later */}
    //     <div className = "link" >Apply Now</div> 
    //   </div>

    // </div> 
    
  )
}

export default Header