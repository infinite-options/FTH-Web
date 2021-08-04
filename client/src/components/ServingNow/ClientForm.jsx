import React from "react";

import "../ServingNow/ClientForm.css";

export default function ClientForm() {
    return (
        <div>

            <div class="header">
                    <h5> <b>Serving Now</b> </h5>
                </div>

                <div class="rectangle1"> </div>

                <div class="box4"> </div>

                

                <div class="title3">
                    <h5> <b>Client Intake Form</b></h5>
                </div>

                {/* Client Info: */}

                <div class="subheading1">
                    <h6 style={{fontSize:"16px"}}> <b>Client Info:</b></h6>
                </div>

                <div class="ClientName">
                  <span class="ClientNameInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "600px"}}
                      type='text'
                      placeholder='Client Name'
                    />
                    </span>
                </div>

                <div class="SSN">
                  <span class="SSNInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "600px"}}
                      type='text'
                      placeholder='Last 4 digits of Social Security'
                    />
                    </span>
                </div>

                <div class="DOB">
                  <span class="DOBInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "600px"}}
                      type='text'
                      placeholder='DOB'
                    />
                    </span>
                </div>

                <div class="CurrentAddress">
                  <span class="CurrentAddressInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "600px"}}
                      type='text'
                      placeholder='Current Address'
                    />
                    </span>
                </div>

                <div class="City1">
                  <span class="City1Input">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "200px"}}
                      type='text'
                      placeholder='City'
                    />
                    </span>
                </div>

                <div class="County">
                  <span class="CountyInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "200px"}}
                      type='text'
                      placeholder='County'
                    />
                    </span>
                </div>

                <div class="State">
                  <span class="StateInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "200px"}}
                      type='text'
                      placeholder='State'
                    />
                    </span>
                </div>

                <div class="ZipCode1">
                  <span class="ZipCode1Input">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "200px"}}
                      type='text'
                      placeholder='Zip Code'
                    />
                    </span>
                </div>

                <div class="HomePhone">
                  <span class="HomePhoneInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "600px"}}
                      type='text'
                      placeholder='Phone (home)'
                    />
                    </span>
                </div>

                <div class="CellPhone">
                  <span class="CellPhoneInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "600px"}}
                      type='text'
                      placeholder='Phone (cell)'
                    />
                    </span>
                </div>

                {/* Household Info: */}
                <div class="subheading2">
                    <h6 style={{fontSize:"16px"}}> <b>Household Info:</b></h6>
                </div>

                <div class="subheading2text">
                    <h6 style={{fontSize:"16px"}}> List names, ages and relationships of household family members</h6>
                </div>

                <div class="Member">
                    <h6 style={{fontSize:"16px", color: "#e7404a"}}> Member 1: </h6>
                </div>

                <div class="Name">
                  <span class="NameInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "600px"}}
                      type='text'
                      placeholder='Name'
                    />
                    </span>
                </div>

                <div class="Age">
                  <span class="AgeInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "200px"}}
                      type='text'
                      placeholder='Age'
                    />
                    </span>
                </div>

                <div class="Relationship">
                  <span class="RelationshipInput">
                    <input
                      style={{marginBottom: "0px", border: "0px", width: "200px"}}
                      type='text'
                      placeholder='Relationship'
                    />
                    </span>
                </div>

                <div class="submitButton">
                    <a href="createpassword">
                    <button style={{color: "#e7404a", background: "white", border: "none"}}> <b>Submit Form</b> </button>
                    </a>
                </div>

        </div>
    )
}