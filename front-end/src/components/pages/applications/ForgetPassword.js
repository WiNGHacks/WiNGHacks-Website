import React, {useState, useEffect} from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import { RiErrorWarningFill } from "react-icons/ri";
import axios from 'axios';

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [submitedClicked, setSubmitClicked] = useState(false);
    const [missingValue, setMissingValue] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [checkedValidEmail, setCheckedValidEmail] = useState(false)
    const [validEmailId, setValidEmailId] = useState()

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setNewPassword(e.target.value);
    };

    // Handling the password change
    const handleConfirmPassword = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    useEffect(() => {
        if(email){
            setMissingValue(false)
        } 
        else {setMissingValue(true)}
    })

    // Handling the form submission
    const handleSubmit = (e) => {
        // console.log(process.env.REACT_APP_LOGIN_API_URL)
        setSubmitClicked(true)
        //Prevent submissions before changing values
        e.preventDefault();
        // console.log(checkedValidEmail)

        if (checkedValidEmail == false) {
            axios.post(process.env.REACT_APP_CHECK_VALID_EMAIL, {
                email: email,
                // password: password,
            }).then((response)=>{
                // setLogin(true);
                // console.log(response)
                // console.log(response.data.id)
                
                setSubmitClicked(false)
                setCheckedValidEmail(true)
                setValidEmailId(response.data.id)
                setErrorMessage("")
            }).catch((error) => {
                // console.log(error)
                setSubmitClicked(false)
                setErrorMessage("Email is not registered")
                // alert(error.response.data.message)
            })    
        }
        else if(checkedValidEmail){
            // console.log(newPassword)
            // console.log(confirmNewPassword)
            if(newPassword === confirmNewPassword) {
                axios.put(`${process.env.REACT_APP_UPDATE_PASSWORD}${validEmailId}`, {
                    password: newPassword,
                    // password: password,
                }).then((response)=>{
                    // setLogin(true);
                    // console.log(response)
                    
                    setSubmitClicked(false)
                    window.location.replace(`/login`);
                    // setCheckedValidEmail(true)
                }).catch((error) => {
                    // console.log(error)
                    setSubmitClicked(false)
                    setErrorMessage("Password was not reset. Please try again.")
                    // alert(error.response.data.message)
                })   
            } 
            else {
                setSubmitClicked(false)
                setErrorMessage("Passwords don't match. Please try again.")
            }
        }
    };
  

    

  return (
    <div className='login-container' style={{paddingBottom: "-10rem"}}>
        <div className='form-container' align= "center" >
            <h1> Reset account password </h1>

            {errorMessage && 
                    <div > 
                        <p style={{color:'#ED4337'}}> 
                            <RiErrorWarningFill /> 
                            {errorMessage}
                        </p>
                    </div>
                }

            {checkedValidEmail? (
                <div>
                    <div>
                     <input
                        value={email}
                        className="loginBubbles"
                        type="email"
                        placeholder='Enter email used'
                        disabled = {true}
                        style={{opacity: "0.4"}}
                    />
                    </div>

                    <div>
                    <label className="label"></label>
                    <input
                        onChange={handlePassword}
                        className="loginBubbles"
                        type="password"
                        placeholder='Enter new password'
                    />
                    </div>

                    <label className="label"></label>
                    <input
                        onChange={handleConfirmPassword}
                        className="loginBubbles"
                        type="password"
                        placeholder='Confirm new password'
                    />  
                </div>
            ): (
                <div>
                     <input
                        onChange={handleEmail}
                        className="loginBubbles"
                        type="email"
                        placeholder='Enter email'
                    />
                </div>

            )}
           

            {submitedClicked?(
                <div>
                    <button className="submitBubble" style={{  pointerEvents: "none"}} align= "center" disabled>
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

        </div>

    </div>
  )
}

export default ForgetPassword