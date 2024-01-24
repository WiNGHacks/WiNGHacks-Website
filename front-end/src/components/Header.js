import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
import logo from './pictures/littleLady.png'

const Header = () => {
  return (
    // <div className = "navbar">

    //   <Link to="/" className = "logo-container">
    //     <img src={logo} alt="Logo"/>
    //     <b className='image-text'>WiNGHacks</b>
    //   </Link>

    //   <div className = "links">
    //     <Link to="/aboutus" className = "link">About Us</Link>
    //     <Link to="/sponsors" className = "link">Sponsors</Link>
    //     <Link to="/faq" className = "link">FAQ</Link>

    //     <Link to="/faq" className = "link">Apply Now</Link> 
    //   </div>
    // </div> 

    <div className = "navbar">

      <Link to="/" className = "logo-container">
        <img src={logo} alt="Logo"/>
        <b className='image-text'>WiNGHacks</b>
      </Link>

      <div className = "links">
        <div className = "link">About Us</div>
        <div className = "link">Sponsors</div>
        <div className = "link">FAQ</div>

        {/* PlaceHolder for now Update Later */}
        <div className = "link" >Apply Now</div> 
      </div>


    </div> 
    
  )
}

export default Header