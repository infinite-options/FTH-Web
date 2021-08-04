import React, { Component } from 'react';

import "../ServingNow/Register.css";
import shopping from '../Assets/shopping.png';
import box from '../Assets/loginBox.png';
import continuebutton from '../Assets/continue.svg';
import downArrow from '../Assets/downArrow.svg';

class Register extends Component {
    render() {
        return (
            <div style={{width:'100%'}}>
                <img src={shopping} alt="" class="shopping"/>
                <img src={box} alt="" class="box1"/>
                <img src={continuebutton} alt="" class="continue"/>
                <img src={downArrow} alt="" class="downArrow"/>

                <div class="rectangle1"> </div>

                <div class="header">
                    <h5> <b>Serving Now</b></h5>
                </div>

                <div class="title1">
                    <h5> <b>Registration</b></h5>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <h5> <b>For Delivery Only</b></h5>
                </div>

                <div class="FirstName">
                  <span class="FirstNameInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "280px"}}
                      type='text'
                      placeholder='First Name (required)'
                    />
                    </span>
                </div>

                <div class="LastName">
                  <span class="LastNameInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "280px"}}
                      type='text'
                      placeholder='Last Name (required)'
                    />
                    </span>
                </div>

                <div class="PhoneNumber">
                  <span class="PhoneNumberInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "280px"}}
                      type='text'
                      placeholder='Phone Number'
                    />
                    </span>
                </div>

                <div class="Affiliation">
                  <span class="AffiliationInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "280px"}}
                      type='text'
                      placeholder='School / Affiliation'
                    />
                    </span>
                </div>

                <div class="IDtype">
                  <span class="IDtypeInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "60px"}}
                      type='text'
                      placeholder='ID Type'
                    />
                    </span>
                </div>

                <div class="IDnum">
                  <span class="IDnumInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "100px"}}
                      type='text'
                      placeholder='ID Number'
                    />
                    </span>
                </div>

                {/* <div class="title2">
                    <h5> <b>For Delivery Only</b></h5>
                </div> */}

                <div class="Address">
                  <span class="AddressInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "280px"}}
                      type='text'
                      placeholder='Current Address'
                    />
                    </span>
                </div>

                <div class="City">
                  <span class="CityInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "100px"}}
                      type='text'
                      placeholder='City'
                    />
                    </span>
                </div>

                <div class="ZipCode">
                  <span class="ZipCodeInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "120px"}}
                      type='text'
                      placeholder='ID Number'
                    />
                    </span>
                </div>

            </div>
        )
    }
}

export default Register