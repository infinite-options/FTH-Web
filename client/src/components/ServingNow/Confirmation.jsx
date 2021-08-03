import React, { Component } from 'react';
import confirmation from '../Assets/confirmation.png';


import "../ServingNow/Confirmation.css";

class Confirmation extends Component {
    render() {
        return (
            <div style={{width:'100%'}}>
                <img src={confirmation} alt="" class="confirmation"/>

                <div class="header">
                    <h5> <b>Serving Now</b></h5>
                </div>

                <div class="rectangle1"> </div>

                <div class="congrats">
                    <h2> <b>Congratulations!</b></h2>
                </div>

                <div class="text5">
                    <h5> <b>Your account was <br></br>successfully created</b></h5>
                </div>

                <div class="startButton">
                    <button style={{color: 'white', background: "#e7404a", border:"none"}}> <b>Start an Order </b> </button>
                </div>
            </div>
        )
    }
}

export default Confirmation