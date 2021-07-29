import React, { Component } from 'react';

import "../ServingNow/Landing.css";
import shopping from '../Assets/shopping.png';
import login from '../Assets/login.svg';
import register from '../Assets/register.svg';
import rectangle from '../Assets/rectangle.svg';

class Landing extends Component {
    render() {
        return (
            <div>
                <img src={shopping} alt="" class="shopping"/>
                <img src={login} alt="" class="login"/>
                <img src={register} alt="" class="register"/>
                <img src={rectangle} alt="" class="rectangle"/>

                <div class="header">
                    <h1> <b>Serving Now</b></h1>
                </div>
                
                <div class="text">
                    <h1><b> Welcome to <font color="#E7404A">Serving Now</font> </b> </h1>
                    <p></p>
                    <px></px>
                    <h3><b> To continue </b> </h3> 
                </div>
            </div>
        )
    }
}

export default Landing