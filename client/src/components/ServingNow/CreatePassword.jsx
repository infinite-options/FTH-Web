import React, { Component } from 'react';

import "../ServingNow/CreatePassword.css";
import shopping from '../Assets/shopping.png';
import box from '../Assets/box3.png';
import google from '../Assets/google.svg';
import apple from '../Assets/apple.svg';
import fb from '../Assets/fb.svg';
import visibility from '../Assets/visibility.svg';


class CreatePassword extends Component {
    render() {
        return (
            <div style={{width:'100%'}}>
                <img src={shopping} alt="" class="shopping"/>
                <img src={box} alt="" class="box3"/>
                <img src={google} alt="" class="google1"/>
                <img src={apple} alt="" class="apple1"/>
                <img src={fb} alt="" class="fb1"/>
                <img src={visibility} alt="" class="visibility1"/>
                <img src={visibility} alt="" class="visibility2"/>


                <div class="rectangle1"> </div>

                <div class="header">
                    <h5> <b>Serving Now</b></h5>
                </div>

                <div class="title2">
                    <h5> <b>Create a password</b></h5>
                </div>

                <div class="subTitle">
                    <h5 style={{fontSize: "16px"}}> <b>To securely access your account</b></h5>
                    <br></br>
                    <br></br>
                    <h5 style={{fontSize: "16px"}}> <b>Sign in with Social Media <br></br>(So you don't lose your password)</b></h5>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <h5 style={{fontSize: "16px"}}> <b>Or create a password here</b></h5>
                </div>

                <div class="createPassword">
                  <span class="createPasswordInput">
                    <input
                      style={{marginBottom: "0px", border: "0px"}}
                      type='password'
                      id='password'
                      placeholder='Password'
                    />
                    </span>
                </div>

                <div class="confirmPassword">
                  <span class="confirmPasswordInput">
                    <input
                      style={{marginBottom: "0px", border: "0px"}}
                      type='password'
                      id='password'
                      placeholder='Confirm Password'
                    />
                    </span>
                </div>

                <div class="registerButton1">
                    <button style={{color: 'white', background: "#e7404a", border:"none"}}> <b>Register </b> </button>
                </div>

                <div class="smallText">
                    <h5 style={{fontSize: "13px", letterSpacing: "0.14px"}}> Must be at least 8 characters</h5>
                    <br></br>
                    <br></br>
                    <br></br>
                    <h5 style={{fontSize: "13px", letterSpacing: "0.14px"}}> Both passwords must match</h5>
                </div>

            </div>
        )
    }
}

export default CreatePassword