import React, {useState, forwardRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import '../App.css';
import logo from './pictures/WiNGHACKS_logo.png'



const cookies = new Cookies();

const Header = ({}, ref) => {
    const token = cookies.get("TOKEN");

    let navigate = useNavigate();

    const portalClick = () => {
        const decoded = jwtDecode(token)
        navigate(`/portal/${decoded.id}`, {replace: true});
    }

    const logoutClick = () => {
      if (window.confirm('Are you sure you want to logout?')) {
        cookies.remove("TOKEN", {
          path: "/",
        })
        window.location.replace('/login');
      }
      
    }

    const handleClick = (type) => {
      var currHeight = document.getElementById('navbar').offsetHeight + 10;
      // console.log(currHeight);
      // var topVar = -currHeight? + ref?.current[type]?.offsetTop;
      // console.log(type)
      window.scrollTo({
        top: ref?.current[type]?.offsetTop - currHeight,
        left: 0,
        behavior: "smooth",
      });
    }


    return (
      
      <div className = "navbar" id='navbar'>
      <Link to = "/#home"  onClick={() => handleClick('home')} className = "logo-container">
        <img src={logo} alt="Logo"/>
        {/* <b className='image-text'>WiNGHacks</b> */}
      </Link>

      <div className = "links">
        <Link to = "/#about"  onClick={() => handleClick('about')} className = "link">About Us</Link>
        <Link to = "/#schedule" onClick={() => handleClick('schedule')} className = "link">Schedule</Link>
        <Link to = "/#sponsor" onClick={() => handleClick('sponsor')} className = "link">Sponsors</Link>
        <Link to = "/#faq" onClick={() => handleClick('faq')} className = "link">FAQ</Link>
        

         
      </div>

    </div> 



// { token ?
//   (
//     <div>
//       {/* PlaceHolder for now Update Later */}
//       {/* <Link to="/portal">Portal</Link>  */}
//       <div className = "link" onClick={portalClick}>Portal</div>
//       <div to="/login" className = "link" onClick={logoutClick}>Logout</div>
//       {/* <a style={{textDecoration: 'underline'}} onClick={portalClick}>Portal</a>
//       <a style={{textDecoration: 'underline'}} onClick={logoutClick}>Logout</a> */}
//     </div>
//   )
//   :
//   ( 
//     <div className='links dynamic'>
//       <Link to="/login" className = "link">Login</Link>
//       <Link to="/signup" className = "link apply">Apply Now</Link>
//     </div> 
//   )
// }


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

export default forwardRef(Header)