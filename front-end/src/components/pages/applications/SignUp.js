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
            <h1 className="title">Sign Up</h1>

            <p>Already have an account?&nbsp;
                <a href="/login" >Login</a>
            </p>
            

            <label className="label">First Name</label>
            <input
                onChange={handleFirstName}
                className="input"
                type="name"
                placeholder='Enter first name'
            />

            <label className="label">Last Name</label>
            <input
                onChange={handleLastName}
                className="input"
                type="name"
                placeholder='Enter last name'
            />

            <label className="label">Email</label>
            <input
                onChange={handleEmail}
                className="input"
                type="email"
                placeholder='Enter email'
            />

            <label className="label">Password</label>
            <input
                onChange={handlePassword}
                className="input"
                type="password"
                placeholder='Enter password'
            />

            <button onClick={handleSubmit} className="btn" > Submit </button>
        </div>
    )
}

export default SignUp