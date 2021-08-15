import React, { Component } from 'react';
import { useState, useContext } from 'react';

import "../ServingNow/Login.css";


import shopping from '../Assets/shopping.png';
import box from '../Assets/loginBox.png';
// import textBox from '../Assets/textBox.svg';
import login1 from '../Assets/login1.svg';
import visibility from '../Assets/visibility.svg';
import google from '../Assets/google.svg';
import apple from '../Assets/apple.svg';
import fb from '../Assets/fb.svg';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(); 
    const [validation, setValidation] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    
      const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     console.log('event', event, email, password);
    //     axios
    //       .get(
    //         'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev//api/v2/loginTA/' +
    //           email.toString() +
    //           '/' +
    //           password.toString()
    //       )
    //       .then((response) => {
    //         console.log('response', response.data);
    //         if (response.data.result !== false) {
    //           setLoggedIn(true);
    //           console.log('response id', response)
    //         }
    //     }
    // }

      return (
            <div id="loginfth">
                <img src={shopping} alt="" class="shopping"/>
                <img src={box} alt="" class="box"/>
                <img src={login1} alt="" class="login1"/>
                <img src={visibility} alt="" class="visibility"/>
                <img src={google} alt="" class="google"/>
                <img src={apple} alt="" class="apple"/>
                <img src={fb} alt="" class="fb"/>


                <div class="header">
                    <h5> <b>Serving Now</b></h5>
                </div>

                <div class="rectangle1"> </div>

                <div class="title">
                    <h5> <b>Login to your existing account</b></h5>
                </div>

                <div class="text1">
                    <h5> <b> Or sign in with</b></h5>
                </div>

                <div class="text2">
                    <h7> <b>Don't have an account? <font color="#E7404A"> <u>Register </u> </font> </b> </h7>
                </div>

                <div class="loginPhoneNumber">
                  <span class="loginNumberInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "200px"}}
                      type='text'
                      placeholder='Phone Number / ID Number'
                      onChange= {handleEmailChange}
                    />
                    </span>
                </div>

                <div class="loginPassword">
                  <span class="loginPasswordInput">
                    <input
                      style={{marginBottom: "0px", border: "0px"}}
                      type='password'
                      id='password'
                      placeholder='Password'
                      onChange={handlePasswordChange}
                    />
                    </span>
                </div>

                <div class="loginButton">
                    <button style={{color: 'white', background: "#e7404a", border:"none", textAlign:"center"}}> <b>Login </b> </button>
                </div>
            </div>
        )
}