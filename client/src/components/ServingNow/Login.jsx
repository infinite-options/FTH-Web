import React, { Component } from "react";
import { useState, useContext } from "react";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Shopping from "../Assets/shopping.png";
import LoginBtn from "../Assets/login.svg";
import Input from "../Assets/input.svg";
import { makeStyles } from "@material-ui/core/styles";
import "../ServingNow/Login.css";
import Cookies from "js-cookie";
import loginBox from "../Assets/loginBox.png";
import visibility from "../Assets/visibility.svg";
import google from "../Assets/google.svg";
import apple from "../Assets/apple.svg";
import fb from "../Assets/fb.svg";
import axios from "axios";
import { API_URL } from "../../reducers/constants";

import socialG from "../Assets/google-round.png";
import socialF from "../Assets/facebook-round.png";
import socialA from "../Assets/apple-round.png";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    backgroundImage: `url(${Shopping})`,
    backgroundPosition: "center",
    backgroundSize: "70%",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  header: {
    width: "100%",
    height: "80px",
    backgroundColor: "#e7404a",
  },
  btn: {
    cursor: "pointer",
    width: "50%",
    marginLeft: "25%",
    "&:disabled": {
      opacity: '0.5'
    }
  },
  input: {
    width: "350px",
    height: "50px",
    background: "transparent `url(${Input})` 0% 0% no-repeat padding-box",
    border: "1px solid #707070",
    borderRadius: "25px",
    opacity: 1,
    marginTop: "1rem",
    paddingLeft: "1rem",
    marginLeft: "10%",
  },
  socialBtn: {
    width: "10%",
  },
}));

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
  const [awaitLogin, setAwaitLogin] = useState(false);
  const classes = useStyles();
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
    setAwaitLogin(true);
    axios
      .post(API_URL + "accountsalt", {
        // params: {
        phone: phone,
        // }
      })
      .then((res) => {
        console.log("accountsalt res: ", res);
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
                          localStorage.setItem('role', 'admin');
                          history.push("/admin");
                          break;
                        case "farmer":
                          localStorage.setItem('role', 'farmer');
                          history.push("/admin");
                          break;
                        case "customer":
                          localStorage.setItem('role', 'customer');
                          history.push("/home");
                          break;
                        // Farmer roles are moving towared business Id string
                        default:
                          localStorage.setItem('role', newAccountType);
                          console.log("customerInfo: ", customerInfo);
                          axios
                            .post(`${API_URL}business_details_update/Get`, {
                              business_uid: newAccountType,
                            })
                            .then((res) => {
                              console.log("get business res: ", res);
                              localStorage.setItem('account', JSON.stringify(res.data.result[0]));
                              history.push('/admin-v2');
                            })
                            .catch(err => {
                              console.log(err);
                              if (err.response) {
                                console.log("error: " + JSON.stringify(err.response));
                              }
                            });
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
                    setAwaitLogin(false);
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
                setAwaitLogin(false);
              })
              .catch((err) => {
                // Log error for Login endpoint
                if (err.response) {
                  console.log(err.response);
                }
                console.log(err);
                setAwaitLogin(false);
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
        setAwaitLogin(false);
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
    <div id="loginfth" className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Box className={classes.header}>
            <Typography
              style={{
                textAlign: "left",
                font: "normal normal bold 22px/26px SF Pro Display",
                letterSpacing: "0.24px",
                color: "#FFFFFF",
                opacity: 1,
                marginLeft: "10rem",
                paddingTop: "25px",
              }}
            >
              Serving Now
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid
          item
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            opacity: 1,
            backgroundColor: "#ffffff",
            borderRadius: "68px",
            border: "2px solid #E7404A",
            marginTop: "5%",
            marginLeft: "15%",
          }}
        >
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              opacity: 1,
              marginTop: "1rem",
            }}
          >
            <Typography
              style={{
                textAlign: "center",
                font: "normal normal bold 20px SF Pro Display",
                letterspacing: "0.32px",
                color: "#000000",
              }}
            >
              Login to your existing account
            </Typography>

            <input
              className={classes.input}
              type="text"
              id="phoneNumber"
              placeholder="Phone Number / ID Number"
              onChange={handlePhoneChange}
            />

            <input
              className={classes.input}
              type="password"
              id="password"
              placeholder="Password"
              onChange={handlePasswordChange}
            />
            <Typography>
              <a
                href="passwordreset"
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  font: "normal normal 600 16px SF Pro Display",
                  letterSpacing: " 0.18px",
                  color: "#E7404A",
                  opacity: 1,
                  marginLeft: "33%",
                  marginBottom: "1rem",
                }}
              >
                Forgot Password?
              </a>
            </Typography>

            {/* <img
              src={LoginBtn}
              onClick={verifyLoginInfo}
              className={classes.btn}
              style={{border: '1px dashed'}}
            /> */}
            <button
              onClick={verifyLoginInfo}
              className={classes.btn}
              disabled={awaitLogin}
              style={{
                backgroundImage: `url(${LoginBtn})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'rgb(0,0,0,0)',
                borderRadius: '25px',
                borderColor: 'rgb(0,0,0,0)',
                height: '50px',
              }}
            >
              {/* <img
                src={LoginBtn}
                // onClick={verifyLoginInfo}
                // className={classes.btn}
                style={{border: '1px dashed'}}
              /> */}
            </button>
            <Typography
              style={{
                textAlign: "center",
                font: "normal normal bold 20px SF Pro Display",
                letterspacing: "0.32px",
                color: "#000000",
                marginTop: "1rem",
              }}
            >
              Or sign in with
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <img src={socialG} alt="" className={classes.socialBtn} />
            <img src={socialA} alt="" className={classes.socialBtn} />
            <img src={socialF} alt="" className={classes.socialBtn} />
          </Grid>
          <Typography
            style={{
              textAlign: "left",
              font: "normal normal bold 20px SF Pro Display",
              letterspacing: "0.32px",
              color: "#000000",
              display: "flex",
              flexDirection: "row",
              marginBottom: "1rem",
            }}
          >
            Don't have an account?
            <a
              href="register"
              style={{
                textAlign: "center",
                textDecoration: "underline",
                font: "normal normal 600 18px SF Pro Display",
                letterSpacing: " 0.2px",
                color: "#E7404A",
                opacity: 1,
              }}
            >
              Register
            </a>
          </Typography>
        </Grid>
      </Grid>
      {/* <img src={shopping} alt="" class="shopping" />
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
      </div> */}
    </div>
  );
}
