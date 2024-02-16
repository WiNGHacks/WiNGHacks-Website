import React , {forwardRef} from 'react'
import logo from '../pictures/WiNGHACKS_logo.png'
import banner from '../pictures/WiNGHacks_Banner-2.png'


// import { SlSocialLinkedin } from "react-icons/sl";
import { FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

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