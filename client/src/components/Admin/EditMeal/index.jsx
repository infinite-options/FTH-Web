import { useEffect, useReducer, useState, useRef, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { Breadcrumb, Container, Row, Col, Form, Button } from "react-bootstrap";
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
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import AdminNavBar from "../AdminNavBar";
import styles from "./editMeal.module.css";
import { act } from "react-dom/test-utils";
import testImage from "./static/test.jpeg";
import { ReactComponent as LeftArrow } from "./static/Polygon 1.svg";
import { ReactComponent as RightArrow } from "./static/Polygon 9.svg";
import { ReactComponent as FacebookIcon } from "../../../images/facebookIconNoBorder.svg";
import { ReactComponent as TwitterIcon } from "../../../images/twitterIconNoBorder.svg";
import { ReactComponent as InstagramIcon } from "../../../images/instagramIconNoBorder.svg";
import { ReactComponent as GlobeIcon } from "../../../images/globeIconNoBorder.svg";
import { ReactComponent as DeleteIcon } from "../../../images/delete.svg";
import { ReactComponent as SaveIcon } from "../../../images/save.svg";
import CanIconSVG from "../../../images/canIcon.svg";
import SnackIconSVG from "../../../images/snackIcon.svg";
import DairyIconSVG from "../../../images/dairyIcon.svg";
import BeverageIconSVG from "../../../images/beverageIcon.svg";
import DessertIconSVG from "../../../images/dessertIcon.svg";
import MealIconSVG from "../../../images/mealIcon.svg";
import VegetableIconSVG from "../../../images/vegetableIcon.svg";
import FruitIconSVG from "../../../images/fruitIcon.svg";
import Carousel from "react-multi-carousel";
import { formatTime, sortedArray } from "../../../reducers/helperFuncs";
import { style } from "@material-ui/system";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 12,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 10,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 6,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};

const initialState = {
  mounted: false,
  dropdownAnchorEl: null,
  foodBankItems: [],
  selectedFile: null,
  previewLink: "",
  businessData: [],
  dateIndex: null,
  carouselLoaded: false,
  dateValid: true,
  selectedBusinessID: "",
  selectedBusinessData: null,
  allMenuDates: [],
  menuDate: "",
};

// styles used to customize material table
const useStyles = makeStyles({
  dropdownPopover: {
    borderRadius: "20px",
    background: "#ffe3e5",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#E7404A !important",
    },
  },
});

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "SET_PREVIEW":
      return {
        ...state,
        previewLink: action.payload,
      };
    case "FETCH_DATES":
      return {
        ...state,
        allMenuDates: action.payload.menuDates,
        dateIndex: action.payload.dateIndex,
        menuDate: action.payload.menuDate,
      };
    case "CHANGE_DATE":
      return {
        ...state,
        menuDate: action.payload,
        newMeal: {
          ...state.newMeal,
          menu_date: action.payload,
        },
      };
    case "LOAD_CAROUSEL":
      return {
        ...state,
        carouselLoaded: true,
      };
    case "SET_DROPDOWN_ANCHOR":
      return {
        ...state,
        dropdownAnchorEl: action.payload,
      };
    case "FETCH_ALL_BUSINESS_DATA":
      return {
        ...state,
        businessData: action.payload.businessData,
        selectedBusinessData: action.payload.selectedBusinessData,
        selectedBusinessID: action.payload.selectedBusinessID,
      };
    case "SELECT_BUSINESS":
      return {
        ...state,
        selectedBusinessData: action.payload.selectedBusinessData,
        selectedBusinessID: action.payload.selectedBusinessID,
      };
    case "UPDATE_FOOD_BANK_ITEMS":
      return {
        ...state,
        foodBankItems: action.payload,
      };
    default:
      return state;
  }
}

