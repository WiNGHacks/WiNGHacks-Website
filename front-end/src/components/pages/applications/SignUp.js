import React, {useState, useEffect } from 'react'
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import ClipLoader from "react-spinners/ClipLoader";
const cookies = new Cookies();


// Immediately once they have signed up then they have to apply 
const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [missingValue, setMissingValue] = useState(true);
    const [submitedClicked, setSubmitClicked] = useState(false)

    const navigate = useNavigate();

    // Handling the firstName change
    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    };

    // Handling the lastName change
    const handleLastName = (e) => {
        setLastName(e.target.value);
    };

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    // Handling the form submission
    const handleSubmit = (e) => {
        setSubmitClicked(true)
        //Prevent submissions before changing values
        e.preventDefault();
        axios.post(process.env.REACT_APP_SIGNUP_API_URL, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            status: "Not Applied",
        }).then((response)=>{
            console.log(response)
            setRegister(true);
            setSubmitClicked(false)
            window.location.replace(`/notify/email/${response.data.result.emailToken}`);
        }).catch((error) => {
            // console.log(error)
            setSubmitClicked(false)

            setErrorMessage(error.response.data.error)
            // alert(error.response.data.error)
        })

    };

    useEffect(() => {
        const token = cookies.get("TOKEN");
        if ( token ) {
            const decoded = jwtDecode(token);
            window.location.replace(`/portal/${decoded.id}`);
        }

        if(firstName && lastName && email && password ){
            setMissingValue(false)
        } 
        else {setMissingValue(true)}
    })
  

    return (
        <div>
            <div className='login-container'>
                <div className='form-container' align= "center">

                    <h1 className="title">Sign Up</h1>

                    {errorMessage && 
                        <div > 
                            <p style={{color:'#ED4337'}}> 
                                <RiErrorWarningFill /> 
                                {errorMessage}
                            </p>
                        </div>
                    }

                    <label className="label"></label>
                    <input
                        onChange={handleFirstName}
                        className="loginBubbles"
                        type="name"
                        placeholder='Enter first name'
                    />

                    <label className="label"></label>
                    <input
                        onChange={handleLastName}
                        className="loginBubbles"
                        type="name"
                        placeholder='Enter last name'
                    />

                    <label className="label"></label>
                    <input
                        onChange={handleEmail}
                        className="loginBubbles"
                        type="email"
                        placeholder='Enter email'
                    />

                    <label className="label"></label>
                    <input
                        onChange={handlePassword}
                        className="loginBubbles"
                        type="password"
                        placeholder='Enter password'
                    />


                    {submitedClicked?(
                        <div>
                            <button className="submitBubble" align= "center" disabled>
                                <ClipLoader 
                                    color='black'
                                    loading={submitedClicked}
                                    size={10}
                                    speedMultiplier ={1}
                                    
                                />
                            </button>
                        </div>
                    ):(
                        <button 
                            onClick={handleSubmit} 
                            className={missingValue? "disabledButton" : "submitBubble" }
                            align= "center" 
                            disabled={missingValue}
                        > 
                            Submit 
                        </button>
                    )}  

                    <p>Already have an account?&nbsp;
                        <a href="/login" >Login</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp