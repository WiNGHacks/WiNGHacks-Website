import React, {useState, useEffect } from 'react'
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// Immediately once they have signed up then they have to apply 
const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [missingValue, setMissingValue] = useState(true);

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
        //Prevent submissions before changing values
        e.preventDefault();
        axios.post(process.env.REACT_APP_SIGNUP_API_URL, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            status: "Not Applied",
        }).then((response)=>{
            console.log(response.data)
            setRegister(true);
            window.location.replace("https://forms.gle/3bcb8G57Y2PYuFfVA");
        }).catch((error) => {
            console.log(error)
            setErrorMessage(error.response.data.error)
            // alert(error.response.data.error)
        })

    };

    useEffect(() => {
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


                    {register?(
                        <div>
                            <button  className="submitBubble" align= "center" disabled> <FiLoader /> </button>
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