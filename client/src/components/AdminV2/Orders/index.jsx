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
import styles from "./orders.module.css";
import Carousel from "react-multi-carousel";
import { ReactComponent as LeftArrow } from "../../../images/LeftArrowRed.svg";
import { ReactComponent as RightArrow } from "../../../images/RightArrowRed.svg";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";

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
  dateIndex: null,
  carouselLoaded: false,
  allDates: [],
  selectedDate: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "FETCH_DATES":
      return {
        ...state,
        allDates: action.payload.allDates,
        dateIndex: action.payload.dateIndex,
        selectedDate: action.payload.selectedDate,
      };
    case "CHANGE_DATE":
      return {
        ...state,
        selectedDate: action.payload,
      };
    case "LOAD_CAROUSEL":
      return {
        ...state,
        carouselLoaded: true,
      };
    default:
      return state;
  }
}

function Orders({ history, ...props }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [orders, setOrders] = useState(null);
  const [orderItems, setOrderItems] = useState(null);
  const carouselRef = useRef();

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
    let nextDate = "";
    axios
      .get(`${API_URL}all_menu_dates`)
      .then((response) => {
        const datesApiResult = response.data.result;
        const closestDateIndex = getClosestDateIndex(datesApiResult);
        nextDate = datesApiResult[closestDateIndex].menu_date;
        dispatch({
          type: "FETCH_DATES",
          payload: {
            allDates: datesApiResult,
            dateIndex: closestDateIndex,
            selectedDate: nextDate,
          },
        });
      })

      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
    axios
      .get(`${API_URL}get_orders`)
      .then((response) => {
        console.log("get_orders response: ", response.data.result);
        setOrders(response.data.result);
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

  const allDates = useMemo(() => {
    const allDatesFormatted = state.allDates.map((item) => {
      const menuDate = item.menu_date;
      const menuDateTime = new Date(formatTime(menuDate));
      return {
        value: menuDate,
        display: menuDateTime.toDateString(),
      };
    });
    return allDatesFormatted;
  }, [state.allDates]);

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
  };

  if (!state.mounted) {
    return null;
  }

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
    <div style={{position: 'relative', zIndex: '0'}}>
      <AdminNavBar currentPage={"orders"} />
      
      {orderItems !== null && (
        <div className={styles.itemsContainer}>
          <div className={styles.itemsModal}>
            <ModalCloseBtn 
              className={styles.closeBtn}
              onClick={() => { setOrderItems(null) }}
            />
            <div className={styles.itemsList}>
              <TableContainer className={styles.tableContainer}>
                <Table className={styles.table}>
                  <TableHead className={styles.tableHead}>
                    <TableRow className={styles.tableRow}>
                      <TableCell className={styles.tableHeadCell}>
                        <TableSortLabel className={styles.tableSortLabel}>
                          Item UID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={styles.tableHeadCell}>
                        <TableSortLabel className={styles.tableSortLabel}>
                          Item Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={styles.tableHeadCell}>
                        <TableSortLabel className={styles.tableSortLabel}>
                          Item Photo
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={styles.tableHeadCell}>
                        <TableSortLabel className={styles.tableSortLabel}>
                          Description
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={styles.tableHeadCell}>
                        <TableSortLabel className={styles.tableSortLabel}>
                          Quantity
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={styles.tableHeadCell}>
                        <TableSortLabel className={styles.tableSortLabel}>
                          Unit
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log("orderItems: ", orderItems)}
                    {orderItems.items && JSON.parse(orderItems.items).map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{item.item_uid}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            {item.img && (
                              <img
                                src={item.img}
                                style={{ 
                                  width: "50px", 
                                  height: "50px", 
                                  borderRadius: '5px',
                                  border: '1px solid #e7404a'
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      )}

      <Container fluid className={styles.container}>
        <Row
          id="header"
          className={styles.section}
          style={{ height: "209px", padding: "26px 19px" }}
        >
          <Col>
            <Row>
              <Col md="auto">
                <div className={styles.headerText}>Orders</div>
              </Col>
              <Col></Col>
            </Row>
            <Row
              sm="8"
              style={{ width: "70%", marginLeft: "15%", marginTop: "45px" }}
            >
              <button
                className={styles.dateCarouselArrowBtn}
                onClick={() => {
                  carouselRef.current.previous();
                  // dispatch({ type: "DECREMENT_DATE_INDEX" });
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
                    {allDates.map((date) => {
                      const dateButtonStatus =
                        date.value === state.selectedDate
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
                  // dispatch({ type: "INCREMENT_DATE_INDEX" });
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
              <Col md="auto">
                <div className={styles.headerText}>Upcoming Orders:</div>
              </Col>
            </Row>
            <Row id="mainBody">
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
                            Purchase UID
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
                            Business UID
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
                            Customer UID
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
                            Purchase Date
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
                            Customer Name
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
                            Delivery Address
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
                            Items
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders && orders.map((order, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{order.purchase_uid}</TableCell>
                            <TableCell>{order.pur_business_uid}</TableCell>
                            <TableCell>{order.pur_customer_uid}</TableCell>
                            <TableCell>{order.purchase_date}</TableCell>
                            <TableCell>{order.delivery_first_name + " " + order.delivery_last_name}</TableCell>
                            <TableCell>{order.delivery_address + ", " + order.delivery_city + ", " + order.delivery_state}</TableCell>
                            <TableCell>
                              <button
                                class={styles.itemsLink}
                                onClick={() => {
                                  setOrderItems(order);
                                }}
                              >
                                See Items
                              </button>
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

export default withRouter(Orders);
