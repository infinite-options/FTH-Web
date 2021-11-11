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
import styles from "./inventory.module.css";
import Carousel from "react-multi-carousel";
import { ReactComponent as LeftArrow } from "../../../images/LeftArrowRed.svg";
import { ReactComponent as RightArrow } from "../../../images/RightArrowRed.svg";
import ToggleSwitch from "./toggleSwitch.jsx";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import AddDonation from '../Modals/AddDonation';

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
  showAddDonation: false,
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
    case "TOGGLE_ADD_DONATION": {
      return {
        ...state,
        showAddDonation: !state.showAddDonation,
      };
    }
    default:
      return state;
  }
}

function Inventory({ history, ...props }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const carouselRef = useRef();

  const [massUnits, setMassUnits] = useState(null);
  const [volumeUnits, setVolumeUnits] = useState(null);
  const [lengthUnits, setLengthUnits] = useState(null);
  const [eachUnits, setEachUnits] = useState(null);
  const [conversionUnits, setConversionUnits] = useState([]);

  const [items, setItems] = useState(null);
  const [units, setUnits] = useState(null);
  const [inventory, setInventory] = useState(null);

  const getItems = (business_uid) => {
    axios
      .get(`${API_URL}getItems?receive_business_uid=${business_uid}`)
      .then((res) => {
        console.log("getItems res: ", res);
        // setInventory(res.data.result);
        setItems(res.data.result);
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  const getSupplyUnits = () => {
    axios
      .get(`${API_URL}get_units_list`)
      .then((response) => {
        console.log("gul res: ", response);
        const units = response.data.result;
        setConversionUnits(units);
        let tempMassUnits = [];
        let tempVolumeUnits = [];
        let tempLengthUnits = [];
        let tempEachUnits = [];
        units.forEach((unit) => {
          if(unit.type === "mass") {
            tempMassUnits.push(unit);
          } else if (unit.type === "volume") {
            tempVolumeUnits.push(unit);
          } else if (unit.type === "length") {
            tempLengthUnits.push(unit);
          } else if (unit.type === "each") {
            tempEachUnits.push(unit);
          }
        });
        setMassUnits(tempMassUnits);
        setVolumeUnits(tempVolumeUnits);
        setLengthUnits(tempLengthUnits);
        setEachUnits(tempEachUnits);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  useEffect(() => {
    if(
      items !== null &&
      massUnits !== null &&
      volumeUnits !== null &&
      lengthUnits !== null &&
      eachUnits !== null
    ) {
      // console.log("setting inventory...");
      // console.log("items: ", items);
      let tempInventory = [];
      items.forEach((item) => {
        // console.log("\nitem: ", item);
        let itemCopy = {...item};
        let distribution_units = [];
        // console.log("itemCopy: ", itemCopy);
        // console.log("item final: ", itemCopy);

        if(itemCopy.volume_measure !== null && itemCopy.volume_num !== null) {
          distribution_units.push({
            type: "Volume", 
            measure: itemCopy.volume_measure,
            qty: itemCopy.volume_num
          });
          if(distribution_units.length === 1) {
            itemCopy.distribution_unit = "Volume";
          }
        }

        if(itemCopy.mass_measure !== null && itemCopy.mass_num !== null) {
          distribution_units.push({
            type: "Mass", 
            measure: itemCopy.mass_measure,
            qty: itemCopy.mass_num
          });
          if(distribution_units.length === 1) {
            itemCopy.distribution_unit = "Mass";
          }
        }

        if(itemCopy.each_measure !== null && itemCopy.each_num !== null) {
          distribution_units.push({
            type: "Each", 
            measure: itemCopy.each_measure,
            qty: itemCopy.each_num
          });
          if(distribution_units.length === 1) {
            itemCopy.distribution_unit = "Each";
          }
        }

        if(itemCopy.length_measure !== null && itemCopy.length_num !== null) {
          distribution_units.push({
            type: "Length", 
            measure: itemCopy.length_measure,
            qty: itemCopy.length_num
          });
          if(distribution_units.length === 1) {
            itemCopy.distribution_unit = "Length";
          }
        }

        itemCopy.distribution_units = distribution_units;

        // only push to inventory if package has valid data in measures column
        if(distribution_units.length > 0) {
          tempInventory.push(itemCopy)
        }

      });
      // console.log("\nfinal inventory: ", tempInventory);

      setInventory(tempInventory);
    }
  }, [items, massUnits, volumeUnits, lengthUnits, eachUnits]);

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

      getItems(role);
      getSupplyUnits();

      // axios
      //   .get(`${API_URL}getItems?receive_business_uid=${role}`)
      //   .then((res) => {
      //     console.log("getItems res: ", res);
      //     setInventory(res.data.result);
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

  const toggleShowAddDonation = () => {
    dispatch({ type: "TOGGLE_ADD_DONATION" });
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

  const unitOptions = (item) => {
    // console.log("(unitOptions) uid: ", uid);
    // console.log("(unitOptions) inventory: ", inventory);
    // var unitOptions = [<option disabled selected value> -- select an option -- </option>];
    let unitDropdown = [];
    item.distribution_units.forEach((dist, index) => {
      unitDropdown.push(
        <option key={index} value={dist.type}>
          {dist.type}
        </option>
      );
    });
    // return brandOptions;
    return unitDropdown;
  }

  const setDistributionUnit = (unit, uid) => {
    let newInventory = [...inventory];
    // console.log("(sdu) uid: ", uid);
    // console.log("(sdu) unit: ", unit);
    let itemIndex = inventory.findIndex((inv) => {
      // console.log("dist: ", dist);
      return inv.supply_uid === uid;
    });
    // console.log("item index: ", itemIndex);
    let itemCopy = {...inventory[itemIndex]};
    // console.log("item copy: ", itemCopy);
    itemCopy.distribution_unit = unit;
    newInventory[itemIndex] = itemCopy;
    setInventory(newInventory);
  }

  const displayUnitNum = (item) => {
    // console.log("(dun) item: ", item);
    let unit = item.distribution_units.find((dist) => {
      // console.log("dist: ", dist);
      return dist.type === item.distribution_unit;
    })
    // console.log("unit: ", unit);
    return unit.qty;
  }

  const displayUnitMeasure = (item) => {
    // console.log("(dum) item: ", item);
    let unit = item.distribution_units.find((dist) => {
      // console.log("dist: ", dist);
      return dist.type === item.distribution_unit;
    })
    // console.log("unit: ", unit);
    return unit.measure;
  }

  const calculateDistInv = (item) => {
    // {displayUnitNum(item)}
    //                           </TableCell>
    //                           <TableCell>
    //                             {displayUnitMeasure(item)}
    console.log("\n(cdi) package qty: ", item.qty_received);
    console.log("(cdi) conversion units: ", conversionUnits);
    console.log("(cdi) unit num: ", displayUnitNum(item));
    console.log("(cdi) unit measure: ", displayUnitMeasure(item));

    return 1;
  }

  const massOptions = () => {
    let opts = [<option disabled selected value> -- </option>];
    massUnits.forEach((unit, index) => {
      opts.push(
        <option key={index} value={unit.recipe_unit}>
          {unit.recipe_unit}
        </option>
      );
    });
    return opts;
  }

  const volumeOptions = () => {
    let opts = [<option disabled selected value> -- </option>];
    volumeUnits.forEach((unit, index) => {
      opts.push(
        <option key={index} value={unit.recipe_unit}>
          {unit.recipe_unit}
        </option>
      );
    });
    return opts;
  }

  const lengthOptions = () => {
    let opts = [<option disabled selected value> -- </option>];
    lengthUnits.forEach((unit, index) => {
      opts.push(
        <option key={index} value={unit.recipe_unit}>
          {unit.recipe_unit}
        </option>
      );
    });
    return opts;
  }

  const eachOptions = () => {
    let opts = [<option disabled selected value> -- </option>];
    eachUnits.forEach((unit, index) => {
      opts.push(
        <option key={index} value={unit.recipe_unit}>
          {unit.recipe_unit}
        </option>
      );
    });
    return opts;
  }

  return (
    <div>
      {console.log("(render) inventory: ", inventory)}
      <AdminNavBar currentPage={"inventory"} />
      <Container fluid className={styles.container}>
        <Row
          id="header"
          className={styles.section}
          style={{ height: "246px", padding: "26px 19px" }}
        >
          <Col>
            <Row>
              <Col md="auto">
                <div className={styles.headerText}>Inventory</div>
              </Col>
              <Col></Col>
              <Col md="auto">
                <button 
                  className={styles.headerButtonWhite}
                  onClick={() => toggleShowAddDonation()}
                >
                  Add Donation +
                </button>
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
                <div
                  className={styles.headerText}
                  style={{ lineHeight: "50px" }}
                >
                  Inventory
                </div>
              </Col>
              <Col></Col>
              <Col md="auto">
                <input
                  type="text"
                  placeholder="Search"
                  className={styles.tableSearch}
                />
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
                            Supply UID
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
                            Package
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
                            Package Picture
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
                            Package Inventory
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
                            Distribution Unit
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
                            Item Qty.
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
                            Item Measure
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
                            Name
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
                            Distribution Inventory
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventory &&
                        inventory.map((item, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{item.supply_uid}</TableCell>
                              <TableCell>{item.sup_desc}</TableCell>
                              <TableCell>
                                {item.item_photo && (
                                  <img
                                    src={item.item_photo}
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                )}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell>{item.item_type}</TableCell>
                              <TableCell className={styles.tableCell}>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '30px'
                                  }}
                                >
                                  {item.qty_received}
                                </span>
                              </TableCell>
                              <TableCell
                                style={{
                                  // color: "#E7404A",
                                  // border: "1px solid green",
                                  // position: 'relative'
                                  // textAlign: "center",
                                  // fontSize: "15px",
                                  // display: 'flex'
                                  // padding: '0'
                                }}
                              >
                                <div 
                                  style={{
                                    position: 'relative',
                                    // display: 'table',
                                    // alignItems: 'center',
                                    // height: '100%',
                                    width: '100%',
                                    // border: '1px dashed'
                                  }}
                                >
                                  <select
                                    value={item.distribution_unit}
                                    onChange={e => {
                                      // setSmallestMeasure(e.target.value);
                                      console.log("dist unit: ", e.target.value);
                                      setDistributionUnit(e.target.value, item.supply_uid);
                                    }}
                                    className={styles.unit_dropdown}
                                  >
                                    {unitOptions(item)}
                                  </select>
                                  <div className={styles.dropdownArrow}/>
                                </div>
                              </TableCell>
                              <TableCell>
                                {displayUnitNum(item)}
                              </TableCell>
                              <TableCell>
                                {displayUnitMeasure(item)}
                              </TableCell>
                              <TableCell>{item.item_desc}</TableCell>
                              <TableCell></TableCell>
                              <TableCell className={styles.tableCell}>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '30px'
                                  }}
                                >
                                  {calculateDistInv(item)}
                                </span>
                              </TableCell>
                              {/* <TableCell>{item.brand_name}</TableCell>
                              <TableCell>{item.item_name}</TableCell>
                              <TableCell>{item.sup_desc}</TableCell>
                              <TableCell>
                                {item.item_photo && (
                                  <img
                                    src={item.item_photo}
                                    style={{ width: "50px", height: "50px" }}
                                  ></img>
                                )}
                              </TableCell>
                              <TableCell>{item.item_type}</TableCell>
                              <TableCell>{`${item.sup_num} ${item.sup_measure}`}</TableCell>
                              <TableCell>{`${item.detailed_num} ${item.detailed_measure}`}</TableCell> */}
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

      {state.showAddDonation && (
        <AddDonation
          toggleShowAddDonation={toggleShowAddDonation}
        />
      )}

    </div>
  );
}

export default withRouter(Inventory);
