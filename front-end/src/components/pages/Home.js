import React , {forwardRef} from 'react'
import logo from '../pictures/WiNGHACKS_logo.png'

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
      <div className='Home'>
        <div className='welcome-container'>
          <div className='floating-container'>

            <div className='home-title'>Welcome to </div>

            <div className = "logo-home-container">
              <img src={logo} className = "logo-home" alt='WiNGHacks Logo'></img>
            </div>

          </div>
          <div className='welcome-right-container'>
            <a href="login"><button className='Button Button-apply'><b>Apply now!</b></button></a>
            <a><button onClick={downloadPDF} className='Button Button-sponsor'><b>Become a Sponsor</b></button></a>
          </div>
        </div>
        
      </div>
      {/* <div className='based'><a href="#">Based</a></div> */}
  </div>
  )
}

export default forwardRef(Home)

{/* <div className ="section" handleClick>
        Home
      </div>
      <div className ="section">
        About Us
      </div>
      <div className ="section">
        Sponsors
      </div>
      <div className ="section">
        Apply Now
      </div> */}

      {/* <div className = "logo-home-container">
          <img src={logo} alt='WiNGHacks Logo'></img>
        </div>
        <br></br>

        <div className='welcome-container'>
          <h1 className='home-title'>Welcome to <br></br> </h1>
          <button className='Button Button-apply'><a href="index.html">Apply now!</a></button>
          <br></br>
          <button className='Button Button-sponsor'><a href="index.html">Become a Sponsor</a></button>
        </div>

      </div>

      <section className='Home-shortabout'>
      
      </section> */}