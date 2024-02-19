import React , {useState} from 'react'
import { Link } from 'react-router-dom'
import { FaTimes } from "react-icons/fa";

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
            <h1>The 2024 WiNGHacks Hacker Application is OPEN!</h1>
          </div>
          {/* <div className="body">
            <p></p>
          </div> */}
          <div className="footer">
            {/* <button>Continue</button> */}
            <Link to="/signup" className = "apply button-glow" onClick={() => {
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