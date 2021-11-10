import React, { Component, useState } from 'react';
import { useHistory } from "react-router";

import axios from "axios";
import { API_URL } from "../../reducers/constants";

// import "../ServingNow/CreatePassword.css";
import styles from "../ServingNow/CreatePassword.module.css";
import shopping from '../Assets/shopping.png';
import box from '../Assets/box3.png';
import google from '../Assets/google.svg';
import apple from '../Assets/apple.svg';
import fb from '../Assets/fb.svg';
import visibility from '../Assets/visibility.svg';


// class CreatePassword extends Component {
function CreatePassword(props) {
  const history = useHistory();

  console.log("CreatePassword props: ", props);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [seePW, set_seePW] = useState(false);
  const [seeConfirmPW, set_seeConfirmPW] = useState(false);

  const handleGoogleLogin = () => {
    console.log("clicked Google");
  }

  const handleAppleLogin = () => {
    console.log("clicked Apple");
  }

  const handleFacebookLogin = () => {
    console.log("clicked FB");
  }

  const disableRegister = () => {
    console.log("\nRD");
    console.log("pw.length: ", password.length);
    console.log("pw: ", password);
    console.log("cpw: ", confirmPassword);
    if(password.length < 8 || password !== confirmPassword) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      return false;
    }
  }

  const attemptRegister = () => {
    console.log("clicked register");

    // history.push('/choose-plan');
    // let object = {
    //   email: email,
    //   password: password,
    //   first_name: firstName,
    //   last_name: lastName,
    //   phone_number: phone,
    //   address: street,
    //   unit: unit,
    //   city: city,
    //   state: state,
    //   zip_code: zip,
    //   latitude: lat.toString(),
    //   longitude: long.toString(),
    //   referral_source: "WEB",
    //   role: "CUSTOMER",
    //   social: "FALSE",
    //   social_id: "NULL",
    //   user_access_token: "FALSE",
    //   user_refresh_token: "FALSE",
    //   mobile_access_token: "FALSE",
    //   mobile_refresh_token: "FALSE",
    // };
    // console.log(JSON.stringify(object));

    // console.log("(SPWSU) creating account...");
    // axios
    //   .post(API_URL + "createAccount", object)
    //   .then((res) => {
    //     console.log(res);
    //     console.log("(SPWSU) verifying email...");
    //     axios
    //       .post(API_URL + "email_verification", {
    //         email: object.email,
    //       })
    //       .then((res) => {
    //         console.log("(EV) res: ", res);
    //         if(res.data.code === 200){
    //           if (typeof callback !== "undefined") {
    //             callback(SUCCESS, 'Account successfully created.');
    //           }
    //         } else {
    //           callback(FAILURE, <>
    //             {"Invalid email: "}
    //             <span style={{textDecoration: 'underline'}}>{email}</span>
    //           </>);
    //         }
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         callback(FAILURE, "Error verifying email.");
    //       });

    //     dispatch({
    //       type: SUBMIT_SIGNUP,
    //     });
        
      // })
      // .catch((err) => {
      //   console.log(err);
      //   if (err.response) {
      //     console.log(err.response);
      //   }
      //   callback(FAILURE, 'Error creating account.');
      // });

    
  }

  return (
    <>
      <div className={styles.banner}/>

      <div className={styles.pw_background}>
        <div
          className={styles.pw_modal}
        >
          <div
            className={styles.pw_modal_text}
            style={{
              marginTop: '30px',
              fontSize: '20px'
            }}
          > 
            <b>Create a password</b>
          </div>
          <div
            className={styles.pw_modal_text}
            style={{
              marginTop: '10px'
            }}
          > 
            <b>To securely access your account</b>
          </div>
          <div
            className={styles.pw_modal_text}
            style={{
              marginTop: '30px'
            }}
          > 
            <b>Sign in with Social Media</b>
          </div>
          <div
            className={styles.pw_modal_text}
          > 
            <b>(So you don't lose your password)</b>
          </div>

          <div
            style={{
              position: 'relative',
              marginTop: '15px',
              width: '100%',
              height: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              className={styles.socialBtn}
              style={{
                backgroundImage: `url(${google})`
              }}
              onClick={() => {
                handleGoogleLogin();
              }}
            />
            <button
              className={styles.socialBtn}
              style={{
                backgroundImage: `url(${apple})`
              }}
              onClick={() => {
                handleAppleLogin();
              }}
            />
            <button
              className={styles.socialBtn}
              style={{
                backgroundImage: `url(${fb})`
              }}
              onClick={() => {
                handleFacebookLogin();
              }}
            />
          </div>

          <div
            className={styles.pw_modal_text}
            style={{
              margin: '35px 0 5px 0'
            }}
          > 
            <b>Or create a password here</b>
          </div>

          <div className={styles.pw_wrapper}>
            <input
              className={styles.pw_input}
              type={seePW ? 'password' : ''}
              id='password'
              placeholder='Password'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button 
              className={styles.pw_visible_icon}
              onClick={() => {
                set_seePW(!seePW)
              }}
            />
          </div>
          <div className={styles.pw_subtext}>
            Must be at least 8 characters
          </div>

          <div className={styles.pw_wrapper}>
            <input
              className={styles.pw_input}
              type={seeConfirmPW ? 'password' : ''}
              id='password'
              placeholder='Confirm Password'
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <button 
              className={styles.pw_visible_icon}
              onClick={() => {
                set_seeConfirmPW(!seeConfirmPW)
              }}
            />
          </div>
          <div className={styles.pw_subtext}>
            Both passwords must match
          </div>

          <div
            style={{
              // border: '1px dashed',
              // position: 'relative',
              // marginTop: '15px',
              width: '100%',
              // height: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button 
              className={styles.registerBtn}
              disabled={disableRegister()}
              onClick={() => {
                attemptRegister();
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>

      {/* <img src={box} alt="" className={styles.box3}/> */}
      {/* <img src={google} alt="" class="google1"/> */}
      {/* <img src={apple} alt="" class="apple1"/> */}
      {/* <img src={fb} alt="" class="fb1"/> */}
      {/* <img src={visibility} alt="" class="visibility1"/> */}
      {/* <img src={visibility} alt="" class="visibility2"/> */}
      

      {/* <div className={styles.rectangle1}> </div> */}

      {/* <div className={styles.header}>
        <h5> <b>Serving Now</b></h5>
      </div> */}

      {/* <div class="title2">
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
            style={{
              marginBottom: "0px", 
              // border: "0px"
            }}
            type='password'
            id='password'
            placeholder='Password'
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </span>
      </div>

      <div class="confirmPassword">
        <span class="confirmPasswordInput">
          <input
            style={{
              marginBottom: "0px", 
              // border: "0px"
              border: '1px solid red'
            }}
            type='password'
            id='password'
            placeholder='Confirm Password'
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </span>
      </div>

      <div class="registerButton1">
        <a href="confirmation">
        <button style={{color: 'white', background: "#e7404a", border:"none"}}> <b>Register </b> </button> </a>
      </div>

      <div class="smallText">
        <h5 style={{fontSize: "13px", letterSpacing: "0.14px"}}> Must be at least 8 characters</h5>
        <br></br>
        <br></br>
        <br></br>
        <h5 style={{fontSize: "13px", letterSpacing: "0.14px"}}> Both passwords must match</h5>
      </div> */}

    {/* </div> */}
    </>
  )
}

export default CreatePassword;