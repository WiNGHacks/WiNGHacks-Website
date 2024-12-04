import React, {forwardRef, useState} from 'react';

const Schedule = ({}, ref) => {
    
  const [activeDay, setActiveDay] = useState('Friday, April 5th');

  const handleTabClick = (day) => {
    setActiveDay(day);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      if (tab.textContent !== day) {
        tab.style.borderBottom = '5px rgb(132, 132, 132) solid';
      } else {
        tab.style.borderBottom = 'none';
      }
    });
  };

  return (
    <div ref = {el => ref.current = { ...ref.current, schedule: el }} >

      <div className='Page entire-schedule'>
        <h1>Schedule</h1>
        <h2 className="disclaimer">Please note that the schedule is subject to change.</h2>

        
        

        {/* <button className="tabs tab prescheduleTab">(Pre-Events) Thursday, April 4th</button>
        <div className="formatPreSchedule">
          <div className="contentPreSchedule"> 
            <table className='table1'>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left'}} className='time'>Time</th>
                  <th style={{ textAlign: 'left'}}>Event</th>
                  <th style={{ textAlign: 'left'}} className='locationTitle'>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='time'>6:00PM - 7:00PM</td>
                  <td className='eventDescription'>Team Formation</td>
                  <td className='eventLocation'>Plaza of the Americas</td>
                </tr>
              </tbody>
            </table>
          </div> 
        </div> */}

        <div className = "location-container">
          <div className = "location-child-container">
          <div className="map" style={{justifyContent: "center", display: "flex"}}>
            <iframe 
              src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=AGENDA&title=WiNGHacks%202025%20Calendar&src=dWYud2luZ2hhY2tzLndlYm1hc3RlckBnbWFpbC5jb20&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%230B8043&color=%2333B679" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              style={{height:'90vh', width:'70vw'}}>
              </iframe>
            </div>
          </div>
        </div>

      </div>
    </div> 
  )
}

export default forwardRef(Schedule)

