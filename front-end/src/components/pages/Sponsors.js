import React, {useState, forwardRef} from 'react'
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import bloomberg_logo from '../pictures/sponsor_logo/bloomberg-logo.png'
import rtc_logo from '../pictures/sponsor_logo/rtc-logo.png'
import c1_logo from '../pictures/sponsor_logo/capitalone-logo.png'
import TI_logo from '../pictures/sponsor_logo/TI-logo.png'
import JPMC_logo from '../pictures/sponsor_logo/jpmc-logo.png'
import UKG_logo from '../pictures/sponsor_logo/ukg-logo.png'

const Sponsors = ({}, ref) => {

  const [openPDF, setOpenPDF] = useState(false)

  const onButtonClick = () => {
    // const pdfUrl = "SponsorshipPacket.pdf";
    // const link = document.createElement("a");
    // link.href = pdfUrl;
    // link.download = "document.pdf";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    setOpenPDF(!openPDF)


    
  };

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
    <div ref = {el => ref.current = { ...ref.current, sponsor: el }} 
      align='center' className='margins'>
      <h1 align='left'>Sponsors</h1>
        <div  align='center'className='sponsor-logo-container'>
          <img  src={bloomberg_logo}  alt='Bloomberg Logo'></img>
          <img  src={rtc_logo}  alt='RTC Logo'></img>
          <img  src={c1_logo}  alt='Capital One Logo'></img>
          <img  src={TI_logo}  alt='Texas Instrument Logo'></img>
          <img  src={JPMC_logo}  alt='JPMC Logo'></img>
          <img  src={UKG_logo}  alt='UKG Logo'></img>
        </div>

      <button className='Button Button-sponsor-page' onClick ={onButtonClick}>
        <div className='arrow'>{openPDF? (<SlArrowUp /> ): (<SlArrowDown />)}</div>
        <div>Sponsorship Packet</div>
      </button>

      {openPDF? (<div><iframe src="SponsorshipPacket.pdf" width="70%" height="500px" />
        <button className='Button Button-sponsor-page' onClick={downloadPDF}>Download Me</button>
      </div>):(<div></div>)}
      
      </div>
  )
}

export default forwardRef(Sponsors)