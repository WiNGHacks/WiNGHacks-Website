import React , {forwardRef, useState} from 'react'
import logo from '../pictures/WiNGHACKS_logo.png'
import banner from '../pictures/FULL_WiNGHacks_Insta_Banner.png'

const Banner = ({}, ref) => {

  return (
    <div ref = {el => ref.current = { ...ref.current, home: el }}>
     
     <div className='banner-container'>
        <img src= {banner} className='banner'></img>
      </div>
      
  </div>
  )
}

export default forwardRef(Banner)