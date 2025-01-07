import React, {useState, forwardRef} from 'react'
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { SponsorList } from '../data/SponsorList';

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
        <h2>Co-Host</h2>
        <div align='center' className='sponsor-logo-container'>
        {SponsorList.filter((sponsor) => sponsor.tier === 'Co-Host').map((sponsor) => (
          <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{border: '3px solid rgb(61, 61, 61)'}}>
              <img src={sponsor.logo_image} alt={sponsor.alt} />
          </a>
        ))}
        </div>
        <h2>Platinum Sponsors</h2>
        <div align='center' className='sponsor-logo-container'>
        {SponsorList.filter((sponsor) => sponsor.tier === 'Platinum').map((sponsor) => (
          <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{border: '3px solid rgb(182, 214, 230)'}}>
              <img src={sponsor.logo_image} alt={sponsor.alt} />
          </a>
        ))}
        </div>
        <h2>Gold Sponsors</h2>
        <div align='center' className='sponsor-logo-container'>
        {SponsorList.filter((sponsor) => sponsor.tier === 'Gold').map((sponsor) => (
          <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{border: '3px solid rgb(238, 218, 107)'}}>
              <img src={sponsor.logo_image} alt={sponsor.alt} />
          </a>
        ))}
        </div>
        <h2>Silver Sponsors</h2>
        <div align='center' className='sponsor-logo-container'>
        {SponsorList.filter((sponsor) => sponsor.tier === 'Silver').map((sponsor) => (
          <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{border: '3px solid rgb(200, 203, 206)'}}>
              <img src={sponsor.logo_image} alt={sponsor.alt} />
          </a>
        ))}
        </div>
        <h2>Other Sponsors</h2>
        <div align='center' className='sponsor-logo-container'>
        {SponsorList.filter((sponsor) => sponsor.tier === 'Other').map((sponsor) => (
          <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer">
              <img src={sponsor.logo_image} alt={sponsor.alt} />
          </a>
        ))}
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