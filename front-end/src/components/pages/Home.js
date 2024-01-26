import {React, useRef} from 'react'
import './Home.css';
import './Button.css';
import logo from '../pictures/draggin.png'


const Home = () => {

  const homeSection = useRef();
  const aboutSection = useRef();
  const sponsorSection = useRef();
  const applySection = useRef();

  const scrollToSection = (elmRef) => {
    window.scrollTo({
      top: elmRef.current.offsetTop,
      behavior: 'smooth'
    })
  }

  return (
    <div>
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
    <div className='Home'>
      <section className='Home-hero'>
        <h1>Welcome <br></br> to  <br></br> </h1>
        <div className = "logo-home-container">
          <img src={logo} alt='WiNGHacks Logo'></img>
        </div>
        {/* PlaceHolder href for now ask Christine/Annie for links */}
        <br></br>
        <button className='Button Button-apply'><a href="index.html">Apply now!</a></button>
        <br></br>
        <button className='Button Button-sponsor'><a href="index.html">Become a Sponsor</a></button>
      </section>
      <section className='Home-shortabout'>
      
      </section>
      </div>
    </div>
  )
}

export default Home