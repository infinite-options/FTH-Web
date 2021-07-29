import React, { Component } from 'react';

import "../ServingNow/Login.css";
import shopping from '../Assets/shopping.png';
import rectangle from '../Assets/thinRectangle.svg';
import box from '../Assets/loginBox.png';
import textBox from '../Assets/textBox.svg';
import login from '../Assets/login.svg';
import visibility from '../Assets/visibility.svg';
import google from '../Assets/google.svg';
import apple from '../Assets/apple.svg';
import fb from '../Assets/fb.svg';

class Login extends Component {
    render() {
        return (
            <div style={{width:'100%'}}>
                <img src={shopping} alt="" class="shopping"/>
                <img src={rectangle} alt="" class="rectangle"/>
                <img src={box} alt="" class="box"/>
                <img src={textBox} alt="" class="textBox"/>
                <img src={textBox} alt="" class="textBox2"/>
                <img src={login} alt="" class="login"/>
                <img src={visibility} alt="" class="visibility"/>
                <img src={google} alt="" class="google"/>
                <img src={apple} alt="" class="apple"/>
                <img src={fb} alt="" class="fb"/>


                <div class="header">
                    <h5> <b>Serving Now</b></h5>
                </div>

                <div class="title">
                    <h5> <b>Login to your existing account</b></h5>
                </div>

                <div class="textContent">
                    <h6 style={{color: 'black', position: 'absolute'}}> Phone Number</h6>
                </div>

                <div class="textContent2">
                    <h6 style={{color: 'black', position: 'absolute'}}> Password</h6>
                </div>

                <div class="text1">
                    <h5> <b> Or sign in with</b></h5>
                </div>

                <div class="text2">
                    <h6> Don't have an account? <font color="#E7404A"> <u>Register </u> </font> </h6>
                </div>

            </div>
        )
    }
}

export default Login