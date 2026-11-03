import React, { useState } from 'react';
import { useSession } from '../../auth/SessionProvider';
import RSVPForm from './RSVPForm';

const UserPortal = () => {
    const { user } = useSession();
    const { _id: id, firstName, lastName, status } = user;
    const [alreadyRSVP, setAlreadyRSVP] = useState(user.acceptedRSVP !== 'n/a');
    const [rsvpStatus, setRSVPStatus] = useState(user.acceptedRSVP);

    const overrideStatus = "Not Applied";
    return (
        <div className="Page Portal" align='center'>
            {/* {console.log(selectedRSVP)} */}
            {/* {console.log(alreadyRSVP)} */}
            {/* Application status is managed by authenticated administrators. */}
            
            { overrideStatus === "Not Applied" ? // status === "Not Applied" 
            (
                <div>
                    {/* {console.log(status)} */}
                    <div className='name-banner'>
                        <div className='message'>
                            <h1 className='welcome-message'>Welcome, {firstName} {lastName}!</h1>
                            <div>Thank you for taking the time to make an account with WiNGHacks! Make sure you submit an application and let the uplifting begin!</div>
                        </div>
                        {/* <img src={flier} className='character'/> */}
                    </div>
                    <div className='portal-padding'>
                        {/* <h2>Your Status: <span style={{color: "red"}}>{status}</span></h2> */}
                        <p>Please wait 5 minutes to see updates. Please only submit one application.</p>

                        {/* <button className= "Button apply" onClick={() => {window.open(process.env.REACT_APP_APPLICATION_FORM)}}>
                            Apply Now
                        </button> */}
                    </div>
                </div>
            )
            :
            (
                <div>
                    <div className='name-banner'>
                        <div className='message'>
                            <h1 className='welcome-message'>Welcome, {firstName} {lastName}!</h1>
            
                        </div>
                        {/* <img src={flier} className='character'/> */}
                    </div>
                    <div className='portal-padding'>
                        {overrideStatus === "Accepted"? 
                        <h2>Your Status: <span style={{color: "#2ece46"}}>{status}</span></h2>
                        :
                        <h2>Your Status: <span style={{color: "#07888f"}}>{status}</span></h2>
                        }
                    
                {overrideStatus === "Accepted"? 
                    (   
                        <div>
                            {/* <div>
                                <p>Thank you for filling out the RSVP form for WiNGHacks 2024! We are super excited to see you!</p>
                                <h4>Be sure to join the <a href="http://discord.gg/U7Am39uzZx" target="_blank">discord </a>
                                and the <a href="https://www.remind.com/join/winghacks" target="_blank">remind </a>
                                to hear all about WiNGHacks' events and announcements!</h4>
                            </div> */}
                           
                           {/* {console.log(alreadyRSVP)} */}
                            {alreadyRSVP ? (
                                <div>
                                    {rsvpStatus === "yes"? (
                                        <div>
                                            <p>Thank you for filling out the RSVP form for WiNGHacks 2024! <br />
                                                You <b>MUST</b> complete all of the action items below to receive important updates and announcements.
                                            </p>
                                    
                                            <div >
                                                <h3 style={{textDecoration: "underline"}}>Action Items/ Next Steps:</h3>
    
                                                <div>
                                                    <h4>1. Join the <a href="http://discord.gg/U7Am39uzZx" target="_blank" style={{color: "blue"}}>WiNGHacks discord.</a></h4>
                                                    <h4>2. Join the REMIND by texting "@winghacks" to 81010.</h4>
                                                    <h4>3. Join us on our <a href="http://winghacks-2025.devpost.com/" target="_blank" style={{color: "blue"}}>Devpost</a>!</h4>
                                                </div>
                                            </div>
                                      
                                            {/* <h4>Be sure to join the <a href="http://discord.gg/U7Am39uzZx" target="_blank">discord </a>
                                            and the <a href="https://www.remind.com/join/winghacks" target="_blank">remind </a>
                                            (or text @winghacks to 81010) to hear all about WiNGHacks' events and announcements!</h4> */}
                                        </div>
                                    ):(
                                        <p>Thank you for filling out the RSVP form for WiNGHacks 2024! We are sorry to see you go. We hope to see you next year!</p>
                                    )}
                                    
                
                                </div>
                            ):(
                                <div>
                                    <RSVPForm id={id}  setAlreadyRSVP={setAlreadyRSVP} firstName={firstName} lastName={lastName} setRSVPStatus ={setRSVPStatus} />
                                </div>
                            )}
                        </div>
                        
                        // <div>
                        //    <RSVPForm id={id} alreadyRSVP={alreadyRSVP} setAlreadyRSVP={setAlreadyRSVP} />
                        // </div>
                    ):(
                        <div>
                            {overrideStatus === "Rejected" ? (
                                <p>Thank you for applying! We hope to see you next year!</p>
                            ):(
                                <p>Thank you for applying! Check back later for more updates on your application!</p>
                            )
                            }
                            
                        </div>
                    )
                
                }
                </div>
        
                
                </div>

            )
            }
        
        </div>
    )
}

export default UserPortal;
