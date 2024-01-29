import React from 'react'
import logo from '../pictures/littleLady.png'

const AboutUs = () => {
  return (
    <div>
      <div className='about-header-container'>
        Mission Statement: Stan Women in Computer Science and Engineering cause We're just better
      </div>
      <br></br>
      <b className='about-section-title'>Who are We?</b>
      
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Enim sed faucibus turpis in eu mi. Porttitor lacus luctus accumsan tortor posuere.</div>

      <br></br>
      <b className='about-section-title'>Meet the Team</b>
      <div className='about-horizontal'>
        <img src = {logo}/> <div className='img-padding'/>
        <img src = {logo}/>  <div className='img-padding'/>
        <img src = {logo}/> <div className='img-padding'/>
        <img src = {logo}/>  <div className='img-padding'/>
        <img src = {logo}/>  <div className='img-padding'/>
        <img src = {logo}/> <div className='img-padding'/>
        <img src = {logo}/>  <div className='img-padding'/>
        <img src = {logo}/> <div className='img-padding'/>
        <img src = {logo}/>  <div className='img-padding'/>
        <img src = {logo}/>  <div className='img-padding'/>
        <img src = {logo}/> <div className='img-padding'/>
        <img src = {logo}/>  <div className='img-padding'/>
        
      </div>


    </div>

  )
}

export default AboutUs