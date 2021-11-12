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
  const [distributionOptions, setDistributionOptions] = useState([]);

  const [items, setItems] = useState(null);
  const [units, setUnits] = useState(null);
  const [inventory, setInventory] = useState(null);

  const [editDistItem, setEditDistItem] = useState(null);

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

  const getDistOptions = (business_uid) => {
    axios
      .get(`${API_URL}Distribution_Options`)
      .then((res) => {
        console.log("getDistOptions res: ", res);
        // setInventory(res.data.result);
        setDistributionOptions(res.data.result);
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
      eachUnits !== null &&
      distributionOptions !== null
    ) {
      // console.log("setting inventory...");
      // console.log("items: ", items);
      let tempInventory = [];
      items.forEach((item) => {
        console.log("\n(UE) item: ", item);
        let itemCopy = {...item};
        let distribution_units = [];
        // console.log("itemCopy: ", itemCopy);
        // console.log("item final: ", itemCopy);
        let defaultMeasure = "";

        let dist_options = distributionOptions.filter(dopts => dopts.dist_supply_uid === item.supply_uid);
        console.log("(UE) dist_options: ", dist_options);

        if(itemCopy.volume_measure !== null && itemCopy.volume_num !== null) {
          distribution_units.push({
            type: "Volume", 
            measure: itemCopy.volume_measure,
            qty: itemCopy.volume_num
          });
          if(distribution_units.length === 1) {
            itemCopy.distribution_unit = "Volume";
            defaultMeasure = itemCopy.volume_measure;
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
            defaultMeasure = itemCopy.mass_measure;
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
            defaultMeasure = itemCopy.each_measure;
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
            defaultMeasure = itemCopy.length_measure;
          }
        }

        itemCopy.distribution_units = distribution_units;
        itemCopy.distribution_qty = 1;
        itemCopy.distribution_measure = defaultMeasure;
        itemCopy.distribution_options = dist_options;

        // only push to inventory if package has valid data in measures column
        if(distribution_units.length > 0 && dist_options.length > 0) {
          tempInventory.push(itemCopy)
        }

      });
      // console.log("\nfinal inventory: ", tempInventory);

      setInventory(tempInventory);
    }
  }, [items, massUnits, volumeUnits, lengthUnits, eachUnits, distributionOptions]);

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
      getDistOptions();

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
    console.log("(UO) item: ", item);
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

  const measureOptions = (item) => {
    if(item.distribution_unit.toUpperCase() === "MASS") {
      return (
        <div 
          style={{
            position: 'relative',
            width: '100%'
          }}
        >
          <select
            value={editDistItem.distribution_measure}
            onChange={e => {
              // setSmallestMeasure(e.target.value);
              console.log("dist unit: ", e.target.value);
              setEditedMeasure(e.target.value, editDistItem.supply_uid);
            }}
            className={styles.unit_dropdown}
          >
            {massOptions(editDistItem)}
          </select>
          <div className={styles.dropdownArrow}/>
        </div>
      );
    } else if (item.distribution_unit.toUpperCase() === "VOLUME") {
      return (
        <div 
          style={{
            position: 'relative',
            width: '100%'
          }}
        >
          <select
            value={editDistItem.distribution_measure}
            onChange={e => {
              // setSmallestMeasure(e.target.value);
              console.log("dist unit: ", e.target.value);
              setEditedMeasure(e.target.value, editDistItem.supply_uid);
            }}
            className={styles.unit_dropdown}
          >
            {volumeOptions(editDistItem)}
          </select>
          <div className={styles.dropdownArrow}/>
        </div>
      );
    } else if (item.distribution_unit.toUpperCase() === "EACH") {
      return (
        <div 
          style={{
            position: 'relative',
            width: '100%'
          }}
        >
          <select
            value={editDistItem.distribution_measure}
            onChange={e => {
              // setSmallestMeasure(e.target.value);
              console.log("dist unit: ", e.target.value);
              setEditedMeasure(e.target.value, editDistItem.supply_uid);
            }}
            className={styles.unit_dropdown}
          >
            {eachOptions(editDistItem)}
          </select>
          <div className={styles.dropdownArrow}/>
        </div>
      );
    } else if (item.distribution_unit.toUpperCase() === "LENGTH") {
      return (
        <div 
          style={{
            position: 'relative',
            width: '100%'
          }}
        >
          <select
            value={editDistItem.distribution_measure}
            onChange={e => {
              // setSmallestMeasure(e.target.value);
              console.log("dist unit: ", e.target.value);
              setEditedMeasure(e.target.value, editDistItem.supply_uid);
            }}
            className={styles.unit_dropdown}
          >
            {lengthOptions(editDistItem)}
          </select>
          <div className={styles.dropdownArrow}/>
        </div>
      );
    } else {
      return (
        <div 
          style={{
            position: 'relative',
            // display: 'table',
            // alignItems: 'center',
            // height: '100%',
            width: '100%',
            // border: '1px dashed'
          }}
          // className={}
        >
          {"<ERROR>"}
        </div>
      );
    }
  }

  const setDistributionUnit = (unit, uid) => {
    let newInventory = [...inventory];
    console.log("(sdu) uid: ", uid);
    console.log("(sdu) unit: ", unit);
    let itemIndex = inventory.findIndex((inv) => {
      // console.log("dist: ", dist);
      return inv.supply_uid === uid;
    });
    // console.log("item index: ", itemIndex);
    let itemCopy = {...inventory[itemIndex]};
    // console.log("item copy: ", itemCopy);
    itemCopy.distribution_unit = unit;
    console.log("(sdu) new item: ", itemCopy);
    newInventory[itemIndex] = itemCopy;
    console.log("(sdu) new inventory: ", newInventory);
    setEditDistItem(itemCopy);
    setInventory(newInventory);
  }

  const setDistributionMeasure = (measure, uid) => {
    let newInventory = [...inventory];
    console.log("(sdu) uid: ", uid);
    console.log("(sdu) measure: ", measure);
    let itemIndex = inventory.findIndex((inv) => {
      // console.log("dist: ", dist);
      return inv.supply_uid === uid;
    });
    // console.log("item index: ", itemIndex);
    let itemCopy = {...inventory[itemIndex]};
    // console.log("item copy: ", itemCopy);
    itemCopy.distribution_measure = measure;
    console.log("(sdu) new item: ", itemCopy);
    newInventory[itemIndex] = itemCopy;
    console.log("(sdu) new inventory: ", newInventory);
    setEditDistItem(itemCopy);
    setInventory(newInventory);
  }

  const setEditedUnit = (unit) => {
    // console.log("(SEU) item: ", item);
    let itemCopy = {...editDistItem};
    itemCopy.distribution_unit = unit;
    let unitInfo = itemCopy.distribution_units.find((du) => {
      return du.type === unit;
    })
    itemCopy.distribution_qty = 1;
    itemCopy.distribution_measure = unitInfo.measure;
    console.log("(SEU) itemCopy: ", itemCopy);
    setEditDistItem(itemCopy);
  }

  const setEditedMeasure = (measure) => {
    let itemCopy = {...editDistItem};
    itemCopy.distribution_measure = measure;
    setEditDistItem(itemCopy);
  }

  const setEditedQty = (qty) => {
    let itemCopy = {...editDistItem};
    itemCopy.distribution_qty = qty;
    setEditDistItem(itemCopy);
  }

  const saveEdits = () => {
    console.log("(SE) item: ", editDistItem);
    // let newInventory = [...inventory];
    // let itemIndex = inventory.findIndex((inv) => {
    //   return inv.supply_uid === editDistItem.supply_uid;
    // });
    // let itemCopy = {...inventory[itemIndex]};

    // console.log("(SE) edit item: ", editDistItem);
    // itemCopy.distribution_unit = editDistItem.distribution_unit;
    // itemCopy.distribution_qty = editDistItem.distribution_qty;
    // itemCopy.distribution_measure = editDistItem.distribution_measure;
    // console.log("(SE) inv item: ", itemCopy);
    // newInventory[itemIndex] = itemCopy;
    // // setEditDistItem(itemCopy);
    // setInventory(newInventory);
    // const distFormData = new FormData();
    // // uid = request.form.get('dist_options_uid')
    // // dist_num = request.form.get('dist_num')
    // // dist_measure = request.form.get('dist_measure')
    // // dist_unit = request.form.get('dist_unit')
    // // item_photo = request.files.get('dist_item_photo') if request.files.get(
    // distFormData.append('dist_options_uid', );
    // distFormData.append('dist_num', );
    // distFormData.append('dist_measure', );
    // distFormData.append('dist_unit', editDistItem);
    // axios
    //   .post(`${API_URL}Distribution_Options`)
    //   .then((res) => {
    //     console.log("getDistOptions res: ", res);
    //     // setInventory(res.data.result);
    //     setDistributionOptions(res.data.result);
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       // eslint-disable-next-line no-console
    //       console.log(err.response);
    //     }
    //     // eslint-disable-next-line no-console
    //     console.log(err);
    //   });
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
    console.log("\n(cdi) item: ", item);
    console.log("(cdi) conversion units: ", conversionUnits);
    // let dist_inv = 0;
    // let distUnit = "";
    // let supplyUnit = "";
    // if(item.distribution_unit.toUpperCase() === "VOLUME") {
    //   distUnit = conversionUnits.find((cu) => {
    //     return (
    //       cu.type.toUpperCase() === item.distribution_unit.toUpperCase() && 
    //       cu.recipe_unit.toUpperCase() === displayUnitMeasure(item).toUpperCase()
    //     );
    //   });
    // } else if (item.distribution_unit.toUpperCase() === "MASS") {
    //   distUnit = conversionUnits.find((cu) => {
    //     return (
    //       cu.type.toUpperCase() === item.distribution_unit.toUpperCase() && 
    //       cu.recipe_unit.toUpperCase() === displayUnitMeasure(item).toUpperCase()
    //     );
    //   });
    // } else if (item.distribution_unit.toUpperCase() === "LENGTH") {
    //   distUnit = conversionUnits.find((cu) => {
    //     return (
    //       cu.type.toUpperCase() === item.distribution_unit.toUpperCase() && 
    //       cu.recipe_unit.toUpperCase() === displayUnitMeasure(item).toUpperCase()
    //     );
    //   });
    // } else if (item.distribution_unit.toUpperCase() === "EACH") {
    //   distUnit = conversionUnits.find((cu) => {
    //     return (
    //       cu.type.toUpperCase() === item.distribution_unit.toUpperCase() && 
    //       cu.recipe_unit.toUpperCase() === displayUnitMeasure(item).toUpperCase()
    //     );
    //   });
    // }
    let supplyUnit = conversionUnits.find((cu) => {
      return (
        cu.type.toUpperCase() === item.distribution_unit.toUpperCase() && 
        cu.recipe_unit.toUpperCase() === displayUnitMeasure(item).toUpperCase()
      );
    });
    let distUnit = conversionUnits.find((cu) => {
      return (
        cu.type.toUpperCase() === item.distribution_unit.toUpperCase() && 
        cu.recipe_unit.toUpperCase() === item.distribution_measure.toUpperCase()
      );
    });
    // console.log("(cdi) package qty: ", item.qty_received);
    // console.log("(cdi) unit measure: ", displayUnitMeasure(item));
    console.log("(cdi) dist unit: ", distUnit);
    console.log("(cdi) supply unit: ", supplyUnit);
    console.log("(cdi) unit num: ", displayUnitNum(item));

    let pkg_measure_qty = parseFloat(displayUnitNum(item));
    let base_conversion = (
      parseFloat(supplyUnit.conversion_ratio) /
      parseFloat(distUnit.conversion_ratio)
    );
    let base_inv = pkg_measure_qty * base_conversion;
    let inv_per_pkg = base_inv / parseFloat(item.distribution_qty);
    let dist_inv = Math.floor(inv_per_pkg * parseFloat(item.qty_received));

    console.log("(cdi) base conversion: ", base_conversion);
    console.log("(cdi) inv per 1 package: ", inv_per_pkg);
    console.log("(cdi) distribution inventory: ", dist_inv);
    console.log("\n");

    return dist_inv;
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

      {editDistItem && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '36px',
            zIndex: '10',
            border: '1px solid #e7404a',
            borderRadius: '15px',
            backgroundColor: '#FFE3E5',
            height: '190px',
            // width: '400px'
          }}
        >
          <div
            style={{
              // border: '1px dashed',
              display: 'flex',
              padding: '10px',
              position: 'relative'
            }}
          >
            <div className={styles.editField}>
              <span className={styles.editLabel}>Distribution <br/>Unit</span>
              <div 
                style={{
                  position: 'relative',
                  // display: 'table',
                  // alignItems: 'center',
                  // height: '100%',
                  width: '100%',
                  // border: '1px dashed'
                }}
                // className={}
              >
                <select
                  value={editDistItem.distribution_unit}
                  onChange={e => {
                    // setSmallestMeasure(e.target.value);
                    console.log("dist unit: ", e.target.value);
                    setEditedUnit(e.target.value);
                  }}
                  className={styles.unit_dropdown}
                >
                  {unitOptions(editDistItem)}
                </select>
                <div className={styles.dropdownArrow}/>
              </div>
            </div>
            <div className={styles.editField}>
              <span className={styles.editLabel}>Item Qty.</span>
              <input
                className={styles.editInput}
                onChange={e => setEditedQty(e.target.value)}
                value={editDistItem.distribution_qty}
              />
            </div>
            <div className={styles.editField}>
              <span className={styles.editLabel}>Item <br/>Measure</span>
              {/* <input
                className={styles.editInput}
              /> */}
              {measureOptions(editDistItem)}
            </div>
            <div className={styles.editField}>
              <span className={styles.editLabel}>Name</span>
              <div className={styles.editValueWrapper}>
                <span className={styles.editValue}>Mahatma Rice, 5 lbs</span>
              </div>
            </div>
            <div className={styles.editField}>
              <span 
                className={styles.editLabel}
                style={{
                  height: '40px'
                }}
              >
                Item Picture
              </span>
              <img
                className={styles.editImage}
              />
            </div>
            <div className={styles.editField}>
              <span className={styles.editLabel}>Distribution <br/>Inventory</span>
              <div className={styles.editValueWrapper}>
                <span className={styles.editValueBold}>6</span>
              </div>
            </div>
          </div>
          <div
            style={{
              // border: '1px dashed',
              position: 'absolute',
              bottom: '0',
              width: '100%',
              // height: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button 
              className={styles.editBtnWhite}
              onClick={() => {setEditDistItem(null)}}
            >
              Cancel
            </button>
            <button 
              className={styles.editBtnRed}
              onClick={() => {saveEdits()}}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <AdminNavBar currentPage={"inventory"} />
      <Container 
        fluid 
        className={editDistItem ? (styles.containerWithMargin) : (styles.container)}
      >
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
                            {/* Distribution Inventory */}
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
                                {item.distribution_unit}
                                {/* <div 
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
                                      setDistribfutionUnit(e.target.value, item.supply_uid);
                                    }}
                                    className={styles.unit_dropdown}
                                  >
                                    {unitOptions(item)}
                                  </select>
                                  <div className={styles.dropdownArrow}/>
                                </div> */}
                              </TableCell>
                              <TableCell>
                                {/* {displayUnitNum(item)} */}
                                {item.distribution_qty}
                              </TableCell>
                              <TableCell>
                                {/* {displayUnitMeasure(item)} */}
                                {item.distribution_measure}
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
                              <TableCell>
                                <button
                                  className={styles.editBtn}
                                  onClick={() => {setEditDistItem(item)}}
                                />
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
