import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

const NotifyEmail = () => {
  const {emailToken} = useParams()
  const [seconds, setSeconds] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(true);

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

  const formatTime = (time) => {
    const remainingSeconds = time % 60;
    return `${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleButtonClick = () => {
    // clearInterval();
    setSeconds(60)
    console.log(seconds)
    setButtonDisabled(true)
    axios.post(`${process.env.REACT_APP_SEND_EMAIL_URL}${emailToken}`)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  

  }

  return (
    <div>
      <p>Please check your email in the next few minutes to verify your account.</p>
      If you don't recieve at email in the next minute please press the resend button. &nbsp;
      <button 
        className = "submitBubble" 
        onClick={handleButtonClick}  
        disabled={buttonDisabled}
      >
        Resend Email &nbsp; ({formatTime(seconds)})
      </button>
    </div>
  )
}

export default NotifyEmail