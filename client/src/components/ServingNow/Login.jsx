import React, { Component } from "react";
import { useState, useContext } from "react";

import "../ServingNow/Login.css";
import Cookies from "js-cookie";
import shopping from "../Assets/shopping.png";
import box from "../Assets/loginBox.png";
// import textBox from '../Assets/textBox.svg';
import login1 from "../Assets/login1.svg";
import visibility from "../Assets/visibility.svg";
import google from "../Assets/google.svg";
import apple from "../Assets/apple.svg";
import fb from "../Assets/fb.svg";
import axios from "axios";
import { API_URL } from "../../reducers/constants";
import {
  loginAttempt,
  changeEmail,
  changePassword,
  errMessage,
  getErrMessage,
  socialLoginAttempt,
} from "../../reducers/actions/loginActions";
import { createBrowserHistory } from "history";
import { useHistory } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState();
  const [validation, setValidation] = useState("");
  const [errorValue, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setemailError] = useState();
  const [passwordError, setpasswordError] = useState();
  const [socialError, setsocialError] = useState();
  const [socialMedia, setSocialMedia] = useState("");
  const history = useHistory();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const successLogin = (page) => {
    history.push(page);
  };
  const verifyLoginInfo = (e) => {
    // Attempt to login
    // Get salt for account
    axios
      .post(API_URL + "accountsalt", {
        // params: {
        phone: phone,
        // }
      })
      .then((res) => {
        // console.log(emailValue, passwordValue);
        let saltObject = res;
        if (saltObject.data.code === 200) {
          let hashAlg = saltObject.data.result[0].password_algorithm;
          let salt = saltObject.data.result[0].password_salt;
          // let salt = "cec35d4fc0c5e83527f462aeff579b0c6f098e45b01c8b82e311f87dc6361d752c30293e27027653adbb251dff5d03242c8bec68a3af1abd4e91c5adb799a01b";
          if (hashAlg != null && salt != null) {
            // Make sure the data exists
            if (hashAlg !== "" && salt !== "") {
              // Rename hash algorithm so client can understand
              switch (hashAlg) {
                case "SHA512":
                  hashAlg = "SHA-512";
                  break;
                default:
                  break;
              }
              // console.log(hashAlg);
              // Salt plain text password
              let saltedPassword = password + salt;
              // console.log(saltedPassword);
              // Encode salted password to prepare for hashing
              const encoder = new TextEncoder();
              const data = encoder.encode(saltedPassword);
              //Hash salted password
              crypto.subtle.digest(hashAlg, data).then((res) => {
                let hash = res;
                // Decode hash with hex digest
                let hashArray = Array.from(new Uint8Array(hash));
                let hashedPassword = hashArray
                  .map((byte) => {
                    return byte.toString(16).padStart(2, "0");
                  })
                  .join("");
                console.log(hashedPassword);
                let loginObject = {
                  phone: phone,
                  password: hashedPassword,
                  social_id: "",
                  signup_platform: "",
                };
                console.log(JSON.stringify(loginObject));
                axios
                  .post(API_URL + "login", loginObject, {
                    headers: {
                      "Content-Type": "text/plain",
                    },
                  })
                  //TODO: Tell Prashant social login has to be done from back end
                  .then((res) => {
                    //TODO: tell to please use Google/ Facebook login
                    console.log(res);
                    if (res.data.code === 200) {
                      setError("");
                      console.log("Login success");
                      let customerInfo = res.data.result[0];

                      Cookies.set("login-session", "good");
                      Cookies.set("customer_uid", customerInfo.customer_uid);
                      let newAccountType = customerInfo.role.toLowerCase();
                      switch (newAccountType) {
                        case "admin":
                          history.push("/admin");
                          break;
                        case "farmer":
                          history.push("/admin");
                          break;
                        case "customer":
                          history.push("/home");
                          break;
                        // Farmer roles are moving towared business Id string
                        default:
                          history.push("/admin-v2");
                          break;
                      }
                    } else if (res.data.code === 404) {
                      console.log("Invalid credentials");
                      setError("credential");
                      setErrorMessage("Invalid credentials");
                      setemailError(true);
                    } else if (res.data.code === 406) {
                      console.log("Wrong Password");
                      setError("Password");
                      setErrorMessage("Invalid Password");
                      setpasswordError(true);
                    } else if (res.data.code === 401) {
                      console.log("Need to log in by social media");
                      setError("social");
                      setErrorMessage(res.data.message);
                    } else {
                      console.log("Unknown login error");
                      setError("unknown");
                      setErrorMessage(res.data.message);
                    }
                  })
                  .catch((err) => {
                    // Log error for Login endpoint
                    if (err.response) {
                      console.log(err.response);
                    }
                    console.log(err);
                  });
              });
            }
          } else {
            // No hash/salt information, probably need to sign in by socail media
            console.log("Salt not found");
            // Try to login anyway to confirm
            let loginObject = {
              phone: phone,
              password: "test",
              social_id: "",
              signup_platform: "",
            };
            // console.log(JSON.stringify(loginObject))
            axios
              .post(API_URL + "login", loginObject, {
                headers: {
                  "Content-Type": "text/plain",
                },
              })
              .then((res) => {
                console.log(res);
                if (res.data.code === 404) {
                  console.log("Invalid credentials");
                  setError("credential");
                  setErrorMessage("Invalid credentials");
                  setemailError(true);
                } else {
                  console.log("Unknown login error");
                  setError("unknown");
                  setErrorMessage("Login failed, try again");
                }
              })
              .catch((err) => {
                // Log error for Login endpoint
                if (err.response) {
                  console.log(err.response);
                }
                console.log(err);
              });
          }
        } else if (res.data.code === 401) {
          console.log("Use Social Login");
          setError("social");
          let socialMediaUsed = res.data.result[0].user_social_media;
          let socialMediaUsedFormat =
            socialMediaUsed.charAt(0) + socialMediaUsed.slice(1).toLowerCase();
          let newErrorMessage = "Use " + socialMediaUsedFormat + " to login";
          setSocialMedia(socialMediaUsedFormat);
          setsocialError(true);
          setErrorMessage(newErrorMessage);
        } else if (res.data.code === 404) {
          // No information, probably because invalid email
          console.log("Invalid credentials");
          setError("credential");
          setErrorMessage("Invalid credentials");
          setemailError(true);
        } else {
          console.log("Unknown log in error");
          setError("Log in failed, try again");
        }
      })
      .catch((err) => {
        // Log error for account salt endpoint
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };
  const handleClick = () => {
    console.log("in handle click");
    axios
      .post(API_URL + "accountsalt", { phone: phone })
      .then((res) => {
        console.log(res);
        let saltObject = res;
        if (!(saltObject.data.code && saltObject.data.code !== 200)) {
          let hashAlg = saltObject.data.result[0].password_algorithm;
          let salt = saltObject.data.result[0].password_salt;
          if (hashAlg !== null && salt !== null) {
            switch (hashAlg) {
              case "SHA512":
                hashAlg = "SHA-512";
                break;

              default:
                break;
            }
          }

          let saltedPassword = password + salt;
          const encoder = new TextEncoder();
          const data = encoder.encode(saltedPassword);
          crypto.subtle.digest(hashAlg, data).then((res) => {
            let hash = res;
            let hashArray = Array.from(new Uint8Array(hash));
            let hashedPassword = hashArray
              .map((byte) => byte.toString(16).padStart(2, "0"))
              .join("");

            axios
              .post(API_URL + "login", {
                phone: phone,
                password: hashedPassword,
                social_id: "",
                signup_platform: "",
              })
              .then((res) => {
                console.log(res);

                let customerInfo = res.data.result[0];
                console.log(customerInfo);
                document.cookie = "customer_uid=" + customerInfo.customer_uid;

                history.push("/");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        } else if (res.data.code === 406 || res.data.code === 404) {
          console.log("Invalid credentials");
        } else if (res.data.code === 401) {
          console.log("Need to log in by social media");
        } else {
          console.log("Unknown login error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleSubmit = (event) => {
  //     event.preventDefault();
  //     console.log('event', event, email, password);
  //     axios
  //       .get(
  //         'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev//api/v2/loginTA/' +
  //           email.toString() +
  //           '/' +
  //           password.toString()
  //       )
  //       .then((response) => {
  //         console.log('response', response.data);
  //         if (response.data.result !== false) {
  //           setLoggedIn(true);
  //           console.log('response id', response)
  //         }
  //     }
  // }

  return (
    <div id="loginfth" class="page">
      <img src={shopping} alt="" class="shopping" />
      <img src={box} alt="" class="box" />

      <img src={visibility} alt="" class="visibility" />
      <img src={google} alt="" class="google" />
      <img src={apple} alt="" class="apple" />
      <img src={fb} alt="" class="fb" />

      <div class="header">
        <h5>
          {" "}
          <b>Serving Now</b>
        </h5>
      </div>

      <div class="rectangle1"> </div>

      <div class="title">
        <h5>
          {" "}
          <b>Login to your existing account</b>
        </h5>
      </div>

      <div class="text1">
        <h5>
          {" "}
          <b> Or sign in with</b>
        </h5>
      </div>

      <div class="text2">
        <h7>
          {" "}
          <b>
            Don't have an account?{" "}
            <font color="#E7404A">
              {" "}
              <a href="register" style={{ textDecoration: "none" }}>
                Register
              </a>{" "}
            </font>{" "}
          </b>{" "}
        </h7>
      </div>

      <div class="loginPhoneNumber">
        <span class="loginNumberInput">
          <input
            style={{ marginBottom: "0px", border: "0px", width: "200px" }}
            type="text"
            id="phoneNumber"
            placeholder="Phone Number / ID Number"
            onChange={handlePhoneChange}
          />
        </span>
      </div>

      <div class="loginPassword">
        <span class="loginPasswordInput">
          <input
            style={{ marginBottom: "0px", border: "0px" }}
            type="password"
            id="password"
            placeholder="Password"
            onChange={handlePasswordChange}
          />
        </span>
      </div>

      <div class="loginButton">
        <button
          style={{
            color: "white",
            background: "#e7404a",
            border: "none",
            textAlign: "center",
          }}
          onClick={verifyLoginInfo}
        >
          {" "}
          <b>Login </b>{" "}
        </button>
      </div>
    </div>
  );
}
