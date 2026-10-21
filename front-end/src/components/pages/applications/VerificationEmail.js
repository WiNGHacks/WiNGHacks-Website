import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const VerificationEmail = () => {
  const {token} = useParams();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');

  useEffect(() => {
    // Send a request to your server to verify the token
    axios.put(`${process.env.REACT_APP_VERIFY_EMAIL_URL}${token}`)
    .then((response) => {
      // console.log(response.data.token)
      setVerificationStatus("Verified!")

      const decoded = jwtDecode(response.data.token);
      // set the cookie after checking the server returned a usable token
      cookies.set("TOKEN", response.data.token, {
          path: "/",
      });

      window.location.replace(process.env.REACT_APP_APPLICATION_FORM || `/portal/${decoded.id}`)
    })
    .catch(() => {
      setVerificationStatus("Verification failed. Please request a new verification link.");
    })


  }, [token])

  return (
    <div>
      VerificationEmail
      <p>{verificationStatus}</p>
      <a href={process.env.REACT_APP_APPLICATION_FORM}> Fill out application form</a>
    </div>
    
  )
}

export default VerificationEmail
