import React, { useState, useEffect } from 'react';
import { FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import logo from '../pictures/WiNGHacks_logo.png'

const Footer = () => {

    return (
        <div className="footer-container">
            <div className='divider'></div>
                <div className='footer-content'>
                    <div>
                        <img src = {logo} className='image' alt="Logo"></img>
                    </div>
                
                    <div className='column'>
                        <div className='text'>Made with ♥ by the WiNGHacks team</div>
                        <div>
                            <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" style={{color: "#0081A7", fontWeight: "bold"}} className='link' target="_blank">MLH Code of Conduct</a>
                        </div>

                        <div>
                            <p style={{fontSize: "15px" }}>© 2024 WiNGHacks. All rights reserved.</p>
                        </div>
                        
                    </div>

                    <div className = 'column'>
                        <div className='socials' >
                            <a href="https://www.instagram.com/winghacks/" target="_blank" rel="noopener noreferrer">
                                <FaSquareInstagram className='icons' size='6vh'/>
                            </a>
                            <a href="https://www.linkedin.com/company/winghacks" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className='icons' size='6vh'/>
                            </a>
                            <a href="mailto:uf.winghacks@gmail.com" target="_blank" rel="noopener noreferrer">
                                <IoMdMail className='icons' size='6vh'/>
                            </a>
                        </div>     
                    </div>
               
                </div>
        </div>

    )
}

export default Footer