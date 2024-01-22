import React from 'react'
import { Link } from 'react-router-dom'
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Header = () => {
    const token = cookies.get("TOKEN");
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
                    {/* <Link to="/login">Apply Now</Link> */}
                    <Link to="/portal/:id">Portal</Link> 
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