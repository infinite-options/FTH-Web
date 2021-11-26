import React, { useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { useHistory } from "react-router";

import axios from "axios";
import { API_URL } from "../../reducers/constants";

import styles from "../ServingNow/ClientForm.module.css";

export default function ClientForm(props) {
  const history = useHistory();

  const [clientName, setClientName] = useState('');
  const [SSN_last4, set_SSN_last4] = useState('');
  const [DOB, setDOB] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [homePhone, setHomePhone] = useState('');

  const [hh_member_name, set_hh_member_name] = useState('');
  const [hh_member_age, set_hh_member_age] = useState('');
  const [hh_member_relation, set_hh_member_relation] = useState('');
  const [household, setHousehold] = useState([]);

  const nextPage = () => {
    history.push({
      pathname: '/clientform',
      registration: props.location.registration,
      client_form: {
        clientName,
        SSN_last4,
        DOB,
        address,
        city,
        county,
        state,
        zip,
        cellPhone,
        homePhone,
        household
      }
    });
  }

  const submitForm = () => {
    console.log('submit client form');
    household.push({
      age: hh_member_age,
      name: hh_member_name,
      relationship: hh_member_relation
    });
    const object = {
      customer_uid: localStorage.getItem('customer_uid'),
      name: clientName,
      last4_ssn: SSN_last4,
      dob: DOB,
      address: address,
      city: city,
      county: county,
      state: state,
      zip: zip,
      cell_phone: cellPhone,
      home_phone: homePhone,
      household_members: JSON.stringify(household)
    };
    console.log("POST /clientForm")
    axios.post(API_URL + "clientForm", object)
      .then((res) => {
        console.log(res);
        history.push('/home');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>

      <div className={styles.header}>
        <h5> <b>Serving Now</b> </h5>
      </div>

      <div className={styles.rectangle1}> </div>

      <div className={styles.box4}> </div>



      <div className={styles.title3}>
          <h5> <b>Client Intake Form</b></h5>
      </div>

      {/* Client Info: */}

      <div className={styles.subheading1}>
          <h6 style={{fontSize:"16px"}}> <b>Client Info:</b></h6>
      </div>

      <div className={styles.ClientName}>
        <span className={styles.ClientNameInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Client Name'
            onChange={e => {
              setClientName(e.target.value)
            }}
            value={clientName}
          />
          </span>
      </div>

      <div className={styles.SSN}>
        <span className={styles.SSNInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Last 4 digits of Social Security'
            onChange={e => {
              set_SSN_last4(e.target.value)
            }}
            value={SSN_last4}
          />
          </span>
      </div>

      <div className={styles.DOB}>
        <span class="DOBInput">
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='DOB'
            onChange={e => {
              setDOB(e.target.value)
            }}
            value={DOB}
          />
          </span>
      </div>

      <div className={styles.CurrentAddress}>
        <span className={styles.CurrentAddressInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Current Address'
            onChange={e => {
              setAddress(e.target.value)
            }}
            value={address}
          />
          </span>
      </div>

      <div className={styles.City1}>
        <span className={styles.City1Input}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='City'
            onChange={e => {
              setCity(e.target.value)
            }}
            value={city}
          />
          </span>
      </div>

      <div className={styles.County}>
        <span className={styles.CountyInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='County'
            onChange={e => {
              setCounty(e.target.value)
            }}
            value={county}
          />
          </span>
      </div>

      <div className={styles.State}>
        <span className={styles.StateInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='State'
            onChange={e => {
              setState(e.target.value)
            }}
            value={state}
          />
          </span>
      </div>

      <div className={styles.ZipCode1}>
        <span className={styles.ZipCode1Input}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='Zip Code'
            onChange={e => {
              setZip(e.target.value)
            }}
            value={zip}
          />
          </span>
      </div>

      <div className={styles.HomePhone}>
        <span className={styles.HomePhoneInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Phone (home)'
            onChange={e => {
              setHomePhone(e.target.value)
            }}
            value={homePhone}
          />
          </span>
      </div>

      <div className={styles.CellPhone}>
        <span className={styles.CellPhoneInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Phone (cell)'
            onChange={e => {
              setCellPhone(e.target.value)
            }}
            value={cellPhone}
          />
          </span>
      </div>

      {/* Household Info: */}
      <div className={styles.subheading2}>
          <h6 style={{fontSize:"16px"}}> <b>Household Info:</b></h6>
      </div>

      <div className={styles.subheading2text}>
          <h6 style={{fontSize:"16px"}}> List names, ages and relationships of household family members</h6>
      </div>

      <div className={styles.Member}>
          <h6 style={{fontSize:"16px", color: "#e7404a"}}> Member 1: </h6>
      </div>

      <div className={styles.Name}>
        <span className={styles.NameInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Name'
            onChange={e => {
              set_hh_member_name(e.target.value)
            }}
            value={hh_member_name}
          />
          </span>
      </div>

      <div className={styles.Age}>
        <span className={styles.AgeInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='Age'
            onChange={e => {
              set_hh_member_age(e.target.value)
            }}
            value={hh_member_age}
          />
          </span>
      </div>

      <div className={styles.Relationship}>
        <span className={styles.RelationshipInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='Relationship'
            onChange={e => {
              set_hh_member_relation(e.target.value)
            }}
            value={hh_member_relation}
          />
          </span>
      </div>

      <div className={styles.submitButton}>
          {/* <a href="createpassword"> */}
          <button
            style={{
              color: "#e7404a",
              background: "white",
              border: "none"
            }}
            onClick={submitForm}
          >
            <b>Submit Form</b>
          </button>
          {/* </a> */}
      </div>

    </div>
  )
}
