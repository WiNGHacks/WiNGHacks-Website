import React, {useState, useEffect} from 'react'
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Cookies from "universal-cookie";
const cookies = new Cookies();


const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [missingValue, setMissingValue] = useState(true);

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
        // console.log(process.env.REACT_APP_LOGIN_API_URL)
        //Prevent submissions before changing values
        e.preventDefault();
        axios.post(process.env.REACT_APP_LOGIN_API_URL, {
            email: email,
            password: password,
        }).then((response)=>{
            if (response.data.emailVerified === false) {
                // console.log(response.data)
                setErrorMessage("Please verify your email first")
            } 
            else {
                // console.log(response.data)

                // set the cookie
                cookies.set("TOKEN", response.data.token, {
                    path: "/",
                });
        
                const decoded = jwtDecode(response.data.token);

                setLogin(true);
                // alert(response.data.message)
                console.log(decoded.admin)
                if(decoded.admin === true){
                    window.location.replace(`/admin/sendResult/${decoded.id}`);
                }
                else {
                    window.location.replace(`/portal/${decoded.id}`);
                }
                
            }
            
        }).catch((error) => {
            // console.log(error)
            setErrorMessage("Invalid email/password")
            // alert(error.response.data.message)
        })

    };

    useEffect(() => {
        const token = cookies.get("TOKEN");

        if (token && jwtDecode(token).admin ) {
            const decoded = jwtDecode(token);
            window.location.replace(`/admin/sendResult/${decoded.id}`);
        }
        else if ( token ) {
            const decoded = jwtDecode(token);
            window.location.replace(`/portal/${decoded.id}`);
        }
        if(email  && password ){
            setMissingValue(false)
        } 
        else {setMissingValue(true)}
    })

    return (
        <div>
            <div className='login-container'>
                <div className='form-container' align= "center">
                    <h1 >User Login</h1>

                    {errorMessage && 
                        <div > 
                            <p style={{color:'#ED4337'}}> 
                                <RiErrorWarningFill /> 
                                {errorMessage}
                            </p>
                        </div>
                    }
                        
                    {/* <label className="label">Email</label> */}
                    <input
                        onChange={handleEmail}
                        className="loginBubbles"
                        type="email"
                        placeholder='Enter email'
                    />
                    {/* {console.log(email)} */}

                    {/* <label className="label">Password</label> */}
                    <input
                        onChange={handlePassword}
                        className="loginBubbles"
                        type="password"
                        placeholder='Enter password'
                    />
                    {/* {console.log(password)} */}
                    

                    {login?(
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

                    
                    <p>Don't have an account?&nbsp;
                        <a href="/signup" >Sign Up Here</a>
                    </p>
                </div>
                

            </div>
        </div>
    )
}

export default Login