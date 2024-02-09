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

      // set the cookie
      cookies.set("TOKEN", response.data.token, {
          path: "/",
      });

      const decoded = jwtDecode(response.data.token);
      // window.location.replace(`/portal/${decoded.id}`);
      window.location.replace(process.env.REACT_APP_APPLICATION_FORM)
    })
    .then((error) => {
      // console.log(error)
    })


  })

  return (
    <div>
      VerificationEmail
      <p>{verificationStatus}</p>
      <a href={process.env.REACT_APP_APPLICATION_FORM}> Fill out application form</a>
    </div>
    
  )
}

export default VerificationEmail