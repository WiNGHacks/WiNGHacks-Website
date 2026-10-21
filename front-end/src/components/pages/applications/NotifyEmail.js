import { getSessionToken } from "../../session";
import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

const NotifyEmail = () => {

  const {emailToken} = useParams()
  const [seconds, setSeconds] = useState(60);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          // clearInterval(timer);
          setButtonDisabled(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    const token = getSessionToken(cookies);
    if (token && jwtDecode(token).admin ) {
      const decoded = jwtDecode(token);
      window.location.reload()
      window.location.replace(`/admin/sendResult/${decoded.id}`);
    }
    else if ( token ) {
        const decoded = jwtDecode(token);
        window.location.reload()
        window.location.replace(`/portal/${decoded.id}`);
    }
  }, []);


  const formatTime = (time) => {
    const remainingSeconds = time % 60;
    return `${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleButtonClick = () => {
    // clearInterval();
    setSeconds(60)
    // console.log(seconds)
    setButtonDisabled(true)
    setMessage("Sending verification email…");
    axios.post(`${process.env.REACT_APP_SEND_EMAIL_URL}${emailToken}`)
    .then((response) => {
      setMessage("Verification email sent. Please check your inbox and spam folder.");
    })
    .catch((error) => {
      setMessage(error.response ? "Could not send verification email. Please try again later." : "Cannot reach the server. Please check that the backend is running.");
    })
  

  }

  return (
    <div className='padding'>
      <p>Please check your email in the next few minutes to verify your account.</p>
      If you don't recieve at email in the next minute please press the resend button. &nbsp;
      <button 
        className = "submitBubble" 
        onClick={handleButtonClick}  
        disabled={buttonDisabled}
      >
        Resend Email &nbsp; ({formatTime(seconds)})
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  )
}

export default NotifyEmail
