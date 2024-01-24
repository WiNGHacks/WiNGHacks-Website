import {React, useRef} from 'react'

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
      <div className ="section" handleClick>
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
      </div>
    </div>
  )
}

export default Home