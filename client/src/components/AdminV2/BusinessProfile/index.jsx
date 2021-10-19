import { useEffect, useReducer } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { withRouter } from "react-router";
import AdminNavBar from "../AdminNavBar";
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
  selectedFile: null,
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
        editedBusinessProfileInfo: action.payload,
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
      const role = localStorage.getItem('role');
      if (role !== "admin" && role !== "customer") {
        dispatch({ type: "MOUNT" });
      } else {
        history.push("/meal-plan");
      }
      // axios
      //   .get(`${API_URL}Profile/${customer_uid}`)
      //   .then((response) => {
      //     const role = response.data.result[0].role.toLowerCase();
      //     if (role !== "admin" && role !== "customer") {
      //       // console.log("mounting")
      //       // console.log(state.mounted);
      //       dispatch({ type: "MOUNT" });
      //       // console.log("dispatch MOUNT");
      //     } else {
      //       history.push("/meal-plan");
      //     }
      //   })
      //   .catch((err) => {
      //     if (err.response) {
      //       // eslint-disable-next-line no-console
      //       console.log(err.response);
      //     }
      //     // eslint-disable-next-line no-console
      //     console.log(err);
      //   });
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
        console.log("(bdu) res: ", response);
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

  const getBusinessProfileInfo = (data, field) => {
    if (data && data.hasOwnProperty(field)) {
      return data[field];
    } else {
      return "";
    }
  };

  const getFoodType = (data, type) => {
    if (data && data.hasOwnProperty("item_types")) {
      return data.item_types[type];
    } else {
      return 0;
    }
  };

  const getBusinessHours = (data, day, type) => {
    if (data && data.business_accepting_hours) {
      if (type === "start") {
        return data.business_accepting_hours[day][0];
      } else {
        return data.business_accepting_hours[day][1];
      }
    } else {
      return "";
    }
  };

  const editBusiness = (property, value) => {
    const newBusiness = {
      ...state.editedBusinessProfileInfo,
      [property]: value,
    };
    dispatch({
      type: "SET_EDITED_BUSINESS_PROFILE_INFO",
      payload: newBusiness,
    });
  };

  const changeTypeOfFood = (type) => {
    let updatedItemTypes = null;
    if (
      state.editedBusinessProfileInfo.item_types === null ||
      state.editedBusinessProfileInfo.item_types === ""
    ) {
      updatedItemTypes = {
        fruits: 0,
        vegetables: 0,
        meals: 0,
        desserts: 0,
        beverages: 0,
        dairy: 0,
        snacks: 0,
        cannedFoods: 0,
      };
      updatedItemTypes[type] = updatedItemTypes[type] === 0 ? 1 : 0;
    } else {
      updatedItemTypes = {
        ...state.editedBusinessProfileInfo.item_types,
        [type]: state.editedBusinessProfileInfo.item_types[type] === 0 ? 1 : 0,
      };
    }
    const newBusiness = {
      ...state.editedBusinessProfileInfo,
      item_types: updatedItemTypes,
    };
    dispatch({
      type: "SET_EDITED_BUSINESS_PROFILE_INFO",
      payload: newBusiness,
    });
  };

  const changeBusinessHours = (day, startTime, endTime) => {
    const newHours = {
      ...state.editedBusinessProfileInfo.business_accepting_hours,
      [day]: [startTime, endTime],
    };

    editBusiness("business_accepting_hours", newHours);
  };

  const toggleEditProfile = () => {
    dispatch({ type: "TOGGLE_SHOW_EDIT_PROFILE" });
  };

  const saveBusinessData = () => {
    const businessData = {
      ...state.editedBusinessProfileInfo,
      business_hours: {
        Friday: ["00:00:00", "23:59:00"],
        Monday: ["00:00:00", "23:59:00"],
      },
      business_delivery_hours: {
        Friday: ["09:00:00", "23:59:59"],
      },
      can_cancel: String(state.editedBusinessProfileInfo.can_cancel),
      delivery: "0",
      business_image: "",
      reusable: String(state.editedBusinessProfileInfo.reusable),
      limit_per_person: String(
        state.editedBusinessProfileInfo.limit_per_person
      ),
    };

    let businessDataStatus = null;
    let imageUploadStatus = null;
    axios
      .post(`${API_URL}business_details_update/Post`, businessData)
      .then((res) => {
        businessDataStatus = res.status;
        if (state.selectedFile) {
          const imageFormData = new FormData();
          imageFormData.append("bus_photo", state.selectedFile);
          imageFormData.append("uid", state.businessProfileInfo.business_uid);

          return axios.post(`${API_URL}business_image_upload`, imageFormData);
        }
      })
      .then((res) => {
        if (res) {
          imageUploadStatus = res.status;
        }
      })
      .catch((err) => {
        alert(
          "There was an issue while saving the business details, please try again"
        );
      })
      .finally(() => {
        if (
          (businessDataStatus === 200 && imageUploadStatus === 200) ||
          imageUploadStatus === null
        ) {
          toggleEditProfile();
          getBusinessData();
        }
      });
  };

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
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
                    src={getBusinessProfileInfo(
                      state.editedBusinessProfileInfo,
                      "business_image"
                    )}
                  ></img>
                  <input
                    type="file"
                    name="upload_file"
                    onChange={(e) => {
                      state.selectedFile = e.target.files[0];
                      editBusiness(
                        "business_image",
                        URL.createObjectURL(e.target.files[0])
                      );
                    }}
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
                    value={getBusinessProfileInfo(
                      state.editedBusinessProfileInfo,
                      "business_name"
                    )}
                    onChange={(event) =>
                      editBusiness("business_name", event.target.value)
                    }
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
                    value={getBusinessProfileInfo(
                      state.editedBusinessProfileInfo,
                      "business_type"
                    )}
                    onChange={(event) =>
                      editBusiness("business_type", event.target.value)
                    }
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
                    value={getBusinessProfileInfo(
                      state.editedBusinessProfileInfo,
                      "business_desc"
                    )}
                    onChange={(event) =>
                      editBusiness("business_desc", event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label>Item Limit</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Item Limit"
                    value={getBusinessProfileInfo(
                      state.editedBusinessProfileInfo,
                      "limit_per_person"
                    )}
                    onChange={(event) =>
                      editBusiness("limit_per_person", event.target.value)
                    }
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
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_contact_first_name"
                      )}
                      onChange={(event) =>
                        editBusiness(
                          "business_contact_first_name",
                          event.target.value
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Last Name"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_contact_last_name"
                      )}
                      onChange={(event) =>
                        editBusiness(
                          "business_contact_last_name",
                          event.target.value
                        )
                      }
                    />
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Phone Number 1</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Phone Number"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_phone_num"
                      )}
                      onChange={(event) =>
                        editBusiness("business_phone_num", event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Phone Number 2</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Phone Number"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_phone_num2"
                      )}
                      onChange={(event) =>
                        editBusiness("business_phone_num2", event.target.value)
                      }
                    />
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "60%" }}>
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Street Address"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_address"
                      )}
                      onChange={(event) =>
                        editBusiness("business_address", event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "30%" }}>
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Unit No."
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_unit"
                      )}
                      onChange={(event) =>
                        editBusiness("business_unit", event.target.value)
                      }
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
                    value={getBusinessProfileInfo(
                      state.editedBusinessProfileInfo,
                      "business_city"
                    )}
                    onChange={(event) =>
                      editBusiness("business_city", event.target.value)
                    }
                  />
                </Form.Group>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter State"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_state"
                      )}
                      onChange={(event) =>
                        editBusiness("business_state", event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Zip"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_zip"
                      )}
                      onChange={(event) =>
                        editBusiness("business_zip", event.target.value)
                      }
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
                      value={1}
                      checked={
                        getBusinessProfileInfo(
                          state.editedBusinessProfileInfo,
                          "reusable"
                        ) === 1
                      }
                      onChange={(event) =>
                        editBusiness("reusable", Number(event.target.value))
                      }
                    />{" "}
                    Reusable
                    <br />
                    <input
                      type="radio"
                      id="disposable"
                      name="storage"
                      value={0}
                      checked={
                        getBusinessProfileInfo(
                          state.editedBusinessProfileInfo,
                          "reusable"
                        ) === 0
                      }
                      onChange={(event) =>
                        editBusiness("reusable", Number(event.target.value))
                      }
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
                      value={1}
                      checked={
                        getBusinessProfileInfo(
                          state.editedBusinessProfileInfo,
                          "can_cancel"
                        ) === 1
                      }
                      onChange={(event) =>
                        editBusiness("can_cancel", Number(event.target.value))
                      }
                    />{" "}
                    Allow cancellation within ordering hours
                    <br />
                    <input
                      type="radio"
                      id="no_cancel"
                      name="cancellation"
                      value={0}
                      checked={
                        getBusinessProfileInfo(
                          state.editedBusinessProfileInfo,
                          "can_cancel"
                        ) === 0
                      }
                      onChange={(event) =>
                        editBusiness("can_cancel", Number(event.target.value))
                      }
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
                      value={"ACTIVE"}
                      checked={
                        getBusinessProfileInfo(
                          state.editedBusinessProfileInfo,
                          "business_status"
                        ) === "ACTIVE"
                      }
                      onChange={(event) =>
                        editBusiness("business_status", event.target.value)
                      }
                    />{" "}
                    Active
                    <br />
                    <input
                      type="radio"
                      id="Inactive"
                      name="businessStatus"
                      value={"INACTIVE"}
                      checked={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_status"
                      )}
                      onChange={(event) =>
                        editBusiness("business_status", event.target.value)
                      }
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "fruits"
                      )}
                      onChange={() => changeTypeOfFood("fruits")}
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "vegetables"
                      )}
                      onChange={() => changeTypeOfFood("vegetables")}
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "meals"
                      )}
                      onChange={() => changeTypeOfFood("meals")}
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "desserts"
                      )}
                      onChange={() => changeTypeOfFood("desserts")}
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "beverages"
                      )}
                      onChange={() => changeTypeOfFood("beverages")}
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "dairy"
                      )}
                      onChange={() => changeTypeOfFood("dairy")}
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "snacks"
                      )}
                      onChange={() => changeTypeOfFood("snacks")}
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
                      checked={getFoodType(
                        state.editedBusinessProfileInfo,
                        "cannedFoods"
                      )}
                      onChange={() => changeTypeOfFood("cannedFoods")}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Monday",
                        "start"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Monday",
                          event.target.value,
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Monday",
                            "end"
                          )
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Monday",
                        "end"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Monday",
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Monday",
                            "start"
                          ),
                          event.target.value
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Tuesday",
                        "start"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Tuesday",
                          event.target.value,
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Tuesday",
                            "end"
                          )
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Tuesday",
                        "end"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Tuesday",
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Tuesday",
                            "start"
                          ),
                          event.target.value
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Wednesday",
                        "start"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Wednesday",
                          event.target.value,
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Wednesday",
                            "end"
                          )
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Wednesday",
                        "end"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Wednesday",
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Wednesday",
                            "start"
                          ),
                          event.target.value
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Thursday",
                        "start"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Thursday",
                          event.target.value,
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Thursday",
                            "end"
                          )
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Thursday",
                        "end"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Thursday",
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Thursday",
                            "start"
                          ),
                          event.target.value
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Friday",
                        "start"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Friday",
                          event.target.value,
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Friday",
                            "end"
                          )
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Friday",
                        "end"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Friday",
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Friday",
                            "start"
                          ),
                          event.target.value
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Saturday",
                        "start"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Saturday",
                          event.target.value,
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Saturday",
                            "end"
                          )
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Saturday",
                        "end"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Saturday",
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Saturday",
                            "start"
                          ),
                          event.target.value
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Sunday",
                        "start"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Sunday",
                          event.target.value,
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Sunday",
                            "end"
                          )
                        );
                      }}
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
                      value={getBusinessHours(
                        state.editedBusinessProfileInfo,
                        "Sunday",
                        "end"
                      )}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Sunday",
                          getBusinessHours(
                            state.editedBusinessProfileInfo,
                            "Sunday",
                            "start"
                          ),
                          event.target.value
                        );
                      }}
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
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_facebook_url"
                      )}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness(
                          "business_facebook_url",
                          event.target.value
                        )
                      }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <InstagramIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Instagram URL"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_instagram_url"
                      )}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness(
                          "business_instagram_url",
                          event.target.value
                        )
                      }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <TwitterIcon style={{ fill: "#e7404a", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Twitter URL"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_twitter_url"
                      )}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness("business_twitter_url", event.target.value)
                      }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <GlobeIcon style={{ color: "#e7404a", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Business Website URL"
                      value={getBusinessProfileInfo(
                        state.editedBusinessProfileInfo,
                        "business_website_url"
                      )}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness("business_website_url", event.target.value)
                      }
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
                onClick={() => {
                  toggleEditProfile();
                  dispatch({
                    type: "SET_EDITED_BUSINESS_PROFILE_INFO",
                    payload: state.businessProfileInfo,
                  });
                }}
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
                onClick={() => saveBusinessData()}
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
                    src={getBusinessProfileInfo(
                      state.businessProfileInfo,
                      "business_image"
                    )}
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
                  <div>
                    {getBusinessProfileInfo(
                      state.businessProfileInfo,
                      "business_name"
                    )}
                  </div>
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
                  <div>
                    {getBusinessProfileInfo(
                      state.businessProfileInfo,
                      "business_type"
                    )}
                  </div>
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
                  <div>
                    {getBusinessProfileInfo(
                      state.businessProfileInfo,
                      "business_desc"
                    )}
                  </div>
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                    Item Limit
                  </Form.Label>
                  <div>
                    {getBusinessProfileInfo(
                      state.businessProfileInfo,
                      "limit_per_person"
                    )}
                  </div>
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
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_contact_first_name"
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Last Name
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_contact_last_name"
                      )}
                    </div>
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Phone Number 1
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_phone_num"
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Phone Number 2
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_phone_num2"
                      )}
                    </div>
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "60%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Street
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_address"
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group style={{ width: "30%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Unit
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_unit"
                      )}
                    </div>
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
                  <div>
                    {getBusinessProfileInfo(
                      state.businessProfileInfo,
                      "business_city"
                    )}
                  </div>
                </Form.Group>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      State
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_state"
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#E7404A", fontWeight: "600" }}>
                      Zip
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_unit"
                      )}
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
                      Storage
                    </Form.Label>
                    <div>
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "reusable"
                      )
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
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "can_cancel"
                      )
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
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_status"
                      ) === "ACTIVE"
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
                  {getFoodType(state.businessProfileInfo, "fruits") === 1 && (
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
                  {getFoodType(state.businessProfileInfo, "vegetables") ===
                    1 && (
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
                  {getFoodType(state.businessProfileInfo, "meals") === 1 && (
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
                  {getFoodType(state.businessProfileInfo, "desserts") === 1 && (
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
                  {getFoodType(state.businessProfileInfo, "beverages") ===
                    1 && (
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
                  {getFoodType(state.businessProfileInfo, "dairy") === 1 && (
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
                  {getFoodType(state.businessProfileInfo, "snacks") === 1 && (
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
                  {getFoodType(state.businessProfileInfo, "cannedFoods") ===
                    1 && (
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Monday",
                        "start"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Monday",
                        "end"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Tuesday",
                        "start"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Tuesday",
                        "end"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Wednesday",
                        "start"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Wednesday",
                        "end"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Thursday",
                        "start"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Thursday",
                        "end"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Friday",
                        "start"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Friday",
                        "end"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Saturday",
                        "start"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Saturday",
                        "end"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Sunday",
                        "start"
                      )}
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
                      {getBusinessHours(
                        state.businessProfileInfo,
                        "Sunday",
                        "end"
                      )}
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
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_facebook_url"
                      )}
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
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_instagram_url"
                      )}
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
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_twitter_url"
                      )}
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
                      {getBusinessProfileInfo(
                        state.businessProfileInfo,
                        "business_website_url"
                      )}
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
