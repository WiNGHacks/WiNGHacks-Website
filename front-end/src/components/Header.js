import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
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
    
        <div className = "links">

            { token ?

                (
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/aboutus">About Us</Link>
                    <Link to="/sponsors">Sponsors</Link>
                    <Link to="/faq">FAQ</Link>

                    {/* PlaceHolder for now Update Later */}
                    {/* <Link to="/portal">Portal</Link>  */}
                    <a style={{textDecoration: 'underline'}} onClick={portalClick}>Portal</a>
                    <a style={{textDecoration: 'underline'}} onClick={logoutClick}>Logout</a>
                    
                </div>
                )
                :
                ( 
                <div>
                    <div>
                    <Link to="/">Home</Link>
                    <Link to="/aboutus">About Us</Link>
                    <Link to="/sponsors">Sponsors</Link>
                    <Link to="/faq">FAQ</Link>

                    {/* PlaceHolder for now Update Later */}
                    <Link to="/login">Apply Now</Link> 
                  
                </div>

                </div>
                )

            }   
        </div> 
  )
}

export default Header