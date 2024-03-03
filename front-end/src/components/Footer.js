import React, { useState, useEffect } from 'react';
import { FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

const Footer = () => {

    return (
        <div className="footer-container">
            <div className='footer-content'>
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
                <p className='footer-text'>
                    © 2024 WingHacks. All rights reserved.
                </p>
            </div>
        </div>

    )
}

export default Footer