import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    
    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your form submission logic here
    };

    //login
    let history = useNavigate()
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const doSignIn = async (e) => {
        e.preventDefault()

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        const json = await response.json();
        console.log('user : ', json.userid);

        if (json.success) {
            //Save the auth token and redirect
            localStorage.setItem("token", json.authToken);
            localStorage.setItem('userid',json.userid)
            localStorage.setItem('username',json.username)
            history("/home");
            console.log("Logged in Successfully", "success");
            // console.log(localStorage.getItem("token"))
        }
        else {
            console.log("Invalid Credentials", "danger");
        }


    };
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div style={{textAlign:'center'}}>
            <form className="login" onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" name="email" required onChange={onChange} value={credentials.email}/>
                <input type="password" placeholder="Password" name="password" required onChange={onChange} value={credentials.password}/>
                {/* <Link to="/Home" > */}
                    <button type="submit" className="btn2" onClick={doSignIn}>
                        Login
                    </button>
                {/* </Link> */}
                <hr />
                <br />
                <Link to="/signup">
                    <p style={{ color: 'black', fontSize: '12px', fontWeight: '400', padding: '0px 190px' }}>
                        SignUp
                    </p>
                </Link>
            </form>
        </div>
    )
}

export default Login