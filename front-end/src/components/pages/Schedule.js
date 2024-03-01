import React, {forwardRef, useState} from 'react'

const Schedule = ({}, ref) => {
    
  const [activeDay, setActiveDay] = useState('Friday, April 5th');

  const handleTabClick = (day) => {
    setActiveDay(day);
  };

  return (
    <div ref = {el => ref.current = { ...ref.current, schedule: el }} >

       <div className='Page entire-schedule'>
       <h1>Schedule</h1>

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
            <div> </div>
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
                  <td className='time'>4:00PM</td>
                  <td className='eventDescription'>Offical Check-In</td>
                </tr>
                <tr>
                  <td className='time'>4:30PM</td>
                  <td className='eventDescription'>Team Formation</td>
                </tr>
                <tr>
                  <td className='time'>5:00PM</td>
                  <td className='eventDescription'>Sponsorship Fair</td>
                </tr>
                <tr>
                  <td className='time activity'>8:00PM</td>
                  <td className='eventDescription activity'>Dinner Starts</td>
                </tr>
                <tr>
                  <td className='time'>9:00PM</td>
                  <td className='eventDescription'>Hacking Starts</td>
                </tr>
                <tr>
                  <td className='time activity'>2:00PM</td>
                  <td className='eventDescription'>Workshop: Building Accessible UI with React Spectrum</td>
                </tr>
                <tr>
                  <td></td>
                  <td className = 'presenter'>Yihui Liao - SWE @ Adobe</td>
                </tr>
                <tr>
                  <td className='time activity'>3:00PM</td>
                  <td className='eventDescription activity'>Break Through Tech AI Info Session</td>
                </tr>
                <tr>
                  <td className='time'>4:00PM</td>
                  <td className='eventDescription'>Workshop: Non-Tech Opportunities in the Industry</td>
                </tr>
                <tr>
                  <td></td>
                  <td className = 'presenter'>Chu Huang, Malorie Bournazian - MIT</td>
                </tr>
                <tr>
                  <td className='time activity'>5:00PM</td>
                  <td className='eventDescription activity'>Dinner</td>
                </tr>
                <tr>
                  <td className='time'>6:00PM</td>
                  <td className='eventDescription'>Workshop: Intro to Figma and Interactive Design</td>
                </tr>
                <tr>
                  <td></td>
                  <td className = 'presenter'>Julie Lely - Product Design @ Yahoo</td>
                </tr>
                <tr>
                  <td className='time activity'>7:00PM</td>
                  <td className='eventDescription activity'>Workshop: Intro to Databases & SQL</td>
                </tr>
                <tr>
                  <td className='time'>8:00PM</td>
                  <td className='eventDescription'>MLH Mini Event: Decompress with Us!</td>
                </tr>
                <tr>
                  <td></td>
                  <td className='presenter'>Major League Hacking</td>
                </tr>
                <tr>
                  <td className='time'>10:00PM</td>
                  <td className='eventDescription'>S'mores</td>
                </tr>
              </tbody>
            </table>
            </div>
            )}
            
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
                        <td className='time'>9:30AM</td>
                        <td className='eventDescription'>Breakfast</td>
                      </tr>
                      <tr>
                        <td className='time'>10:00AM</td>
                        <td className='eventDescription'>Workshop: Submission & Presentation 101</td>
                      </tr>
                      <tr>
                        <td className='time activity'>11:00AM</td>
                        <td className='eventDescription activity'>Soft Submission Deadline</td>
                      </tr>
                      <tr>
                        <td className='time'>12:00PM</td>
                        <td className='eventDescription'>Lunch</td>
                      </tr>
                      <tr>
                        <td className='time'>2:00PM</td>
                        <td className='eventDescription '>Judging & Presentations</td>
                      </tr>
                      <tr>
                        <td className='time'>10:00PM</td>
                        <td className='eventDescription'>Closing Ceremony</td>
                      </tr>
                    </tbody>
                </table>
              </div>
            )}
            
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
                  <td className='time activity'>2:00PM</td>
                  <td className='eventDescription'>Workshop: Building Accessible UI with React Spectrum</td>
                </tr>
                <tr>
                  <td></td>
                  <td className = 'presenter'>Yihui Liao - SWE @ Adobe</td>
                </tr>
                <tr>
                  <td className='time activity'>3:00PM</td>
                  <td className='eventDescription activity'>Break Through Tech AI Info Session</td>
                </tr>
                <tr>
                  <td className='time'>4:00PM</td>
                  <td className='eventDescription'>Workshop: Non-Tech Opportunities in the Industry</td>
                </tr>
                <tr>
                  <td></td>
                  <td className = 'presenter'>Chu Huang, Malorie Bournazian - MIT</td>
                </tr>
                <tr>
                  <td className='time activity'>5:00PM</td>
                  <td className='eventDescription activity'>Dinner</td>
                </tr>
                <tr>
                  <td className='time'>6:00PM</td>
                  <td className='eventDescription'>Workshop: Intro to Figma and Interactive Design</td>
                </tr>
                <tr>
                  <td></td>
                  <td className = 'presenter'>Julie Lely - Product Design @ Yahoo</td>
                </tr>
                <tr>
                  <td className='time activity'>7:00PM</td>
                  <td className='eventDescription activity'>Workshop: Intro to Databases & SQL</td>
                </tr>
                <tr>
                  <td className='time'>8:00PM</td>
                  <td className='eventDescription'>MLH Mini Event: Decompress with Us!</td>
                </tr>
                <tr>
                  <td></td>
                  <td className='presenter'>Major League Hacking</td>
                </tr>
                <tr>
                  <td className='time'>10:00PM</td>
                  <td className='eventDescription'>S'mores</td>
                </tr>
              </tbody>
            </table>
            </div>
              </div>
            )}
          </div>

       </div>
  </div> 
  )
}

export default forwardRef(Schedule)
