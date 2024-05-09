import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your form submission logic here
    };

    //sign up
    let history = useNavigate()
    const [scredentials, setCredentials1] = useState({ sname: "", semail: "", spassword: "" });
    const doSignUp = async (e) => {
        e.preventDefault();
        const { sname, semail, spassword } = scredentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ sname, semail, spassword })
        });

        const json = await response.json();
        console.log(json);
        if (json.success) {
            //Save the auth token and redirect
            localStorage.setItem("token", json.authToken);
            history("/home");
            console.log("Account Created Successfully", "success");
        }
        else {
            console.log("Invalid Details", "danger");
        }
    }
    const sonChange = (e) => {
        setCredentials1({ ...scredentials, [e.target.name]: e.target.value });
    };

    return (
        <div style={{textAlign:'center'}}>
            <form className="signup" onSubmit={handleSubmit}>
                <input  type="text" placeholder="Username" name="sname" required onChange={sonChange}/>
                <input  type="text" placeholder="Email" name="semail" required onChange={sonChange}/>
                <input  type="password" placeholder="Password" name="spassword" required onChange={sonChange}/>
                <button type="submit" className="btn2" onClick={doSignUp}>
                    Sign up
                </button>
                <hr />
                <br />
                <Link to="/login"> 
                    <p style={{ color: 'black', fontSize: '12px', fontWeight: '400', padding: '0px 200px' }}>
                        Login
                    </p>
                </Link>
            </form>
        </div>
    )
}

export default SignUp