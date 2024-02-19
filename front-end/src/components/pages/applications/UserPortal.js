import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom'

import { jwtDecode } from "jwt-decode";
import Select from 'react-select'


import Cookies from "universal-cookie";
import FetchResponse from './FetchResponse';

const cookies = new Cookies();

const UserPortal = () => {
    // const { fetchData } = useFetchResponse();
    let {id} = useParams();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [selectedRSVP, setSelectedRSVP] = useState("");
    const [alreadyRSVP, setAlreadyRSVP] = useState(false)

    const token = cookies.get("TOKEN");
    const decoded = jwtDecode(token);

    // Handle change function
    const handleRSVPChange = selectedRSVP => {
        setSelectedRSVP(selectedRSVP.value);
    };

    const rsvpOption = [
        { value: '', label: 'Select...' },
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]

    const updateAcceptance = () => {
        axios.put(`${process.env.REACT_APP_UPDATE_RSVP_API_URL}${id}`, {acceptedRSVP: selectedRSVP})
        .then((response) => {
            console.log(response)
            setSelectedRSVP("")
            setAlreadyRSVP(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }



    useEffect (() => {
        // Check if the URL id matches the current token
        // To avoid people miss using URL to enter others information
        console.log(decoded)
        if (decoded.id === id){
            console.log(decoded.acceptedRSVP)
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
        <div className="Portal" align='center'>
            {console.log(alreadyRSVP)}
            <FetchResponse email = {email} id={id} status={status}/>
            
            { status === "Not Applied" ? 
            (
                <div>
                    {/* {console.log(status)} */}
                    <h1>Hi, {firstName} {lastName}</h1>
                    <button className= "Button apply" onClick={() => {window.open(process.env.REACT_APP_APPLICATION_FORM)}}>
                        Apply Now
                    </button>
                    <h2>Your Status: {status}</h2>
                    <p>Please wait 5 minutes to see updates. Please only submit one application.</p>
                </div>
            )
            :
            (
                <div>
                    <h1>Hi, {firstName} {lastName}</h1>
                    <h2>Your Status: {status}</h2>
                    {status === "Accepted"? 
                    (
                        <div>
                            <Select
                                placeholder="Your decision..."
                                value={selectedRSVP.value}
                                onChange={handleRSVPChange}
                                options={rsvpOption}
                                isDisabled = {alreadyRSVP}
                            />                    
                            <button disabled={selectedRSVP === ""} onClick={updateAcceptance}>Submit RSVP</button>
                        </div>
                    ):(
                        <div>
                            <p>Thank you for applying! Check back later for more updates on your application!</p>
                        </div>
                    )
                
                    }
           
                
                </div>

            )
            }
        
        </div>
    )
}

export default UserPortal