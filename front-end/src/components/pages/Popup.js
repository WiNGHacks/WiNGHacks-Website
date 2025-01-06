import React , {useState} from 'react'
import { Link } from 'react-router-dom'
import { FaTimes } from "react-icons/fa";
import ladyGIF from "../pictures/characters/littleLady.gif"

const Popup = ({}, ref) => {
  const [openModal, setOpenModal] = useState(true)

  return (
    <div>
      
      {openModal && 
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="titleCloseBtn">
            <button className="nav-btn close" onClick={() => {
                setOpenModal(false);
              }}> 
              <FaTimes/> </button>
          </div>
          <div className="title">
            <h1>The 2025 WiNGHacks Hacker Application is OPEN!</h1>
            <img src={ladyGIF} className='little-guy' alt='GIF of a WiNGHacks Character'/>
          </div>
          {/* <div className="body">
            <p></p>
          </div> */}
          <div className="footer">
            {/* <button>Continue</button> */}
            <Link to={process.env.REACT_APP_APPLICATION_FORM} target="_blank" className = "apply button-glow" onClick={() => {
                setOpenModal(false);
              }}>
              APPLY NOW
            </Link>
          </div>
        </div>
      </div>
      }      
  </div>
  )
}

export default Popup;