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
       <h2 className="disclaimer">Please note that the schedule is subject to change.</h2>

      <button className="tabs tab prescheduleTab">(Pre-Events) Thursday, April 4th</button>
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
        </div>

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
                <th style={{ textAlign: 'left'}} className='locationTitle'>Location</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='time'>3:00PM</td>
                  <td className='eventDescription'>Offical Check-In</td>
                  <td className='eventLocation'>Herbert Wertheim</td>
  
                </tr>
                <tr>
                  <td className='time'>3:30PM</td>
                  <td className='eventDescription'>Sponsorship Fair</td>
                  <td className='eventLocation'>Herbert Wertheim</td>
                </tr>
                <tr>
                  <td className='time'>5:30PM</td>
                  <td className='eventDescription'>Opening Ceremony</td>
                  <td className='eventLocation'>Malachowsky Hall || Nvidia Auditorium</td>
                </tr>
                <tr>
                  <td className='time'>7:00PM</td>
                  <td className='eventDescription'>Hacking Starts</td>
                  <td className='eventLocation'>Herbert Wertheim</td>
                </tr>
                <tr>
                  <td className='time activity'>8:00PM</td>
                  <td className='eventDescription activity'>Dinner</td>
                  <td className='eventLocation'>Herbert Wertheim, Lobby</td>
                </tr>
                <tr>
                  <td className='time activity'>9:00PM</td>
                  <td className='eventDescription activity'>Intro to React by WiCSE</td>
                  <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                </tr>
                <tr>
                  <td className='time activity'>10:00PM</td>
                  <td className='eventDescription activity'>Cupcake Social</td>
                  <td className='eventLocation'>Herbert Wertheim, Lobby</td>
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
                      <th style={{ textAlign: 'left'}} className='locationTitle'>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className='time'>7:30AM</td>
                        <td className='eventDescription'>Sunrise Social</td>
                      </tr>
                      <tr>
                        <td className='time'>8:00AM</td>
                        <td className='eventDescription'>Breakfast</td>
                        <td className='eventLocation'>Herbert Wertheim, Lobby</td>
                      </tr>
                      <tr>
                        <td className='time'>9:00AM</td>
                        <td className='eventDescription'>Intro to Microprocessor Programming by WECE</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time activity'>10:15AM</td>
                        <td className='eventDescription activity'>Design Thinking by Infotech</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>12:00PM</td>
                        <td className='eventDescription'>Lunch</td>
                        <td className='eventLocation'>Herbert Wertheim, Lobby</td>
                      </tr>
                      <tr>
                        <td className='time'>1:30PM</td>
                        <td className='eventDescription '>GitHub Copilot by Major League Hacking (MLH)</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>2:45PM</td>
                        <td className='eventDescription'>Pitfalls of Building a Career in Engineering...and How to Overcome Them by Electronic Arts (EA)</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>4:00PM</td>
                        <td className='eventDescription'>AI, LangChain library by ColorStack</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>5:15PM</td>
                        <td className='eventDescription'>Introduction to XR in Unity by GatorVR</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>6:30PM</td>
                        <td className='eventDescription'>Databases (SQL, NoSQL, Vector) by ACM</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>8:00PM</td>
                        <td className='eventDescription'>Dinner</td>
                        <td className='eventLocation'>Herbert Wertheim, Lobby</td>
                      </tr>
                      <tr>
                        <td className='time'>9:00PM</td>
                        <td className='eventDescription'>Social 1</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>10:00PM</td>
                        <td className='eventDescription'>Social 2</td>
                        <td className='eventLocation'>Herbert Wertheim, Room 215</td>
                      </tr>
                      <tr>
                        <td className='time'>11:30PM</td>
                        <td className='eventDescription'>Cupcake Social</td>
                        <td className='eventLocation'>Herbert Wertheim, Lobby</td>
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
                <th style={{ textAlign: 'left'}} className='locationTitle'>Location</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='time'>12:00AM</td>
                  <td className='eventDescription'>Midnight Snacks</td>
                  <td className='eventLocation'>Herbert Wertheim, Lobby</td>
                </tr>
                <tr>
                  <td className='time activity'>7:00AM</td>
                  <td className='eventDescription'>Hacking Ends & Devposts Due</td>
                  <td className='eventLocation'>Devpost</td>
                </tr>
                <tr>
                  <td className='time activity'>7:30AM</td>
                  <td className='eventDescription'>Breakfast</td>
                  <td className='eventLocation'>Herbert Wertheim, Lobby</td>
                </tr>
                <tr>
                  <td className='time activity'>9:30AM</td>
                  <td className='eventDescription'>Project Expo</td>
                  <td className='eventLocation'>J. Wayne Reitz Student Union</td>
                </tr>
                <tr>
                  <td className='time'>11:30AM</td>
                  <td className='eventDescription'>Judges Finalize Winners</td>
                </tr>
                <tr>
                  <td className='time'>12:00PM</td>
                  <td className='eventDescription'>Grab & Go Lunch</td>
                </tr>
                <tr>
                  <td className='time activity'>12:00PM</td>
                  <td className='eventDescription activity'>Closing Ceremony</td>
                  <td className='eventLocation'>Turlington Hall, Room L007</td>
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

