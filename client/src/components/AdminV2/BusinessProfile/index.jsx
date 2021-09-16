import { useEffect, useReducer, useState, useRef, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import {
  Table,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
  Popover,
} from "@material-ui/core";
import { style } from "@material-ui/system";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import AdminNavBar from "../AdminNavBar";
import { act } from "react-dom/test-utils";
import { formatTime, sortedArray } from "../../../reducers/helperFuncs";
import styles from "./businessProfile.module.css";

import { ReactComponent as FacebookIcon } from "../../../images/facebookIconNoBorder.svg";
import { ReactComponent as TwitterIcon } from "../../../images/twitterIconNoBorder.svg";
import { ReactComponent as InstagramIcon } from "../../../images/instagramIconNoBorder.svg";
import { ReactComponent as GlobeIcon } from "../../../images/globeIconNoBorder.svg";
import CanIconSVG from "../../../images/canIcon.svg";
import SnackIconSVG from "../../../images/snackIcon.svg";
import DairyIconSVG from "../../../images/dairyIcon.svg";
import BeverageIconSVG from "../../../images/beverageIcon.svg";
import DessertIconSVG from "../../../images/dessertIcon.svg";
import MealIconSVG from "../../../images/mealIcon.svg";
import VegetableIconSVG from "../../../images/vegetableIcon.svg";
import FruitIconSVG from "../../../images/fruitIcon.svg";

const initialState = {
  mounted: false,
  showEditProfile: false,
  businessProfileInfo: null,
  editedBusinessProfileInfo: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "SET_BUSINESS_PROFILE_INFO":
      return {
        ...state,
        businessProfileInfo: action.payload,
      };
    case "SET_EDITED_BUSINESS_PROFILE_INFO":
      return {
        ...state,
        editedBusinessProfileInfo: action.payload,
      };
    case "TOGGLE_SHOW_EDIT_PROFILE":
      return {
        ...state,
        showEditProfile: !state.showEditProfile,
      };
    default:
      return state;
  }
}

