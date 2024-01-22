import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom'

import { jwtDecode } from "jwt-decode";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const UserPortal = () => {
    let {id} = useParams();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    const token = cookies.get("TOKEN");
    const decoded = jwtDecode(token);

    const checkUserSubmission = () => {
        
    }

    useEffect (() => {
        // Check if the URL id matches the current token
        // To avoid people miss using URL to enter others information
        if (decoded.id === id){
            axios.get(`${process.env.REACT_APP_GET_USER_PORTAL_API_URL}${id}`).then((response)=>{
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
    <div>
        <h1>Hi, {firstName}</h1>
        <h2>Your Status: {status}</h2>

    </div>
    )
}

export default UserPortal