import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import styles from "../Items/items.module.css";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useEffect, useReducer, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";

const google = window.google;

function AddBrand(props) {

  const addressInput = useRef(null);

  const [newBrand, setNewBrand] = useState({
    brand_name: "",
    brand_contact_first_name: "",
    brand_contact_last_name: "",
    brand_phone_num1: "",
    brand_phone_num2: "",
    brand_address: "",
    brand_unit: "",
    brand_city: "",
    brand_state: "",
    brand_zip: "",
  });

  const addressAutocomplete = () => {
    const input = document.getElementById("pac-input");
    if (input) {
      const options = {
        componentRestrictions: { country: "us" },
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener(
        "place_changed",
        (newBrandState = newBrand) => {
          let address1 = "";
          let postcode = "";
          let city = "";
          let state = "";

          let address1Field = document.querySelector("#pac-input");
          let postalField = document.querySelector("#postcode");

          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            window.alert(
              "No details available for input: '" + place.name + "'"
            );
            return;
          }

          for (const component of place.address_components) {
            const componentType = component.types[0];
            switch (componentType) {
              case "street_number": {
                address1 = `${component.long_name} ${address1}`;
                break;
              }

              case "route": {
                address1 += component.short_name;
                break;
              }

              case "postal_code": {
                postcode = `${component.long_name}${postcode}`;
                break;
              }

              case "locality":
                document.querySelector("#locality").value = component.long_name;
                city = component.long_name;
                break;

              case "administrative_area_level_1": {
                document.querySelector("#state").value = component.short_name;
                state = component.short_name;
                break;
              }
            }
          }
          address1Field.value = address1;
          postalField.value = postcode;

          const updatedBrand = {
            ...newBrandState,
            brand_address: address1,
            brand_city: city,
            brand_state: state,
            brand_zip: postcode,
          };

          // dispatch({ type: "EDIT_NEW_BRAND", payload: updatedBrand });
          setNewBrand(updatedBrand);
        }
      );
    }
  };

  const editNewBrand = (field, value) => {
    const updatedBrand = {
      ...newBrand,
      [field]: value,
    };
    setNewBrand(updatedBrand);
  };

  const postNewBrand = () => {
    const brandFormData = new FormData();

    for (const field of Object.keys(newBrand)) {
      brandFormData.append(field, newBrand[field]);
    }

    axios
      .post(`${API_URL}add_brand`, brandFormData)
      .then((response) => {
        if (response.status === 200) {
          setNewBrand({
            brand_name: "",
            brand_contact_first_name: "",
            brand_contact_last_name: "",
            brand_phone_num1: "",
            brand_phone_num2: "",
            brand_address: "",
            brand_unit: "",
            brand_city: "",
            brand_state: "",
            brand_zip: "",
          });
          props.toggleAddBrand();
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        zIndex: "101",
        left: "0",
        top: "0",
        // overflow: "auto",
        position: "fixed",
        display: "grid",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      {console.log("render AddBrand")}
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
          maxHeight: "90%",
          overflow: "scroll",
        }}
      >
        <div style={{ textAlign: "right", padding: "10px" }}>
          <ModalCloseBtn
            style={{ cursor: "pointer" }}
            onClick={() => props.toggleAddBrand()}
          />
        </div>
        <div
          style={{
            border: "none",
            paddingLeft: "15px",
            fontWeight: "bold",
          }}
        >
          <Modal.Title style={{ fontWeight: "bold" }}>Brand</Modal.Title>
          <Modal.Body>
            <div
              className={styles.modalContainerVertical}
              style={{ height: "550px" }}
            >
              <div className={styles.modalContainerHorizontal}>
                <div className={styles.modalFormLabel}>Brand Name</div>
                <input
                  className={styles.modalInput}
                  style={{ width: "55%" }}
                  value={newBrand.brand_name}
                  onChange={(event) =>
                    editNewBrand("brand_name", event.target.value)
                  }
                ></input>
              </div>
              <div className={styles.modalContainerHorizontal}>
                <div className={styles.modalFormLabel}>Corporate Office</div>
              </div>
              <div
                className={styles.modalContainerHorizontal}
                style={{ width: "420px" }}
              >
                <div className={styles.modalContainerVertical}>
                  <div>Street</div>
                  <input
                    className={styles.modalInput}
                    ref={addressInput}
                    value={newBrand.brand_address}
                    onChange={(event) =>
                      editNewBrand("brand_address", event.target.value)
                    }
                    id="pac-input"
                    name="pac-input"
                    autoComplete="chrome-off"
                  ></input>
                </div>
                <div className={styles.modalContainerVertical}>
                  <div>Unit</div>
                  <input
                    className={styles.modalInput}
                    value={newBrand.brand_unit}
                    onChange={(event) =>
                      editNewBrand("brand_unit", event.target.value)
                    }
                    id="unitNo"
                    name="unitNo"
                  ></input>
                </div>
              </div>
              <div className={styles.modalContainerVertical}>
                <div>City</div>
                <input
                  className={styles.modalInput}
                  value={newBrand.brand_city}
                  onChange={(event) =>
                    editNewBrand("brand_city", event.target.value)
                  }
                  id="locality"
                  name="locality"
                ></input>
              </div>
              <div className={styles.modalContainerHorizontal}>
                <div className={styles.modalContainerVertical}>
                  <div>State</div>
                  <input
                    className={styles.modalInput}
                    value={newBrand.brand_state}
                    onChange={(event) =>
                      editNewBrand("brand_state", event.target.value)
                    }
                    id="state"
                    name="state"
                  ></input>
                </div>
                <div className={styles.modalContainerVertical}>
                  <div>Zip</div>
                  <input
                    className={styles.modalInput}
                    value={newBrand.brand_zip}
                    onChange={(event) =>
                      editNewBrand("brand_zip", event.target.value)
                    }
                    id="postcode"
                    name="postcode"
                  ></input>
                </div>
              </div>
              <div className={styles.modalContainerHorizontal}>
                <div className={styles.modalFormLabel}>Contact Details:</div>
              </div>
              <div className={styles.modalContainerHorizontal}>
                <div className={styles.modalContainerVertical}>
                  <div>First Name</div>
                  <input
                    className={styles.modalInput}
                    value={newBrand.brand_contact_first_name}
                    onChange={(event) =>
                      editNewBrand(
                        "brand_contact_first_name",
                        event.target.value
                      )
                    }
                  ></input>
                </div>
                <div className={styles.modalContainerVertical}>
                  <div>Last Name</div>
                  <input
                    className={styles.modalInput}
                    value={newBrand.brand_contact_last_name}
                    onChange={(event) =>
                      editNewBrand(
                        "brand_contact_last_name",
                        event.target.value
                      )
                    }
                  ></input>
                </div>
              </div>
              <div className={styles.modalContainerHorizontal}>
                <div className={styles.modalContainerVertical}>
                  <div>Phone Number 1</div>
                  <input
                    className={styles.modalInput}
                    value={newBrand.brand_phone_num1}
                    onChange={(event) =>
                      editNewBrand("brand_phone_num1", event.target.value)
                    }
                  ></input>
                </div>
                <div className={styles.modalContainerVertical}>
                  <div>Phone Number 2</div>
                  <input
                    className={styles.modalInput}
                    value={newBrand.brand_phone_num2}
                    onChange={(event) =>
                      editNewBrand("brand_phone_num2", event.target.value)
                    }
                  ></input>
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
              className={styles.redButton}
              onClick={() => {
                postNewBrand();
              }}
            >
              Add Item
            </button>
            <button
              className={styles.whiteButton}
              onClick={() => props.toggleAddBrand()}
            >
              Cancel
            </button>
          </Modal.Footer>
        </div>
      </div>
      {addressAutocomplete()}
    </div>
  )
}

export default AddBrand;