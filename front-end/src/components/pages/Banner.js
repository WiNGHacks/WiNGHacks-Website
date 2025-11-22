import React , {forwardRef, useState} from 'react'
import banner from '../pictures/2026_Logos/banner.gif'

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