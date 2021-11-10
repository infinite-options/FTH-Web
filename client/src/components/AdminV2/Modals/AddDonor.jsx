import styles from "../Items/items.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useEffect, useReducer, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import AddTags from '../Modals/AddTags';
import { createThisTypeNode } from "typescript";
import fetchAddressCoordinates from '../../../utils/FetchAddressCoordinates';

const AddDonor = (props) => {

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [street, setStreet] = useState(null);
  const [unit, setUnit] = useState(null);
  const [phone, setPhone] = useState(null);
  const [zip, setZip] = useState(null);
  const [city, setCity] = useState(null);
  const [email, setEmail] = useState(null);
  const [state, setState] = useState(null);

  const [processing, setProcessing] = useState(false);

  // set once all data fetched
  // const [dataFetched, setDataFetched] = useState(false);

  const addNewDonor = () => {
    setProcessing(true);
    console.log("adding new donor...");
        
    fetchAddressCoordinates(
      street,
      city,
      state,
      zip,
      (coords) => {
        console.log("(addNewDonor) Fetched coordinates: ", coords);

        // {
        //   "customer_email": "test4@email.com",
        //   "password": "test4@email.com",
        //   "customer_first_name": "Rael",
        //   "customer_last_name": "Persson",
        //   "customer_phone_num": "1233211232",
        //   "customer_address": "1408 Dot Ct",
        //   "customer_unit": "",
        //   "customer_city": "San Jose",
        //   "customer_state": "CA",
        //   "customer_zip": "95120",
        //   "customer_lat": "37.2368917",
        //   "customer_long": "-121.8872943",
        //   "role": "DONOR",
        //   "id_type": "email"
        // }
        // let object = {
        //   email: email,
        //   password: email,
        //   first_name: firstName,
        //   last_name: lastName,
        //   phone_number: phone,
        //   address: street,
        //   unit: unit,
        //   city: city,
        //   state: state,
        //   zip_code: zip,
        //   latitude: coords.latitude.toString(),
        //   longitude: coords.longitude.toString(),
        //   referral_source: "WEB",
        //   role: "CUSTOMER",
        //   social: "FALSE",
        //   social_id: "NULL",
        //   user_access_token: "FALSE",
        //   user_refresh_token: "FALSE",
        //   mobile_access_token: "FALSE",
        //   mobile_refresh_token: "FALSE",
        // };
        let object = {
          customer_email: email,
          password: email,
          customer_first_name: firstName,
          customer_last_name: lastName,
          customer_phone_num: phone,
          customer_address: street,
          customer_unit: unit,
          customer_city: city,
          customer_state: state,
          customer_zip: zip,
          customer_lat: coords.latitude.toString(),
          customer_long: coords.longitude.toString(),
          referral_source: "WEB",
          role: "DONOR",
          id_type: "email"
      }

        axios
          .post(API_URL + "createAccount", object)
          .then((res) => {
            console.log(res);
            console.log("(addNewDonor) verifying email...");
            axios
              .post(API_URL + "email_verification", {email})
              .then((res) => {
                console.log("(addNewDonor) res: ", res);
                if(res.status === 200){
                  console.log("(addNewDonor) donor created");
                  // if (typeof callback !== "undefined") {
                  //   callback(SUCCESS, 'Account successfully created.');
                  // }
                  setProcessing(false);
                  console.log("toggling addDonor");
                  props.toggleAddDonor(true);
                } else {
                  // callback(FAILURE, <>
                  //   {"Invalid email: "}
                  //   <span style={{textDecoration: 'underline'}}>{email}</span>
                  // </>);
                  setProcessing(false);
                }
              })
              .catch((err) => {
                console.log(err);
                // callback(FAILURE, "Error verifying email.");
                setProcessing(false);
              });
    
            // dispatch({
            //   type: SUBMIT_SIGNUP,
            // });
          })
          .catch((err) => {
            console.log(err);
            if (err.response) {
              console.log(err.response);
            }
            // callback(FAILURE, 'Error creating account.');
            setProcessing(false);
          });
      }
    );
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        zIndex: "101",
        left: "0",
        top: "0",
        position: "fixed",
        display: "grid",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      {/* {dataFetched && ( */}
        <div
          style={{
            position: "relative",
            justifySelf: "center",
            alignSelf: "center",
            display: "block",
            border: "2px solid #E7404A",
            backgroundColor: "white",
            height: "auto",
            width: "auto",
            zIndex: "102",
            padding: "10px 0px 10px 0px",
            borderRadius: "20px",
            overflow: "auto",
            maxHeight: "90%",
          }}
        >
          {/* {console.log("redndering here")} */}
          <div style={{ textAlign: "right", padding: "10px" }}>
            <ModalCloseBtn
              onClick={() => props.toggleAddDonor()}
              className={styles.closeBtn}
            />
          </div>
          <div
            style={{
              border: "none",
              paddingLeft: "15px",
              fontWeight: "bold",
            }}
          >
            <Modal.Title style={{ fontWeight: "bold" }}>Donor</Modal.Title>
            <Modal.Body>
              <div className={styles.modalContainerVertical}>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>First Name</div>
                  <input
                    className={styles.modalInput}
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>Last Name</div>
                  <input
                    className={styles.modalInput}
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>
                    Phone Number
                  </div>
                  <input
                    className={styles.modalInput}
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>
                    Email Address
                  </div>
                  <input
                    className={styles.modalInput}
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                <span className={styles.modalFormLabel}>
                    Address
                  </span>
                  <div className={styles.addressContainer}>
                    <input
                      className={styles.modalAddressInput}
                      value={street}
                      onChange={(event) =>
                        setStreet(event.target.value)
                      }
                      style={{ width: "360px" }}
                      placeholder="Address Line 1 (Street)"
                    /><br/>
                    <input
                      className={styles.modalAddressInput}
                      value={unit}
                      onChange={(event) =>
                        setUnit(event.target.value)
                      }
                      style={{ width: "360px" }}
                      placeholder="Address Line 2 (Unit, Apt, etc.)"
                    /><br/>
                    <input
                      className={styles.modalAddressInput}
                      value={city}
                      onChange={(event) =>
                        setCity(event.target.value)
                      }
                      style={{ width: "200px" }}
                      placeholder="City"
                    />
                    <input
                      className={styles.modalAddressInput}
                      value={state}
                      onChange={(event) =>
                        setState(event.target.value)
                      }
                      style={{ width: "60px" }}
                      placeholder="State"
                    />
                    <input
                      className={styles.modalAddressInput}
                      value={zip}
                      onChange={(event) =>
                        setZip(event.target.value)
                      }
                      style={{ width: "80px" }}
                      placeholder="Zipcode"
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer
              style={{
                border: "none",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <button
                disabled={processing}
                className={styles.redButton}
                onClick={() => addNewDonor()}
              >
                Add Donor
              </button>
              <button
                className={styles.whiteButton}
                onClick={() => props.toggleAddDonor()}
              >
                Cancel
              </button>
            </Modal.Footer>
          </div>
        </div>
      {/* // )} */}
    </div>
  )
}
  
export default AddDonor;