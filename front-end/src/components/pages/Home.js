import React , {forwardRef} from 'react'
import logo from '../pictures/WiNGHACKS_logo.png'

// import { SlSocialLinkedin } from "react-icons/sl";
import { FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

const Home = ({}, ref) => {

  const downloadPDF = () => {
    const pdfUrl = "SponsorshipPacket.pdf";
     const link = document.createElement("a");
     link.href = pdfUrl;
     link.download = "WiNGHacks_SponsorshipPacket.pdf";
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
   }

  return (
    <div ref = {el => ref.current = { ...ref.current, home: el }}>
      <div className='Page Home'>
        <div className='welcome-container'>
          <div className='floating-container'>

            <div className='home-title'>Welcome to </div>

            <div className = "logo-home-container">
              <img src={logo} className = "logo-home" alt='WiNGHacks Logo'></img>
            </div>

            <div className='info-container'>
              <b className='home-date'>April 5-7</b>
              <b className='home-location'>At the Herbert Wertheim Engineering Building</b>
            </div>
      

          </div>
          <div className='welcome-right-container'>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdC6uvrtJ6AXc9GSY86ENfpVsICg0DCqOyOC-U7q7HAe-nLow/viewform"
              target="_blank">
              <button className='Button Button-home Button-interest'>Interest Form</button></a>
            <a href="login"><button className='Button Button-home Button-apply'>Apply now!</button></a>
            <a><button onClick={downloadPDF} className='Button Button-home Button-sponsor'>Become a Sponsor</button></a>
          </div>
        </div>
        <div className='socials'>
          <a href= "https://www.instagram.com/uf.winghacks?igsh=MTdiNThmbmdxNTIwcA==" target="_blank">
            <FaSquareInstagram className='icons' size={40}/>
          </a>
          <a href="https://www.linkedin.com/company/uf-winghacks/about/" target="_blank">
            <FaLinkedin className='icons' size={40}/>
          </a>
          <a href="mailto: uf.winghacks@gmail.com" target="_blank">
            <IoMdMail className='icons' size={40}/>
          </a>
        </div>
        
      </div>
  </div>
  )
}

export default forwardRef(Home)