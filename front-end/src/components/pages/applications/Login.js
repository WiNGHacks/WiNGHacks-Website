import React, {useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

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
        console.log(process.env.REACT_APP_LOGIN_API_URL)
        //Prevent submissions before changing values
        e.preventDefault();
        axios.post(process.env.REACT_APP_LOGIN_API_URL, {
            email: email,
            password: password,
        }).then((response)=>{
            console.log(response.data)
            setLogin(true);
            // alert(response.data.message)
            navigate("/",{replace: true});
        }).catch((error) => {
            console.log(error)
        })

    };
 

    return (
        <div>
            <h1 className="title">Login</h1>
            <p>Don't have an account?&nbsp;
                <a href="/signup" >SignUp</a>
            </p>
            

            <label className="label">Email</label>
            <input
                onChange={handleEmail}
                className="input"
                type="email"
                placeholder='Enter email'
            />
            {console.log(email)}

            <label className="label">Password</label>
            <input
                onChange={handlePassword}
                className="input"
                type="password"
                placeholder='Enter password'
            />
            {console.log(password)}
            <button onClick={handleSubmit} className="btn" > Submit </button>
        
        </div>
    )
}

export default Login