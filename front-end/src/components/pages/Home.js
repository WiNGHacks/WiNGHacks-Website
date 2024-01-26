import React from 'react'
import './Home.css';
import './Button.css';



const Home = () => {
  return (
    <div className='Home'>
      <section className='Home-hero'>
        <h1>Welcome <br></br> to  <br></br> </h1>
        <img src='./public/logo192.png' alt='WiNGHacks Logo'></img>
        {/* PlaceHolder href for now ask Christine/Annie for links */}
        <br></br>
        <button className='Button Button-apply'><a href="index.html">Apply now!</a></button>
        <br></br>
        <button className='Button Button-sponsor'><a href="index.html">Become a Sponsor</a></button>
      </section>
      <section className='Home-shortabout'>
      
      </section>
    </div>
  )
}

export default Home