import React , {forwardRef, useState} from 'react'
import logo from '../pictures/WiNGHacks_logo.png'
import banner from '../pictures/WiNGHacks_Banner.png'

const Banner = ({}, ref) => {

  return (
    <div ref = {el => ref.current = { ...ref.current, home: el }}>
     
     <div className='banner-container'>
        <img src= {banner} className='banner' alt='WiNGHacks Website Banner'></img>
      </div>
      
  </div>
  )
}

export default forwardRef(Banner)