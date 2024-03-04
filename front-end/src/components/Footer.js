import React, { useState, useEffect } from 'react';
import { FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import logo from './pictures/WiNGHACKS_logo.png'

const Footer = () => {

    return (
        <div className="footer-container">
            <div className='divider'/>
            <div className='footer-content'>
                <img src = {logo} className='image'></img>
                <div/>
                <div className='column'>
                    <div className='text'>Made with ♥ by the WiNGHacks team</div>
                    <a href="signup" className='link'>Hacker Applications</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSeTqVfJUiWjjARDFBh1MkegBLw0F-Kd-GquU2NJO1-H7ybOuQ/viewform"
                        target="_blank" className='link'>Mentor Applications</a>
                    <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" style={{color: "black", fontWeight: "bold"}} target="_blank">MLH Code of Conduct</a>
                    <div className='socials'>
                        <a href="https://www.instagram.com/winghacks/" target="_blank" rel="noopener noreferrer">
                            <FaSquareInstagram className='icons'/>
                        </a>
                        <a href="https://www.linkedin.com/company/winghacks" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className='icons'/>
                        </a>
                        <a href="mailto:uf.winghacks@gmail.com" target="_blank" rel="noopener noreferrer">
                            <IoMdMail className='icons'/>
                        </a>
                    </div>
                    
                </div>
               
            </div>
            <p>© 2024 WingHacks. All rights reserved.</p>
        </div>

    )
}

export default Footer