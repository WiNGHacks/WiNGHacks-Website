import React from 'react'
import './Home.css';



const Home = () => {
  return (
    <div className='Home'>
      <section className='Home-hero'>
        <h1>Welcome to WiNGHacks!</h1>
        <img src='./public/logo192.png' alt='WiNGHacks Logo'></img>
        {/* PlaceHolder href for now ask Christine/Annie for links */}
        <br></br>
        <a href="index.html">Apply now!</a>
        <br></br>
        <a href="index.html">Become a Sponsor</a>
      </section>
      <section className='Home-About'>
        
      </section>
    </div>
  )
}

export default Home