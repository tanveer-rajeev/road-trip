import React, { useContext, useState } from 'react';
import { initializeLoginFramework } from "./LoginManager";
import { UserContext } from "../../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useHistory, useLocation } from 'react-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from './LoginManager';
import { handleGoogleSignIn } from './LoginManager';
import './Login.css';

const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [password, setPassword] = useState(false);
    const googleIcon = <FontAwesomeIcon icon={faGoogle} />

    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: ''
    })

    initializeLoginFramework();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }
  
    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        if (redirect) {
            console.log("redirect");
            history.replace(from);
        } 
    }

    const handleBlur = (e) => {
        let isFieldValid;
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {

            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value);

            if (password && e.target.value === password) {
                isFieldValid = isPasswordValid && passwordHasNumber;
            } else if (password && e.target.value !== password) {
                alert('wrong confirm password')
            }

            if (!password) {
                setPassword(e.target.value);
            }

        }
        if (e.target.name === 'name') {
            isFieldValid = true;
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
          
        }
    }

    const handleSubmit = (e) => {
        console.log(user.email, user.password);
        if (newUser && user.name && user.password) {
            createUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                })
        }
        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    // console.log(res);
                    handleResponse(res, true);
                })
        }
        e.preventDefault();
    }
    return (
        <div className="login-system container">

            <h1>Credential</h1>

            <form onSubmit={handleSubmit}>
                {
                    newUser &&
                    <input className="inputClass" type="text" name="name" onBlur={handleBlur} placeholder="enter your name" required />
                }

                <br />

                <input className="inputClass" type="text" onBlur={handleBlur} placeholder="Enter your email" name="email" id="" required /> <br />
                <input className="inputClass" type="password" onBlur={handleBlur} placeholder="Enter password" name="password" required /> <br />
                <input className="inputClass" type="password" onBlur={handleBlur} placeholder="Confirm password" name="password" required /> <br />
                <input className="submitButton" type="submit" value={newUser ? 'Sign Up' : 'SIgn In'} />

            </form>

        
            <button className="googleButton" onClick={googleSignIn}>{googleIcon}Sign In With Google</button>

            <br />
            <h5> Don't have an account?

            <input  type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
                <label htmlFor="bewUser">new user sign up</label> <br />
            </h5>


        </div>
    );
};

export default Login;