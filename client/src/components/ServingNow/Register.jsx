import React, { useState } from 'react';
import { useHistory } from "react-router";

import styles from "../ServingNow/Register.module.css";
import shopping from '../Assets/shopping.png';
import box from '../Assets/loginBox.png';
import downArrow from '../Assets/downArrow.svg';

// class Register extends Component {
function Register() {
  const history = useHistory();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  const nextPage = () => {
    history.push({
      pathname: '/createpassword',
      state: {
        registration: {
          firstName,
          lastName,
          phone,
          affiliation,
          idType,
          idNumber,
          address,
          city,
          zip
        }
      }
    });
  }

  return (
    // <div style={{width:'100%'}}>
    <>
      <div className={styles.banner}>
        {/* Serving Now */}
        <b>Serving Now</b>
      </div>

      <img src={shopping} alt="" className={styles.shopping}/>
      <img src={box} alt="" className={styles.box1}/>
      <img src={downArrow} alt="" className={styles.downArrow}/>

      <div className={styles.rectangle1}> </div>

      {/* <div className={styles.header}>
        <h5> <b>Serving Now</b></h5>
      </div> */}

      <div className={styles.title1}>
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

      <div className={styles.FirstName}>
        <span className={styles.FirstNameInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "280px"}}
            type='text'
            placeholder='First Name (required)'
            onChange={e => {
              setFirstName(e.target.value)
            }}
            value={firstName}
          />
        </span>
      </div>

      <div className={styles.LastName}>
        <span className={styles.LastNameInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "280px"}}
            type='text'
            placeholder='Last Name (required)'
            onChange={e => {
              setLastName(e.target.value)
            }}
            value={lastName}
          />
        </span>
      </div>

      <div className={styles.PhoneNumber}>
        <span className={styles.PhoneNumberInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "280px"}}
            type='text'
            placeholder='Phone Number'
            onChange={e => {
              setPhone(e.target.value)
            }}
            value={phone}
          />
        </span>
      </div>

      <div className={styles.Affiliation}>
        <span className={styles.AffiliationInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "280px"}}
            type='text'
            placeholder='School / Affiliation'
            onChange={e => {
              setAffiliation(e.target.value)
            }}
            value={affiliation}
          />
        </span>
      </div>

      <div className={styles.IDtype}>
        <span className={styles.IDtypeInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "60px"}}
            type='text'
            placeholder='ID Type'
            onChange={e => {
              setIdType(e.target.value)
            }}
            value={idType}
          />
        </span>
      </div>

      <div className={styles.IDnum}>
        <span className={styles.IDnumInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "100px"}}
            type='text'
            placeholder='ID Number'
            onChange={e => {
              setIdNumber(e.target.value)
            }}
            value={idNumber}
          />
        </span>
      </div>

      {/* <div class="title2">
          <h5> <b>For Delivery Only</b></h5>
      </div> */}

      <div className={styles.Address}>
        <span className={styles.AddressInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "280px"}}
            type='text'
            placeholder='Current Address'
            onChange={e => {
              setAddress(e.target.value)
            }}
            value={address}
          />
        </span>
      </div>

      <div className={styles.City}>
        <span className={styles.CityInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "100px"}}
            type='text'
            placeholder='City'
            onChange={e => {
              setCity(e.target.value)
            }}
            value={city}
          />
        </span>
      </div>

      <div className={styles.ZipCode}>
        <span className={styles.ZipCodeInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "120px"}}
            type='text'
            placeholder='Zip Code'
            onChange={e => {
              setZip(e.target.value)
            }}
            value={zip}
          />
        </span>
      </div>

      <div className={styles.continueButton}>
        {/* <a href="clientform"> */}
        <button
          onClick={nextPage}
          style={{
            color: "#e7404a",
            background: "white",
            border: "none"
          }}
        >
          <b>Continue </b>
        </button>
        {/* </a> */}
      </div>

    </>
  )
    // }
}

export default Register