function EditMeal({ history, ...props }) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const carouselRef = useRef();

  // PAGE INITIALIZATION

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
          if (role === "admin") {
            // console.log("mounting")
            console.log(state.mounted);
            dispatch({ type: "MOUNT" });
            console.log("dispatch MOUNT");
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

  // Get Dates
  useEffect(() => {
    let nextMenuDate = "";
    axios
      .get(`${API_URL}all_menu_dates`)
      .then((response) => {
        const datesApiResult = response.data.result;
        const closestDateIndex = getClosestDateIndex(datesApiResult);
        nextMenuDate = datesApiResult[closestDateIndex].menu_date;
        dispatch({
          type: "FETCH_DATES",
          payload: {
            menuDates: datesApiResult,
            dateIndex: closestDateIndex,
            menuDate: nextMenuDate,
          },
        });
        // return axios.get(
        //   `${API_URL}meals_ordered_by_date/${nextMenuDate.substring(0, 10)}`
        // );
      })
      // .then((response) => {
      //   if (response.status === 200) {
      //     const mealsApi = response.data.result;
      //     if (mealsApi !== undefined) {
      //       dispatch({ type: "FETCH_MENU_BY_DATE", payload: mealsApi });
      //       dispatch({ type: "EDIT_MENU", payload: mealsApi });
      //     }
      //   }
      // })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}businesses`)
      .then((response) => {
        const allBusinessData = response.data.result.result;
        let activeBusinessData = null;
        let activeBusinessID = "";
        if (allBusinessData.length > 0) {
          if (
            document.cookie
              .split(";")
              .some((item) => item.trim().startsWith("last_active_business="))
          ) {
            // Get last used business
            const saved_business_uid = document.cookie
              .split("; ")
              .find((row) => row.startsWith("last_active_business="))
              .split("=")[1];

            const savedBusinessData = allBusinessData.filter(
              (business) => business.business_uid === saved_business_uid
            )[0];
            activeBusinessData = {
              ...savedBusinessData,
              business_accepting_hours: parseBusinessHours(
                savedBusinessData.business_accepting_hours
              ),
            };
          } else {
            // use first business as active business
            activeBusinessData = {
              ...allBusinessData[0],
              business_accepting_hours: parseBusinessHours(
                allBusinessData[0].business_accepting_hours
              ),
            };
          }
          activeBusinessID = activeBusinessData.business_uid;
          dispatch({
            type: "FETCH_ALL_BUSINESS_DATA",
            payload: {
              businessData: allBusinessData,
              selectedBusinessData: activeBusinessData,
              selectedBusinessID: activeBusinessID,
            },
          });
        }
        return axios.get(`${API_URL}admin_food_bank_items/${activeBusinessID}`);
      })
      .then((response) => {
        const foodBankItems = response.data.result.result;
        dispatch({ type: "UPDATE_FOOD_BANK_ITEMS", payload: foodBankItems });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  // DATE RELATED FUNCTIONS

  const menuDates = useMemo(() => {
    const menuDatesFormatted = state.allMenuDates.map((item) => {
      const menuDate = item.menu_date;
      const menuDateTime = new Date(formatTime(menuDate));
      return {
        value: menuDate,
        display: menuDateTime.toDateString(),
      };
    });
    return menuDatesFormatted;
  }, [state.allMenuDates]);

  const getCurrentDate = () => {
    const currentDate = new Date();
    let day = currentDate.getDate();
    if (day < 10) {
      day = ["0", day].join("");
    }
    let month = currentDate.getMonth() + 1;
    if (month < 10) {
      month = ["0", month].join("");
    }
    let year = currentDate.getFullYear();
    return [[year, month, day].join("-"), "00-00-00"].join(" ");
  };

  const getClosestDateIndex = (dates) => {
    if (dates) {
      let curDay = getCurrentDate();

      for (let i = 0; i < dates.length; i++) {
        const day = dates[i].menu_date;
        if (
          day.localeCompare(curDay) === 0 ||
          day.localeCompare(curDay) === 1
        ) {
          return i;
        }
      }
    }
    return 0;
  };

  const changeDate = (newDate) => {
    dispatch({ type: "CHANGE_DATE", payload: newDate });

    // M4ME Code to get meals based on day - pending removal
    // getMenuData(newDate)
    //   .then((curMenu) => {
    //     if (curMenu) {
    //       const sortedMenu = sortedArray(
    //         curMenu,
    //         state.sortEditMenu.field,
    //         state.sortEditMenu.direction
    //       );
    //       dispatch({ type: "EDIT_MENU", payload: sortedMenu });
    //     } else {
    //       dispatch({ type: "EDIT_MENU", payload: [] });
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
  };

  const parseBusinessHours = (hours) => {
    if (hours) {
      return JSON.parse(hours);
    }
    return JSON.parse(
      '{"Friday": ["N/A", "N/A"], "Monday": ["N/A", "N/A"], "Sunday": ["N/A", "N/A"], "Tuesday": ["N/A", "N/A"], "Saturday": ["N/A", "N/A"], "Thursday": ["N/A", "N/A"], "Wednesday": ["N/A", "N/A"]}'
    );
  };

  // FUNCTIONS TO GET STATE DATA

  const getBusinessDataByID = (id) => {
    if (state.businessData) {
      return state.businessData.filter(
        (business) => business.business_uid === id
      )[0];
    }
    return null;
  };

  const getSelectedBusinessData = (field) => {
    if (state.selectedBusinessData) {
      return state.selectedBusinessData[field];
    }
    return "";
  };

  const displayBusinessHours = (day) => {
    if (state.selectedBusinessData) {
      const hours = state.selectedBusinessData.business_accepting_hours[day];
      if (hours[0] !== "" && hours[1] !== "") {
        return hours[0] + " - " + hours[1];
      }
    } else {
      return "Closed";
    }
  };

  const changeActiveBusiness = (id) => {
    const businessData = {
      ...getBusinessDataByID(id),
    };
    const parsedBusinessHours = parseBusinessHours(
      businessData.business_accepting_hours
    );
    businessData.business_accepting_hours = parsedBusinessHours;
    document.cookie = `last_active_business = ${id}`;

    dispatch({
      type: "SELECT_BUSINESS",
      payload: {
        selectedBusinessID: id,
        selectedBusinessData: businessData,
      },
    });

    // call item api
    axios
      .get(`${API_URL}admin_food_bank_items/${id}`)
      .then((response) => {
        const foodBankItems = response.data.result.result;
        dispatch({ type: "UPDATE_FOOD_BANK_ITEMS", payload: foodBankItems });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
    dispatch({ type: "SET_DROPDOWN_ANCHOR", payload: null });
  };

  // TODO - refactor to use new endpoints and state.foodBankItems
  const editMeal = (property, value) => {
    if (property === "") {
      // Initialize edit meal form, value is meal id
      const newMeal = state.foodBankItems.filter(
        (meal) => meal.meal_uid === value
      )[0];
      dispatch({ type: "EDIT_MEAL", payload: newMeal });
      console.log("dispatch EDIT_MEALS");
    } else {
      // Property is property changed, value is new value of that property
      const newMeal = {
        ...state.editedMeal,
        [property]: value,
      };
      dispatch({ type: "EDIT_MEAL", payload: newMeal });
      console.log("dispatch EDIT_MEALS");
    }
  };

  if (!state.mounted) {
    return null;
  }

  const toggleBusinessDropdown = (event) => {
    if (state.dropdownAnchorEl === null) {
      dispatch({ type: "SET_DROPDOWN_ANCHOR", payload: event.currentTarget });
    } else {
      dispatch({ type: "SET_DROPDOWN_ANCHOR", payload: null });
    }
  };

  if (
    carouselRef &&
    carouselRef.current &&
    state.dateIndex &&
    !state.carouselLoaded
  ) {
    carouselRef.current.goToSlide(state.dateIndex);
    // carouselRef.current.state.currentSlide = state.dateIndex;
    dispatch({ type: "LOAD_CAROUSEL" });
  }

  return (
    <div style={{ backgroundColor: "white" }}>
      {console.log(state)}
      {console.log(carouselRef)}
      <AdminNavBar currentPage={"edit-meal"} />
      <Container fluid className={styles.container}>
        <Row id="header" className={styles.section}>
          <Col>
            <Row id="headerInfo">
              <Col id="typesAndDropdown">
                <Row>
                  <Col className={styles.restaurantSelector}>
                    {/* Replace placeholder div with image */}
                    <img
                      src={getSelectedBusinessData("business_image")}
                      className={styles.restaurantImg}
                    />
                    {/* <div className={styles.restaurantImg}></div> */}
                    <div style={{ marginLeft: "10px" }}>
                      <div className={styles.dropdownContainer}>
                        <div>{getSelectedBusinessData("business_name")}</div>
                        <button
                          className={styles.dropdownArrow}
                          onClick={toggleBusinessDropdown}
                        ></button>
                        <Popover
                          open={state.dropdownAnchorEl ? true : false}
                          anchorEl={state.dropdownAnchorEl}
                          onClose={toggleBusinessDropdown}
                          anchorReference="anchorPosition"
                          anchorPosition={{ top: 175, left: 720 }}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          classes={{ paper: classes.dropdownPopover }}
                        >
                          <div>
                            <div className={styles.dropdownSearchContainer}>
                              <div
                                style={{
                                  marginTop: "auto",
                                  marginBottom: "auto",
                                }}
                              >
                                Search By
                              </div>
                              <input
                                type="text"
                                placeholder="Food Bank Name"
                                className={styles.dropdownSearch}
                              />
                              <input
                                tyoe="text"
                                placeholder="Address"
                                className={styles.dropdownSearch}
                              />
                            </div>
                            <TableContainer
                              style={{ height: "50vh", width: "92vw" }}
                            >
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        color: "#E7404A",
                                        border: "none",
                                        textAlign: "center",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <TableSortLabel
                                        style={{
                                          color: "#E7404A",
                                          border: "none",
                                          textAlign: "center",
                                          fontSize: "15px",
                                        }}
                                      >
                                        Food Bank Name
                                      </TableSortLabel>
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        color: "#E7404A",
                                        border: "none",
                                        textAlign: "center",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <TableSortLabel
                                        style={{
                                          color: "#E7404A",
                                          border: "none",
                                          textAlign: "center",
                                          fontSize: "15px",
                                        }}
                                      >
                                        Address
                                      </TableSortLabel>
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        color: "#E7404A",
                                        border: "none",
                                        textAlign: "center",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <TableSortLabel
                                        style={{
                                          color: "#E7404A",
                                          border: "none",
                                          textAlign: "center",
                                          fontSize: "15px",
                                        }}
                                      >
                                        Zip Code
                                      </TableSortLabel>
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        color: "#E7404A",
                                        border: "none",
                                        textAlign: "center",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <TableSortLabel
                                        style={{
                                          color: "#E7404A",
                                          border: "none",
                                          textAlign: "center",
                                          fontSize: "15px",
                                        }}
                                      >
                                        Phone
                                      </TableSortLabel>
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        color: "#E7404A",
                                        border: "none",
                                        textAlign: "center",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <TableSortLabel
                                        style={{
                                          color: "#E7404A",
                                          border: "none",
                                          textAlign: "center",
                                          fontSize: "15px",
                                        }}
                                      >
                                        Email
                                      </TableSortLabel>
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        color: "#E7404A",
                                        border: "none",
                                        textAlign: "center",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <TableSortLabel
                                        style={{
                                          color: "#E7404A",
                                          border: "none",
                                          textAlign: "center",
                                          fontSize: "15px",
                                        }}
                                      >
                                        Item Limit
                                      </TableSortLabel>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {state.businessData &&
                                    state.businessData.map(
                                      (business, index) => {
                                        return (
                                          <TableRow
                                            hover
                                            classes={{ root: classes.tableRow }}
                                            onClick={() => {
                                              changeActiveBusiness(
                                                business.business_uid
                                              );
                                            }}
                                          >
                                            <TableCell
                                              style={{ textAlign: "center" }}
                                            >
                                              {business.business_name}
                                            </TableCell>
                                            <TableCell
                                              style={{ textAlign: "center" }}
                                            >
                                              {business.business_address}
                                            </TableCell>
                                            <TableCell
                                              style={{ textAlign: "center" }}
                                            >
                                              {business.business_zip}
                                            </TableCell>
                                            <TableCell
                                              style={{ textAlign: "center" }}
                                            >
                                              {business.business_phone_num}
                                            </TableCell>
                                            <TableCell
                                              style={{ textAlign: "center" }}
                                            >
                                              {business.business_email}
                                            </TableCell>
                                            <TableCell
                                              style={{ textAlign: "center" }}
                                            >
                                              {business.limit_per_person}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </div>
                        </Popover>
                      </div>

                      <div
                        className={[styles.restaurantLinks, styles.bold].join(
                          " "
                        )}
                      >
                        <a>Edit Details</a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="auto">
                    <div
                      className={styles.redLabelHeader}
                      style={{ padding: "5px" }}
                    >
                      Types of Food
                    </div>
                    <div className={styles.foodTypesContainer}>
                      <div className={styles.foodTypeLabel}>
                        <img
                          src={FruitIconSVG}
                          style={{ padding: "5px 0px" }}
                        />
                        <div className={styles.redLabelSmall}>Fruits</div>
                      </div>
                      <div className={styles.foodTypeLabel}>
                        <img
                          src={VegetableIconSVG}
                          style={{ padding: "5px 0px" }}
                        />
                        <div className={styles.redLabelSmall}>Vegetables</div>
                      </div>
                      <div className={styles.foodTypeLabel}>
                        <img src={MealIconSVG} style={{ padding: "5px 0px" }} />
                        <div className={styles.redLabelSmall}>Meals</div>
                      </div>
                      <div className={styles.foodTypeLabel}>
                        <img
                          src={DessertIconSVG}
                          style={{ padding: "5px 0px" }}
                        />
                        <div className={styles.redLabelSmall}>Desserts</div>
                      </div>
                      <div className={styles.foodTypeLabel}>
                        <img
                          src={BeverageIconSVG}
                          style={{ padding: "5px 0px" }}
                        />
                        <div className={styles.redLabelSmall}>Beverages</div>
                      </div>
                      <div className={styles.foodTypeLabel}>
                        <img
                          src={DairyIconSVG}
                          style={{ padding: "5px 0px" }}
                        />
                        <div className={styles.redLabelSmall}>Dairy</div>
                      </div>
                      <div className={styles.foodTypeLabel}>
                        <img
                          src={SnackIconSVG}
                          style={{ padding: "5px 0px" }}
                        />
                        <div className={styles.redLabelSmall}>Snacks</div>
                      </div>
                      <div className={styles.foodTypeLabel}>
                        <img src={CanIconSVG} style={{ padding: "5px 0px" }} />
                        <div className={styles.redLabelSmall}>Canned Foods</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md="auto" id="hours">
                <div className={styles.redLabelHeader}>Hours of Operation</div>
                <Row>
                  <Col md="auto">
                    <div>Monday</div>
                    <div>Tuesday</div>
                    <div>Wednesday</div>
                    <div>Thursday</div>
                    <div>Friday</div>
                    <div>Saturday</div>
                    <div>Sunday</div>
                  </Col>
                  {console.log(displayBusinessHours("Monday"))}
                  <Col md="auto" style={{ textAlign: "center" }}>
                    <div>{displayBusinessHours("Monday")}</div>
                    <div>{displayBusinessHours("Tuesday")}</div>
                    <div>{displayBusinessHours("Wednesday")}</div>
                    <div>{displayBusinessHours("Thursday")}</div>
                    <div>{displayBusinessHours("Friday")}</div>
                    <div>{displayBusinessHours("Saturday")}</div>
                    <div>{displayBusinessHours("Sunday")}</div>
                  </Col>
                </Row>
              </Col>
              <Col md="auto" id="itemLimit">
                <div className={styles.redLabelHeader}>
                  Item limit per person
                </div>
                <div style={{ textAlign: "center" }}>
                  {getSelectedBusinessData("limit_per_person")}
                </div>
              </Col>
              <Col md="auto " id="contact">
                <div className={styles.redLabelHeader}>Contact Info</div>
                <div>{getSelectedBusinessData("business_email")}</div>
                <div>{getSelectedBusinessData("business_phone_num")}</div>
                <div className={styles.socialLinkContainer}>
                  <FacebookIcon style={{ fill: "#E7404A" }} />
                  <InstagramIcon style={{ fill: "#E7404A" }} />
                  <TwitterIcon style={{ fill: "#E7404A" }} />
                  <GlobeIcon style={{ color: "#E7404A" }} />
                </div>
              </Col>
            </Row>
            <Row
              sm="8"
              style={{ width: "70%", marginLeft: "15%", marginTop: "45px" }}
            >
              <button
                className={styles.dateCarouselArrowBtn}
                onClick={() => {
                  carouselRef.current.previous();
                  dispatch({ type: "DECREMENT_DATE_INDEX" });
                }}
              >
                <LeftArrow />
              </button>
              <Col md="auto" style={{ width: "80%", padding: "0px" }}>
                {state.dateIndex != null && (
                  <Carousel
                    responsive={responsive}
                    ref={carouselRef}
                    arrows={false}
                    sliderClass={styles.carouselSlider}
                    keyBoardControl
                  >
                    {menuDates.map((date) => {
                      const dateButtonStatus =
                        date.value === state.menuDate
                          ? styles.datebuttonSelected
                          : styles.datebuttonNotSelected;
                      return (
                        <button
                          className={[
                            styles.datebutton,
                            dateButtonStatus,
                            styles.bold,
                          ].join(" ")}
                          key={date.value}
                          value={date.value}
                          onClick={(e) => changeDate(e.target.value)}
                        >
                          {date.display.substring(0, 1).toUpperCase()} <br />{" "}
                          {date.display.substring(4, 10)}
                        </button>
                      );
                    })}
                  </Carousel>
                )}
              </Col>
              <button
                className={styles.dateCarouselArrowBtn}
                onClick={() => {
                  carouselRef.current.next();
                  dispatch({ type: "INCREMENT_DATE_INDEX" });
                }}
              >
                <RightArrow />
              </button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textDecoration: "underline",
                }}
                className={styles.redLabelHeader}
              >
                Clear Days
              </div>
            </Row>
          </Col>
        </Row>
        <Row id="main" className={styles.section} style={{ marginTop: "20px" }}>
          <Col>
            <Row id="mainHeader">
              <Col id="inventoryDate">
                <div className={styles.blackLabelBold}>
                  {menuDates.length > 0 &&
                    `Inventory For ${menuDates[
                      state.dateIndex
                    ].display.substring(4)}`}
                </div>
              </Col>
              <Col id="addItem">
                <div
                  style={{ textAlign: "right" }}
                  className={styles.redLabelBold}
                >
                  Add Item +
                </div>
              </Col>
            </Row>
            <Row>
              <Col id="table">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{
                            color: "#E7404A",
                            border: "none",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          <TableSortLabel
                            style={{
                              color: "#E7404A",
                              border: "none",
                              textAlign: "center",
                              fontSize: "15px",
                            }}
                          >
                            Item Name
                          </TableSortLabel>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#E7404A",
                            border: "none",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          <TableSortLabel
                            style={{
                              color: "#E7404A",
                              border: "none",
                              textAlign: "center",
                              fontSize: "15px",
                            }}
                          >
                            Item Picture
                          </TableSortLabel>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#E7404A",
                            border: "none",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          <TableSortLabel
                            style={{
                              color: "#E7404A",
                              border: "none",
                              textAlign: "center",
                              fontSize: "15px",
                            }}
                          >
                            Type of Food
                          </TableSortLabel>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#E7404A",
                            border: "none",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          <TableSortLabel
                            style={{
                              color: "#E7404A",
                              border: "none",
                              textAlign: "center",
                              fontSize: "15px",
                            }}
                          >
                            Status
                          </TableSortLabel>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#E7404A",
                            border: "none",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          <TableSortLabel
                            style={{
                              color: "#E7404A",
                              border: "none",
                              textAlign: "center",
                              fontSize: "15px",
                            }}
                          >
                            Current Inventory
                          </TableSortLabel>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#E7404A",
                            border: "none",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* TODO - ADD FILTERING WHEN DATES ARE READY */}
                      {state.foodBankItems &&
                        state.foodBankItems.map((item) => {
                          return (
                            <TableRow hover>
                              <TableCell style={{ textAlign: "center" }}>
                                {item.item_name}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <img
                                  src={item.item_photo}
                                  style={{ width: "50px", height: "50px" }}
                                ></img>
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                {item.item_type}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                {item.item_status}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                {item.current_inventory}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <SaveIcon style={{ fill: "#E7404A" }} />
                                <DeleteIcon style={{ fill: "#E7404A" }} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(EditMeal);
