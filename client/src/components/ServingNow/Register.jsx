import React, { Component } from 'react';

import "../ServingNow/Register.css";
import shopping from '../Assets/shopping.png';
import box from '../Assets/loginBox.png';
import textBox from '../Assets/textBox.svg';
import smallTextBox from '../Assets/smallBox1.svg';
import continuebutton from '../Assets/continue.svg';

class Login extends Component {
    render() {
        return (
            <div style={{width:'100%'}}>
                <img src={shopping} alt="" class="shopping"/>
                <img src={box} alt="" class="box1"/>
                <img src={textBox} alt="" class="textBox3"/>
                <img src={textBox} alt="" class="textBox4"/>
                <img src={textBox} alt="" class="textBox5"/>
                <img src={textBox} alt="" class="textBox6"/>
                <img src={smallTextBox} alt="" class="textBox7"/>
                <img src={smallTextBox} alt="" class="textBox8"/>
                <img src={textBox} alt="" class="textBox9"/>
                <img src={smallTextBox} alt="" class="textBox11"/>
                <img src={smallTextBox} alt="" class="textBox12"/>
                <img src={continuebutton} alt="" class="continue"/>



                <div class="rectangle1"> </div>

                <div class="header">
                    <h5> <b>Serving Now</b></h5>
                </div>

                <div class="title1">
                    <h5> <b>Registration</b></h5>
                </div>

                <div class="title2">
                    <h5> <b>For Delivery Only</b></h5>
                </div>

                {/* <label for="fname">First name:</label> */}
                {/* <input type="text" id="fname" name="fname"> </input> */}

            </div>
        )
    }
}

export default Login