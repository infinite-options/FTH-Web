import React, { Component } from 'react';

import "../ServingNow/Landing.css";
import shopping from '../Assets/shopping.png';
import register from '../Assets/register.svg';
import login2 from '../Assets/login2.svg';

class Landing extends Component {
    render() {
        return (
            <div>
                <img src={shopping} alt="" class="shopping"/>
                <img src={register} alt="" class="register"/>
                <img src={login2} alt="" class="login"/>

                <div class="rectangle"> </div>

                <div class="header">
                    <h1><b>Serving Now</b></h1>
                </div>
                
                <div>
                <div class="text">
                    <h1><b> Welcome to <font color="#E7404A">Serving Now</font> </b> </h1>
                    <p></p>
                    <px></px>
                    <h3><b> To continue </b> </h3> 
                </div>

                <div class="loginButton1">
                    <a href="loginfth">
                    <button style={{color: 'white', background: "#e7404a", border:"none"}} >
                    <b>Login </b> </button> </a>
                </div>

                <div class="registerButton">
                    <a href="register">
                    <button style={{color: "#e7404a", background: "white", border: "none"}}> <b>Register </b> </button>
                    </a>
                </div>
                </div>
            </div>
        )
    }
}

export default Landing