function BusinessProfile({ history, ...props }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check for log in
  useEffect(() => {
    if (
      document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("customer_uid="))
    ) {
      // Logged in
      let customer_uid = document.cookie
        .split("; ")
        .find((row) => row.startsWith("customer_uid"))
        .split("=")[1];
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const role = response.data.result[0].role.toLowerCase();
          if (role !== "admin" && role !== "customer") {
            // console.log("mounting")
            // console.log(state.mounted);
            dispatch({ type: "MOUNT" });
            // console.log("dispatch MOUNT");
          } else {
            history.push("/meal-plan");
          }
        })
        .catch((err) => {
          if (err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response);
          }
          // eslint-disable-next-line no-console
          console.log(err);
        });
    } else {
      // Reroute to log in page
      history.push("/");
    }
  }, [history]);

  useEffect(() => {
    getBusinessData();
  }, []);

  const parseBusinessHours = (hours) => {
    if (hours.length > 0) {
      return JSON.parse(hours);
    }
    return JSON.parse(
      '{"Friday": ["N/A", "N/A"], "Monday": ["N/A", "N/A"], "Sunday": ["N/A", "N/A"], "Tuesday": ["N/A", "N/A"], "Saturday": ["N/A", "N/A"], "Thursday": ["N/A", "N/A"], "Wednesday": ["N/A", "N/A"]}'
    );
  };

  const parseItemTypes = (itemTypes) => {
    if (itemTypes !== null && itemTypes !== "None") {
      return JSON.parse(itemTypes);
    } else {
      return {
        fruits: 0,
        vegetables: 0,
        meals: 0,
        desserts: 0,
        beverages: 0,
        dairy: 0,
        snacks: 0,
        cannedFoods: 0,
      };
    }
  };

  const getBusinessData = () => {
    axios
      .post(`${API_URL}business_details_update/Get`, {
        business_uid: "200-000006",
      })
      .then((response) => {
        const profileInfo = response.data.result[0];
        const formatedProfileInfo = {
          ...profileInfo,
          business_accepting_hours: parseBusinessHours(
            profileInfo.business_accepting_hours
          ),
          item_types: parseItemTypes(profileInfo.item_types),
        };
        dispatch({
          type: "SET_BUSINESS_PROFILE_INFO",
          payload: formatedProfileInfo,
        });
      });
  };

  const getBusinessProfileInfo = (field) => {
    if (state.businessProfileInfo && state.businessProfileInfo[field]) {
      return state.businessProfileInfo[field];
    } else {
      return "";
    }
  };

  const getFoodType = (type) => {
    if (state.businessProfileInfo && state.businessProfileInfo.item_types) {
      return state.businessProfileInfo.item_types[type];
    } else {
      return 0;
    }
  };

  const toggleEditProfile = () => {
    dispatch({ type: "TOGGLE_SHOW_EDIT_PROFILE" });
  };

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      {console.log(state)}
      <AdminNavBar currentPage={"business-profile"} />
      <Container fluid className={styles.container}>
        <Row
          id="header"
          className={styles.section}
          style={{ height: "123px", padding: "26px 19px" }}
        >
          <Col md="auto">
            <div className={styles.headerText}>Profile</div>
          </Col>
          <Col></Col>
          <Col md="auto">
            <button
              className={styles.headerButtonWhite}
              onClick={() => toggleEditProfile()}
            >
              Edit Profile
            </button>
          </Col>
        </Row>
        {/* EDIT PROFILE MODAL */}
        {state.showEditProfile && (
          <Row
            id="main"
            className={styles.section}
            style={{ marginTop: "20px", backgroundColor: "#FEE3E5" }}
          >
            <div className={styles.editBusinessFormContainer}>
              <div style={{ width: "300px" }}>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <img
                    height="150px"
                    width="150px"
                    src=""
                    // src={state.editedBusinessData.business_image}
                  ></img>
                  <input
                    type="file"
                    name="upload_file"
                    // onChange={(e) => {
                    //   state.selectedFile = e.target.files[0];
                    //   editBusiness(
                    //     "business_image",
                    //     URL.createObjectURL(e.target.files[0])
                    //   );
                    // }}
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label>Food Bank Name</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Business Name"
                    // value={state.editedBusinessData.business_name}
                    // onChange={(event) =>
                    //   editBusiness("business_name", event.target.value)
                    // }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label>Business Type</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Business Type"
                    // value={state.editedBusinessData.business_type}
                    // onChange={(event) =>
                    //   editBusiness("business_type", event.target.value)
                    // }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label>Business Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Business Description"
                    // value={state.editedBusinessData.business_desc}
                    // onChange={(event) =>
                    //   editBusiness("business_desc", event.target.value)
                    // }
                  />
                </Form.Group>
              </div>

              <div
                style={{ borderLeft: "1px solid #e7404a", display: "flex" }}
              />

              <div style={{ width: "30%" }}>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter First Name"
                      // value={
                      //   state.editedBusinessData.business_contact_first_name
                      // }
                      // onChange={(event) =>
                      //   editBusiness(
                      //     "business_contact_first_name",
                      //     event.target.value
                      //   )
                      // }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Last Name"
                      // value={
                      //   state.editedBusinessData.business_contact_last_name
                      // }
                      // onChange={(event) =>
                      //   editBusiness(
                      //     "business_contact_last_name",
                      //     event.target.value
                      //   )
                      // }
                    />
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Phone Number 1</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Phone Number"
                      // value={state.editedBusinessData.business_phone_num}
                      // onChange={(event) =>
                      //   editBusiness("business_phone_num", event.target.value)
                      // }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Phone Number 2</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Phone Number"
                      // value={state.editedBusinessData.business_phone_num2}
                      // onChange={(event) =>
                      //   editBusiness("business_phone_num2", event.target.value)
                      // }
                    />
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "60%" }}>
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Street Address"
                      // value={state.editedBusinessData.business_address}
                      // onChange={(event) =>
                      //   editBusiness("business_address", event.target.value)
                      // }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "30%" }}>
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Unit No."
                      // value={state.editedBusinessData.business_unit}
                      // onChange={(event) =>
                      //   editBusiness("business_unit", event.target.value)
                      // }
                    />
                  </Form.Group>
                </Row>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter City"
                    // value={state.editedBusinessData.business_city}
                    // onChange={(event) =>
                    //   editBusiness("business_city", event.target.value)
                    // }
                  />
                </Form.Group>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter State"
                      // value={state.editedBusinessData.business_state}
                      // onChange={(event) =>
                      //   editBusiness("business_state", event.target.value)
                      // }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Zip"
                      // value={state.editedBusinessData.business_zip}
                      // onChange={(event) =>
                      //   editBusiness("business_zip", event.target.value)
                      // }
                    />
                  </Form.Group>
                  <Form.Group
                    style={{
                      width: "90%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Form.Label>Storage</Form.Label>
                    <br />
                    <input
                      type="radio"
                      id="reusable"
                      name="storage"
                      // value={1}
                      // checked={state.editedBusinessData.reusable === 1}
                      // onChange={(event) =>
                      //   editBusiness("reusable", Number(event.target.value))
                      // }
                    />{" "}
                    Reusable
                    <br />
                    <input
                      type="radio"
                      id="disposable"
                      name="storage"
                      // value={0}
                      // checked={state.editedBusinessData.reusable === 0}
                      // onChange={(event) =>
                      //   editBusiness("reusable", Number(event.target.value))
                      // }
                    />{" "}
                    Disposable
                  </Form.Group>
                  <Form.Group
                    style={{
                      width: "90%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Form.Label>Cancellation</Form.Label>
                    <br />
                    <input
                      type="radio"
                      id="can_cancel"
                      name="cancellation"
                      // value={1}
                      // checked={state.editedBusinessData.can_cancel === 1}
                      // onChange={(event) =>
                      //   editBusiness("can_cancel", Number(event.target.value))
                      // }
                    />{" "}
                    Allow cancellation within ordering hours
                    <br />
                    <input
                      type="radio"
                      id="no_cancel"
                      name="cancellation"
                      // value={0}
                      // checked={state.editedBusinessData.can_cancel === 0}
                      // onChange={(event) =>
                      //   editBusiness("can_cancel", Number(event.target.value))
                      // }
                    />{" "}
                    Cancellations not allowed
                  </Form.Group>
                  <Form.Group
                    style={{
                      width: "90%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Form.Label>Business Status</Form.Label>
                    <br />
                    <input
                      type="radio"
                      id="active"
                      name="businessStatus"
                      // value={"ACTIVE"}
                      // checked={
                      //   state.editedBusinessData.business_status === "ACTIVE"
                      // }
                      // onChange={(event) =>
                      //   editBusiness("business_status", event.target.value)
                      // }
                    />{" "}
                    Active
                    <br />
                    <input
                      type="radio"
                      id="Inactive"
                      name="businessStatus"
                      // value={"INACTIVE"}
                      // checked={
                      //   state.editedBusinessData.business_status === "INACTIVE"
                      // }
                      // onChange={(event) =>
                      //   editBusiness("business_status", event.target.value)
                      // }
                    />{" "}
                    Inactive
                  </Form.Group>
                </Row>
              </div>

              <div
                style={{ borderLeft: "1px solid #e7404a", display: "flex" }}
              />

              <div style={{ width: "300px" }}>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label>Types of Food</Form.Label>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("fruits")}
                      // onChange={() => changeTypeOfFood("fruits")}
                    />
                    <img src={FruitIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Fruits
                    </div>
                  </div>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("vegetables")}
                      // onChange={() => changeTypeOfFood("vegetables")}
                    />
                    <img src={VegetableIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Vegetables
                    </div>
                  </div>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("meals")}
                      // onChange={() => changeTypeOfFood("meals")}
                    />
                    <img src={MealIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Meals
                    </div>
                  </div>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("desserts")}
                      // onChange={() => changeTypeOfFood("desserts")}
                    />
                    <img src={DessertIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Desserts
                    </div>
                  </div>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("beverages")}
                      // onChange={() => changeTypeOfFood("beverages")}
                    />
                    <img src={BeverageIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Beverages
                    </div>
                  </div>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("dairy")}
                      // onChange={() => changeTypeOfFood("dairy")}
                    />
                    <img src={DairyIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Dairy
                    </div>
                  </div>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("snacks")}
                      // onChange={() => changeTypeOfFood("snacks")}
                    />
                    <img src={SnackIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Snacks
                    </div>
                  </div>
                  <div className={styles.editFoodTypeLabel}>
                    <Form.Check
                      type="checkbox"
                      // checked={getEditedFoodTypes("cannedFoods")}
                      // onChange={() => changeTypeOfFood("cannedFoods")}
                    />
                    <img src={CanIconSVG} />
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Canned Foods
                    </div>
                  </div>
                </Form.Group>
              </div>

              <div
                style={{ borderLeft: "1px solid #e7404a", display: "flex" }}
              />

              <div>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label>Business Hours</Form.Label>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Monday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Monday[0]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Monday",
                      //     event.target.value,
                      //     getEditedBusinessHours().Monday[1]
                      //   );
                      // }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Monday[1]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Monday",
                      //     getEditedBusinessHours().Monday[0],
                      //     event.target.value
                      //   );
                      // }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Tuesday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Tuesday[0]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Tuesday",
                      //     event.target.value,
                      //     getEditedBusinessHours().Tuesday[1]
                      //   );
                      // }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Tuesday[1]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Tuesday",
                      //     getEditedBusinessHours().Tuesday[0],
                      //     event.target.value
                      //   );
                      // }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Wednesday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Wednesday[0]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Wednesday",
                      //     event.target.value,
                      //     getEditedBusinessHours().Wednesday[1]
                      //   );
                      // }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Wednesday[1]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Wednesday",
                      //     getEditedBusinessHours().Wednesday[0],
                      //     event.target.value
                      //   );
                      // }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Thursday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Thursday[0]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Thursday",
                      //     event.target.value,
                      //     getEditedBusinessHours().Thursday[1]
                      //   );
                      // }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Thursday[1]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Thursday",
                      //     getEditedBusinessHours().Thursday[0],
                      //     event.target.value
                      //   );
                      // }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Friday
                    </div>{" "}
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Friday[0]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Friday",
                      //     event.target.value,
                      //     getEditedBusinessHours().Friday[1]
                      //   );
                      // }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Friday[1]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Friday",
                      //     getEditedBusinessHours().Friday[0],
                      //     event.target.value
                      //   );
                      // }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Saturday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Saturday[0]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Saturday",
                      //     event.target.value,
                      //     getEditedBusinessHours().Saturday[1]
                      //   );
                      // }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Saturday[1]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Saturday",
                      //     getEditedBusinessHours().Saturday[0],
                      //     event.target.value
                      //   );
                      // }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Sunday
                    </div>{" "}
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Sunday[0]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Sunday",
                      //     event.target.value,
                      //     getEditedBusinessHours().Sunday[1]
                      //   );
                      // }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      // value={getEditedBusinessHours().Sunday[1]}
                      // placeholder="HH:MM:SS"
                      // onChange={(event) => {
                      //   changeBusinessHours(
                      //     "Sunday",
                      //     getEditedBusinessHours().Sunday[0],
                      //     event.target.value
                      //   );
                      // }}
                    />
                  </Row>
                </Form.Group>

                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <FacebookIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Facebook URL"
                      // value={state.editedBusinessData.business_facebook_url}
                      style={{ width: "80%" }}
                      // onChange={(event) =>
                      //   editBusiness(
                      //     "business_facebook_url",
                      //     event.target.value
                      //   )
                      // }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <InstagramIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Instagram URL"
                      // value={state.editedBusinessData.business_instagram_url}
                      style={{ width: "80%" }}
                      // onChange={(event) =>
                      //   editBusiness(
                      //     "business_instagram_url",
                      //     event.target.value
                      //   )
                      // }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <TwitterIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Twitter URL"
                      // value={state.editedBusinessData.business_twitter_url}
                      style={{ width: "80%" }}
                      // onChange={(event) =>
                      //   editBusiness("business_twitter_url", event.target.value)
                      // }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <GlobeIcon style={{ color: "#e7404a", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Business Website URL"
                      // value={state.editedBusinessData.business_website_url}
                      style={{ width: "80%" }}
                      // onChange={(event) =>
                      //   editBusiness("business_website_url", event.target.value)
                      // }
                    />
                  </Row>
                </Form.Group>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                paddingBottom: "10px",
                width: "100%",
              }}
            >
              <Button
                variant="primary"
                style={{
                  backgroundColor: "white",
                  color: "#e7404a",
                  borderRadius: "25px",
                  width: "113px",
                  height: "52px",
                  fontSize: "18px",
                  margin: "5px",
                  padding: "0px",
                  border: "1px solid #E7404A",
                }}
                // onClick={() =>
                //   // TODO - Reset edited business data
                //   dispatch({
                //     type: "SET_SHOW_BUSINESS_DETAILS",
                //     payload: {
                //       showEditBusinessDetails: false,
                //       businessEditMode: "",
                //     },
                //   })
                // }
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{
                  backgroundColor: "#E7404A",
                  borderRadius: "25px",
                  width: "198px",
                  height: "50px",
                  fontSize: "18px",
                  margin: "5px",
                  border: "1px solid #E7404A",
                }}
                // onClick={() => saveBusinessData()}
              >
                Save Changes
              </Button>
            </div>
          </Row>
        )}
        {/* PROFILE INFO DISPLAY */}
        {!state.showEditProfile && (
          <Row
            id="main"
            className={styles.section}
            style={{ marginTop: "20px" }}
          >
            <div className={styles.editBusinessFormContainer}>
              <div style={{ width: "20%" }}>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <img
                    height="150px"
                    width="150px"
                    src=""
                    src={getBusinessProfileInfo("business_image")}
                  ></img>
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                    Food Bank Name
                  </Form.Label>
                  <div>{getBusinessProfileInfo("business_name")}</div>
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                    Business Type
                  </Form.Label>
                  <div>{getBusinessProfileInfo("business_type")}</div>
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                    Business Description
                  </Form.Label>
                  <div>{getBusinessProfileInfo("business_desc")}</div>
                </Form.Group>
              </div>

              <div
                style={{ borderLeft: "1px solid #e7404a", display: "flex" }}
              />

              <div style={{ width: "30%" }}>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      First Name
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo("business_contact_first_name")}
                    </div>
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Last Name
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo("business_contact_last_name")}
                    </div>
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Phone Number 1
                    </Form.Label>
                    <div>{getBusinessProfileInfo("business_phone_num")}</div>
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Phone Number 2
                    </Form.Label>
                    <div>{getBusinessProfileInfo("business_phone_num2")}</div>
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "60%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Street
                    </Form.Label>
                    <div>{getBusinessProfileInfo("business_address")}</div>
                  </Form.Group>
                  <Form.Group style={{ width: "30%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Unit
                    </Form.Label>
                    <div>{getBusinessProfileInfo("business_unit")}</div>
                  </Form.Group>
                </Row>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                    City
                  </Form.Label>
                  <div>{getBusinessProfileInfo("business_city")}</div>
                </Form.Group>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      State
                    </Form.Label>
                    <div>{getBusinessProfileInfo("business_state")}</div>
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Zip
                    </Form.Label>
                    <div>{getBusinessProfileInfo("business_unit")}</div>
                  </Form.Group>
                  <Form.Group
                    style={{
                      width: "90%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Storage
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo("reusable")
                        ? "Reusable"
                        : "Disposable"}
                    </div>
                  </Form.Group>
                  <Form.Group
                    style={{
                      width: "90%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Cancellation
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo("can_cancel")
                        ? "Allow cancellation within ordering hours"
                        : "Cancellations not allowed"}
                    </div>
                  </Form.Group>
                  <Form.Group
                    style={{
                      width: "90%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Business Status
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo("business_status") === "ACTIVE"
                        ? "Active"
                        : "Inactive"}
                    </div>
                  </Form.Group>
                </Row>
              </div>

              <div
                style={{ borderLeft: "1px solid #e7404a", display: "flex" }}
              />

              <div style={{ width: "20%" }}>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                    Types of Food
                  </Form.Label>
                  {getFoodType("fruits") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={FruitIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Fruits
                      </div>
                    </div>
                  )}
                  {getFoodType("vegetables") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={VegetableIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Vegetables
                      </div>
                    </div>
                  )}
                  {getFoodType("meals") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={MealIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Meals
                      </div>
                    </div>
                  )}
                  {getFoodType("desserts") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={DessertIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Desserts
                      </div>
                    </div>
                  )}
                  {getFoodType("beverages") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={BeverageIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Beverages
                      </div>
                    </div>
                  )}
                  {getFoodType("dairy") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={DairyIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Dairy
                      </div>
                    </div>
                  )}
                  {getFoodType("snacks") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={SnackIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Snacks
                      </div>
                    </div>
                  )}
                  {getFoodType("cannedFoods") === 1 && (
                    <div className={styles.editFoodTypeLabel}>
                      <img src={CanIconSVG} />
                      <div
                        className={styles.redLabelHeader}
                        style={{ padding: "5px" }}
                      >
                        Canned Foods
                      </div>
                    </div>
                  )}
                </Form.Group>
              </div>

              <div
                style={{ borderLeft: "1px solid #e7404a", display: "flex" }}
              />

              <div style={{ width: "30%" }}>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                    Business Hours
                  </Form.Label>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Monday
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Tuesday
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Wednesday
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Thursday
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Friday
                    </div>{" "}
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Saturday
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Sunday
                    </div>{" "}
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <div
                      style={{
                        width: "30%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      HH:MM:SS
                    </div>
                  </Row>
                </Form.Group>

                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <FacebookIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <div
                      style={{
                        width: "80%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      URL
                    </div>
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <InstagramIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <div
                      style={{
                        width: "80%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      URL
                    </div>
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <TwitterIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <div
                      style={{
                        width: "80%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      URL
                    </div>
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <GlobeIcon style={{ color: "#e7404a", margin: "5px" }} />
                    <div
                      style={{
                        width: "80%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        textAlign: "center",
                      }}
                    >
                      URL
                    </div>
                  </Row>
                </Form.Group>
              </div>
            </div>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default withRouter(BusinessProfile);
