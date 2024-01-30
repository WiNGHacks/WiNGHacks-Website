import React, {useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Immediately once they have signed up then they have to apply 
const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);

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
            alert(response.data.message)
            window.location.replace("https://forms.gle/3bcb8G57Y2PYuFfVA");
        }).catch((error) => {
            console.log(error)
            alert(error.response.data.error)
        })

    };
  

    return (
        <div>
            <div className='login-container'>
                <div className='form-container' align= "center">

                    <h1 className="title">Sign Up</h1>

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

                    <button onClick={handleSubmit} className="submitBubble" > Submit </button>
                    <p>Already have an account?&nbsp;
                        <a href="/login" >Login</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp