import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom'

import { jwtDecode } from "jwt-decode";
import Select from 'react-select'


import Cookies from "universal-cookie";
import FetchResponse from './FetchResponse';

import flier from '../../pictures/characters/Flier.PNG'
import RSVPForm from './RSVPForm';

const cookies = new Cookies();

const UserPortal = () => {
    // const { fetchData } = useFetchResponse();
    let {id} = useParams();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [alreadyRSVP, setAlreadyRSVP] = useState(false)

    const token = cookies.get("TOKEN");
    const decoded = jwtDecode(token);





    useEffect (() => {
        // Check if the URL id matches the current token
        // To avoid people miss using URL to enter others information
        // console.log(decoded)
        if (decoded.id === id){
            // console.log(decoded.acceptedRSVP)
            if (decoded.acceptedRSVP !== "n/a") {
                setAlreadyRSVP(true)
            }
            axios.get(`${process.env.REACT_APP_GET_USER_PORTAL_API_URL}${id}`)
            .then((response)=>{
                setFirstName(response.data.firstName)
                setLastName(response.data.lastName)
                setEmail(response.data.email)
                setStatus(response.data.status)
            })
        }
        // If it doesn't then clear the token and have them relogin
        else {
            cookies.remove("TOKEN", {
                path: "/",
            })
            window.location.replace('/login');
        }
      }, [])


    return (
        <div className="Page Portal" align='center'>
            {/* {console.log(selectedRSVP)} */}
            {/* {console.log(alreadyRSVP)} */}
            <FetchResponse email = {email} id={id} status={status}/>
            
            { status === "Not Applied" ? 
            (
                <div>
                    {/* {console.log(status)} */}
                    <div className='name-banner'>
                        <div className='message'>
                            <h1 className='welcome-message'>Welcome, {firstName} {lastName}!</h1>
                            <div>Thank you for taking the time to make an account with WiNGHacks! Make sure you submit an application and let the uplifting begin!</div>
                        </div>
                        <img src={flier} className='character'/>
                    </div>
                    <div className='portal-padding'>
                        <h2>Your Status: <span style={{color: "red"}}>{status}</span></h2>
                        <p>Please wait 5 minutes to see updates. Please only submit one application.</p>

                        <button className= "Button apply" onClick={() => {window.open(process.env.REACT_APP_APPLICATION_FORM)}}>
                            Apply Now
                        </button>
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
                        <img src={flier} className='character'/>
                    </div>
                    <div className='portal-padding'>
                        {status === "Accepted"? 
                        <h2>Your Status: <span style={{color: "#2ece46"}}>{status}</span></h2>
                        :
                        <h2>Your Status: <span style={{color: "#07888f"}}>{status}</span></h2>
                        }
                    
                {status === "Accepted"? 
                    (   
                        <div>
                            {alreadyRSVP ? (
                                <div>
                                    <p>Thank you for filling out the RSVP form! We are super excited to see you at the hackathon!</p>
                                </div>
                            ):(
                                <div>
                                    <RSVPForm id={id} setAlreadyRSVP={setAlreadyRSVP} firstName={firstName} lastName={lastName} />
                                </div>
                            )}
                        </div>
                        
                        // <div>
                        //    <RSVPForm id={id} alreadyRSVP={alreadyRSVP} setAlreadyRSVP={setAlreadyRSVP} />
                        // </div>
                    ):(
                        <div>
                            <p>Thank you for applying! Check back later for more updates on your application!</p>
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

export default UserPortal



                    {/* <div className='name-banner'>
                        <div className='message'>
                            <h1 className='welcome-message'>Welcome, {firstName} {lastName}!</h1>
                            <div>Thank you for taking the time to make an account with WiNGHacks! Make sure you submit an application and let the uplifting begin!</div>
                        </div>
                        <img src={flier} className='character'/>
                    </div>
                    <div className='portal-padding'>
                        <h2>Your Status: {status}</h2>
                        <p>Please wait 5 minutes to see updates. Please only submit one application.</p>

                        <button className= "Button apply" onClick={() => {window.open(process.env.REACT_APP_APPLICATION_FORM)}}>
                            Apply Now
                        </button>
                    </div>
                </div> */}