import React , {forwardRef} from 'react'
import banner from '../pictures/WiNGHacks_Banner.png'

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
    // ref = {el => ref.current = { ...ref.current, home: el }}
    <div className='Home'>
      <div className='home-buttons' align="center">
        {/* last year's become a mentor form: https://docs.google.com/forms/d/e/1FAIpQLSeTqVfJUiWjjARDFBh1MkegBLw0F-Kd-GquU2NJO1-H7ybOuQ/viewform */}
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcH7xPMC3ERh2Bj3X6iRDo5-_8AuHoCK3aQbMfBKTDw5uM2g/viewform?pli=1&pli=1"
              target="_blank">
              <button className='Button Button-home Button-interest'>Become a Mentor</button></a>
        <a href={process.env.REACT_APP_APPLICATION_FORM} target="_blank"><button className='Button Button-home Button-apply button-glow-home-apply'>Link to Apply!</button></a>
        <a><button onClick={downloadPDF} className='Button Button-home Button-sponsor'>Sponsorship Packet</button></a>
      </div>
      <div className='socials'>
          <a href= "https://www.instagram.com/winghacks/" target="_blank">
            <FaSquareInstagram className='icons'/>
          </a>
          <a href="https://www.linkedin.com/company/winghacks" target="_blank">
            <FaLinkedin className='icons'/>
          </a>
          <a href="mailto: uf.winghacks@gmail.com" target="_blank">
            <IoMdMail className='icons'/>
          </a>
      </div>
  </div>
  )
}

export default forwardRef(Home)