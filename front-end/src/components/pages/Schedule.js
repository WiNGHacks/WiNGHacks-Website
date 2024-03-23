import React, {forwardRef, useState} from 'react'

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
       <h2 className="disclaimer">Please note that the schedule is subject to change and more details will be coming.</h2>

          <div className='tabs'>
          {['Friday, April 5th', 'Saturday, April 6th', 'Sunday, April 7th'].map((day) => (
            <button
              key={day}
              className={`tab ${activeDay === day ? 'active' : ''}`}
              onClick={() => handleTabClick(day)}
            >
              {day}
            </button>
          ))}
          </div>

          <div className = "content-all">
            <div className="content1"> 
            {activeDay === 'Friday, April 5th' && (
              <div className='content'>
                {/* <h2 style={{ textAlign: 'center'}}>Saturday Nov. 4, 2023</h2> */}
                <table className='table1'>
            <thead>
              <tr>
                <th style={{ textAlign: 'left'}} className='time'>Time</th>
                <th style={{ textAlign: 'left'}}>Event</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='time'>3:00PM</td>
                  <td className='eventDescription'>Official Check-In</td>
                </tr>
                <tr>
                  <td className='time'>3:30PM</td>
                  <td className='eventDescription'>Sponsorship Fair</td>
                </tr>
                <tr>
                  <td className='time'>5:30PM</td>
                  <td className='eventDescription'>Opening Ceremony</td>
                </tr>
                <tr>
                  <td className='time'>7:00PM</td>
                  <td className='eventDescription'>Hacking Starts</td>
                </tr>
                <tr>
                  <td className='time activity'>8:00PM</td>
                  <td className='eventDescription activity'>Dinner</td>
                </tr>
                <tr>
                  <td className='time activity'>9:00PM</td>
                  <td className='eventDescription activity'>Workshop 1</td>
                </tr>
              </tbody>
            </table>
            </div>
            )}
            </div>
            
            <div className = "content2">
            {activeDay === 'Saturday, April 6th' && (
              <div className='content'>
                {/* <h2 style={{ textAlign: 'center'}}>Saturday Nov. 5, 2023</h2> */}
                <table className='scheduleTable'>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left'}} className='time'>Time</th>
                      <th style={{ textAlign:'left'}}>Event</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='time'>8:00AM</td>
                        <td className='eventDescription'>Breakfast</td>
                      </tr>
                      <tr>
                        <td className='time'>9:00AM</td>
                        <td className='eventDescription'>Workshop 2</td>
                      </tr>
                      <tr>
                        <td className='time activity'>10:15AM</td>
                        <td className='eventDescription activity'>Workshop 3</td>
                      </tr>
                      <tr>
                        <td className='time'>12:00PM</td>
                        <td className='eventDescription'>Lunch</td>
                      </tr>
                      <tr>
                        <td className='time'>1:30PM</td>
                        <td className='eventDescription '>Workshop 4</td>
                      </tr>
                      <tr>
                        <td className='time'>2:45PM</td>
                        <td className='eventDescription'>Workshop 5</td>
                      </tr>
                      <tr>
                        <td className='time'>4:00PM</td>
                        <td className='eventDescription'>Workshop 6</td>
                      </tr>
                      <tr>
                        <td className='time'>5:15PM</td>
                        <td className='eventDescription'>Workshop 7</td>
                      </tr>
                      <tr>
                        <td className='time'>6:30PM</td>
                        <td className='eventDescription'>Workshop 8</td>
                      </tr>
                      <tr>
                        <td className='time'>8:00PM</td>
                        <td className='eventDescription'>Dinner</td>
                      </tr>
                      <tr>
                        <td className='time'>11:30PM</td>
                        <td className='eventDescription'>Midnight Snacks</td>
                      </tr>
                    </tbody>
                </table>
              </div>
            )}
            </div>

            <div className = "content3">
            {activeDay === 'Sunday, April 7th' && (
              <div className='content'>
              <div className='content'>
                {/* <h2 style={{ textAlign: 'center'}}>Saturday Nov. 4, 2023</h2> */}
                <table className='table1'>
            <thead>
              <tr>
                <th style={{ textAlign: 'left'}} className='time'>Time</th>
                <th style={{ textAlign: 'left'}}>Event </th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='time activity'>6:00AM</td>
                  <td className='eventDescription'>Breakfast</td>
                </tr>
                <tr>
                  <td className='time activity'>7:00AM</td>
                  <td className='eventDescription'>Hacking Ends & DevPosts Due</td>
                </tr>
                <tr>
                  <td className='time activity'>7:00AM</td>
                  <td className='eventDescription'>Hard DevPost Deadline</td>
                </tr>
                <tr>
                  <td className='time activity'>9:00AM</td>
                  <td className='eventDescription'>Project Expo & Judging</td>
                </tr>
                <tr>
                  <td className='time'>11:00AM</td>
                  <td className='eventDescription'>Judges Finalize Winners</td>
                </tr>
                <tr>
                  <td className='time activity'>12:00AM</td>
                  <td className='eventDescription activity'>Closing Ceremony</td>
                </tr>
              </tbody>
            </table>
            </div>
              </div>
            )}
             </div>
             
          </div>

       </div>
  </div> 
  )
}

export default forwardRef(Schedule)