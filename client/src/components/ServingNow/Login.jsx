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
import axios from 'axios';
import { API_URL } from "../../reducers/constants";
import {
  loginAttempt,
  changeEmail,
  changePassword,
  errMessage,
  getErrMessage,
  socialLoginAttempt
} from "../../reducers/actions/loginActions";
import { createBrowserHistory } from "history";
import { useHistory } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(); 
    const [validation, setValidation] = useState('');

    const history = useHistory()

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const successLogin = page => {

      history.push(page)
    }

    const handleClick = () => {
      console.log('in handle click')
      axios
        .post(API_URL + "accountsalt", {email: email})
        .then(res => {
          console.log(res)
          let saltObject = res
          if (!(saltObject.data.code && saltObject.data.code !== 200)) {
            let hashAlg = saltObject.data.result[0].password_algorithm;
            let salt = saltObject.data.result[0].password_salt;
            if (hashAlg !== null && salt !== null) {
              switch (hashAlg) {
                case "SHA512":
                  hashAlg = "SHA-512";
                  break;

                default:
                  break;
              }
            }

            let saltedPassword = password + salt
            const encoder = new TextEncoder()
            const data = encoder.encode(saltedPassword)
            crypto.subtle.digest(hashAlg, data).then(res => {
              let hash = res;
              let hashArray = Array.from(new Uint8Array(hash))
              let hashedPassword = hashArray
                .map(byte => byte.toString(16).padStart(2, "0"))
                .join("")
              
              axios
                .post(API_URL + "login", {email: email, password: hashedPassword, social_id: "", signup_platform: ""})
                .then(res => {
                  console.log(res)
                  let customerInfo = res.data.result[0];
                  document.cookie = "customer_uid=" + customerInfo.customer_uid

                  history.push("/")
                })
                .catch(err => {
                  console.log(err)
                })
            })
          } else if (res.data.code === 406 || res.data.code === 404) {
            console.log("Invalid credentials");  
          } else if (res.data.code === 401) {
            console.log("Need to log in by social media");
          } else {
            console.log("Unknown login error");
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

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
            <div id="loginfth" class="page">
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
                      id='phoneNumber'
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
                    <button style={{color: 'white', background: "#e7404a", border:"none", textAlign:"center"}}
                      onClick={() => {
                        // console.log(email, password)
                        // // obj for normal login
                        // var myObj = {
                        //   email: email,
                        //   password: password,
                        //   social_id: '',
                        //   signup_platform: ''
                        // }

                        // axios
                        //   .post(API_URL+'login', myObj)
                        //   .then(response => {
                        //     console.log(response)
                        //   })
                        //   .catch(err => {
                        //     console.log(err)
                        //   })
                        // console.log(loginAttempt)
                        handleClick()
                        // history.push('/')
                      }}
                    > <b>Login </b> </button>
                </div>
            </div>
        )
}