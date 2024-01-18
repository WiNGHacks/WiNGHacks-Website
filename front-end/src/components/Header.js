import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className = "links">
        <Link to="/">Home</Link>
        <Link to="/aboutus">About Us</Link>
        <Link to="/sponsors">Sponsors</Link>
        <Link to="/faq">FAQ</Link>

        {/* PlaceHolder for now Update Later */}
        <Link to="/faq">Apply Now</Link> 
    </div> 
  )
}

export default Header