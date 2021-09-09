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
import styles from "./items.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";

const initialState = {
  mounted: false,
  showAddItems: false,
  items: [],
  selectedFile: null,
  newSupply: {
    sup_brand_uid: "",
    sup_item_uid: "",
    sup_desc: ["", "", "", "", "", ""],
    sup_num: "",
    sup_measure: "",
    detailed_num: "",
    detailed_measure: "",
    item_photo: "",
    package_upc: "",
    brand_name: "",
    item_name: "",
  },
  newItem: {
    item_name: "",
    item_desc: "",
    item_type: "",
    item_tags: [],
  },
  newBrand: {
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
  },
  supplyUnits: [],
  uniqueBrands: [],
  uniqueItems: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "TOGGLE_ADD_ITEMS":
      return {
        ...state,
        showAddItems: !state.showAddItems,
      };
    case "UPDATE_ITEMS":
      return {
        ...state,
        items: action.payload,
      };
    case "EDIT_NEW_SUPPLY":
      return {
        ...state,
        newSupply: action.payload,
      };
    case "EDIT_NEW_ITEM":
      return {
        ...state,
        newItem: action.payload,
      };
    case "EDIT_NEW_BRAND":
      return {
        ...state,
        newBrand: action.payload,
      };
    case "GET_SUPPLY_UNITS":
      return {
        ...state,
        supplyUnits: action.payload,
      };
    case "GET_UNIQUE_ITEMS":
      return {
        ...state,
        uniqueItems: action.payload,
      };
    case "GET_UNIQUE_BRANDS":
      return {
        ...state,
        uniqueBrands: action.payload,
      };
    default:
      return state;
  }
}

function Items({ history, ...props }) {
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
          if (role === "admin") {
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
    axios
      .get(`${API_URL}supply_items`)
      .then((response) => {
        const itemsData = response.data.result;
        dispatch({ type: "UPDATE_ITEMS", payload: itemsData });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }, []);

  const toggleAddItems = () => {
    dispatch({ type: "TOGGLE_ADD_ITEMS" });
  };

  const getBrandNameByID = (id) => {
    return state.uniqueBrands.filter((brand) => brand.sup_brand_uid === id)[0]
      .brand_name;
  };
  const getItemNameByID = (id) => {
    return state.uniqueItems.filter((item) => item.sup_item_uid === id)[0]
      .item_name;
  };

  const editNewSupply = (field, value) => {
    const newItemDesc = [...state.newSupply.sup_desc];

    if (field === "sup_brand_uid") newItemDesc[0] = getBrandNameByID(value);
    else if (field === "sup_item_uid") newItemDesc[1] = getItemNameByID(value);
    else if (field === "sup_num") newItemDesc[2] = value;
    else if (field === "sup_measure") newItemDesc[3] = value;
    else if (field === "detailed_num") newItemDesc[4] = value;
    else if (field === "detailed_measure") newItemDesc[5] = value;

    const updatedSupply = {
      ...state.newSupply,
      sup_desc: newItemDesc,
      [field]: value,
    };
    dispatch({ type: "EDIT_NEW_SUPPLY", payload: updatedSupply });
  };

  const getNewSupplyDesc = () => {
    const descArr = state.newSupply.sup_desc;
    console.log(descArr);
    const descStr = `${descArr[0]} ${descArr[1]}, ${descArr[2]}-${descArr[3]}, ${descArr[4]} ${descArr[5]}`;
    // const descStr = "";
    return descStr;
  };

  const editNewItem = (field, value) => {
    const updatedItem = {
      ...state.newItem,
      [field]: value,
    };
    dispatch({ type: "EDIT_NEW_ITEM", payload: updatedItem });
  };

  const addItemTag = (newTag) => {
    const currentTags = [...state.newItem.item_tags];
    currentTags.push(newTag);
    editNewItem("item_tags", currentTags);
  };

  const removeItemTag = (tag) => {
    const currentTags = [...state.newItem.item_tags];
    const itemIndex = currentTags.indexOf(tag);
    currentTags.splice(itemIndex, 1);
    editNewItem("item_tags", currentTags);
  };

  const editNewBrand = (field, value) => {
    const updatedBrand = {
      ...state.newBrand,
      [field]: value,
    };
    dispatch({ type: "EDIT_NEW_BRAND", payload: updatedBrand });
  };

  const getUniqueBrands = () => {
    const uniqueBrandIDs = new Set();
    const brands = state.items.filter((item) => {
      if (!uniqueBrandIDs.has(item.sup_brand_uid)) {
        uniqueBrandIDs.add(item.sup_brand_uid);
        const brand = {
          sup_brand_uid: item.sup_brand_uid,
          brand_name: item.brand_name,
        };
        return brand;
      }
    });
    dispatch({ type: "GET_UNIQUE_BRANDS", payload: brands });
  };

  const getUniqueItems = () => {
    const uniqueItemNames = new Set();
    const items = state.items.filter((item) => {
      if (!uniqueItemNames.has(item.sup_item_uid)) {
        uniqueItemNames.add(item.sup_item_uid);
        const itemName = {
          sup_item_uid: item.sup_item_uid,
          item_name: item.item_name,
        };
        return itemName;
      }
    });
    dispatch({ type: "GET_UNIQUE_ITEMS", payload: items });
  };

  const getSupplyUnits = () => {
    axios.get(`${API_URL}get_units_list`).then((response) => {
      const units = response.data.result;
      dispatch({ type: "GET_SUPPLY_UNITS", payload: units });
    });
  };

  const postNewSupply = () => {
    const supplyFormData = new FormData();

    for (const field of Object.keys(state.newSupply)) {
      console.log(field);
      if (field === "sup_desc") {
        supplyFormData.append(field, getNewSupplyDesc());
      } else if (field === "item_photo") {
        supplyFormData.append(field, state.selectedFile);
      } else {
        supplyFormData.append(field, state.newSupply[field]);
      }
    }

    axios
      .post(`${API_URL}add_supply`, supplyFormData)
      .then((response) => console.log(response));
  };
  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      {console.log(state)}
      <AdminNavBar currentPage={"items"} />
      <Container fluid className={styles.container}>
        <Row
          id="header"
          className={styles.section}
          style={{ height: "123px", padding: "26px 19px" }}
        >
          <Col md="auto">
            <div className={styles.headerText}>Items</div>
          </Col>
          <Col></Col>
          <Col md="auto">
            <div className={styles.headerText}>Total no. of items</div>
            <br></br>
            <div className={styles.headerText}>
              {state.items ? state.items.length : 0}
            </div>
          </Col>
          <Col md="auto">
            <button
              className={styles.headerButtonWhite}
              onClick={() => {
                getSupplyUnits();
                getUniqueBrands();
                getUniqueItems();
                toggleAddItems();
              }}
            >
              Add Items +
            </button>
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
                  Search By
                </div>
              </Col>
              <Col md="auto">
                <input
                  type="text"
                  placeholder="Brand"
                  className={styles.tableSearch}
                />
              </Col>
              <Col md="auto">
                <input
                  type="text"
                  placeholder="Item"
                  className={styles.tableSearch}
                />
              </Col>
              <Col md="auto">
                <input
                  type="text"
                  placeholder="Package"
                  className={styles.tableSearch}
                />
              </Col>
              <Col md="auto">
                <select className={styles.dropdown}>
                  <option key={0}>Type of Food</option>
                </select>
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
                            UPC
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
                            Brand
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
                            Item
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
                            Item
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.items &&
                        state.items.map((item, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{item.package_upc}</TableCell>
                              <TableCell>{item.brand_name}</TableCell>
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
                              <TableCell>{`${item.detailed_num} ${item.detailed_measure}`}</TableCell>
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
      {state.showAddItems && (
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
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              border: "2px solid #E7404A",
              backgroundColor: "white",
              maxHeight: "90%",
              overflow: "scroll",
              width: "auto",
              zIndex: "102",
              padding: "10px 0px 10px 0px",
              borderRadius: "20px",
            }}
          >
            <div style={{ textAlign: "right", padding: "10px" }}>
              <ModalCloseBtn
                style={{ cursor: "pointer" }}
                onClick={() => {
                  toggleAddItems();
                }}
              />
            </div>
            <div
              style={{
                border: "none",
                paddingLeft: "15px",
                fontWeight: "bold",
              }}
            >
              <Modal.Title style={{ fontWeight: "bold" }}>
                Add Supply
              </Modal.Title>
              <Modal.Body>
                <div
                  className={styles.modalContainerVertical}
                  style={{ height: "530px" }}
                >
                  <div className={styles.modalContainerHorizontal}>
                    <div
                      className={styles.modalFormLabel}
                      style={{ width: "150px" }}
                    >
                      Package UPC
                    </div>
                    <input
                      placeholder="Enter Package UPC"
                      className={styles.modalInput}
                      style={{ width: "253px" }}
                      value={state.newSupply.package_upc}
                      onChange={(event) =>
                        editNewSupply("package_upc", event.target.value)
                      }
                    />
                    <div className={styles.modalPlusBtn}></div>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div
                      className={styles.modalFormLabel}
                      style={{ width: "150px" }}
                    >
                      Brand Name
                    </div>
                    <select
                      className={styles.modalDropdown}
                      style={{ width: "253px" }}
                      onChange={(event) => {
                        editNewSupply("sup_brand_uid", event.target.value);
                      }}
                    >
                      <option key={0} value="">
                        Select Brand Name
                      </option>
                      {state.items &&
                        state.uniqueBrands.map((brand, index) => {
                          return (
                            <option
                              key={brand.sup_brand_uid}
                              value={brand.sup_brand_uid}
                            >
                              {brand.brand_name}
                            </option>
                          );
                        })}
                    </select>
                    <div className={styles.modalPlusBtn}>+</div>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div
                      className={styles.modalFormLabel}
                      style={{ width: "150px" }}
                    >
                      Item
                    </div>
                    <select
                      className={styles.modalDropdown}
                      style={{ width: "253px" }}
                      onChange={(event) => {
                        editNewSupply("sup_item_uid", event.target.value);
                      }}
                    >
                      <option key={0} value="">
                        Select Item Name
                      </option>
                      {state.items &&
                        state.uniqueItems.map((item, index) => {
                          return (
                            <option
                              key={item.sup_item_uid}
                              value={item.sup_item_uid}
                            >
                              {item.item_name}
                            </option>
                          );
                        })}
                    </select>
                    <div className={styles.modalPlusBtn}>+</div>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div
                      className={styles.modalFormLabel}
                      style={{ width: "150px" }}
                    >
                      Picture
                    </div>
                    <div className={styles.modalContainerVertical}>
                      {state.newSupply.item_photo && (
                        <img
                          height="150px"
                          width="150px"
                          src={state.newSupply.item_photo}
                        ></img>
                      )}
                      {!state.newSupply.item_photo && (
                        <div style={{ height: "150px", width: "150px" }}></div>
                      )}
                      <input
                        type="file"
                        name="upload_file"
                        onChange={(e) => {
                          state.selectedFile = e.target.files[0];
                          editNewSupply(
                            "item_photo",
                            URL.createObjectURL(e.target.files[0])
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div className={styles.modalContainerVertical}>
                      <div className={styles.modalFormLabel}>Package</div>
                      <input
                        className={styles.modalInput}
                        style={{ width: "79px", textAlign: "center" }}
                        value={state.newSupply.sup_num}
                        onChange={(event) =>
                          editNewSupply("sup_num", event.target.value)
                        }
                      />
                    </div>
                    <div className={styles.modalContainerVertical}>
                      <div className={styles.modalFormLabel}>
                        (Non-Specific)
                      </div>
                      <select
                        className={styles.modalDropdown}
                        style={{ width: "79px" }}
                        onChange={(event) =>
                          editNewSupply("sup_measure", event.target.value)
                        }
                      />
                    </div>
                    <div className={styles.modalContainerVertical}>
                      <div className={styles.modalFormLabel}>Item</div>
                      <input
                        className={styles.modalInput}
                        style={{ width: "79px", textAlign: "center" }}
                        value={state.newSupply.detailed_num}
                        onChange={(event) =>
                          editNewSupply("detailed_num", event.target.value)
                        }
                      />
                    </div>
                    <div className={styles.modalContainerVertical}>
                      <div className={styles.modalFormLabel}>(Specific)</div>
                      <select
                        className={styles.modalDropdown}
                        style={{ width: "79px" }}
                        onChange={(event) =>
                          editNewSupply("detailed_measure", event.target.value)
                        }
                      >
                        <option key="0" value="">
                          -
                        </option>
                        {state.supplyUnits &&
                          state.supplyUnits.map((unit, index) => {
                            return (
                              <option key={index + 1} value={unit.recipe_unit}>
                                {unit.recipe_unit}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div className={styles.modalFormLabel}>
                      Package Recieved
                    </div>
                    <div style={{ lineHeight: "40px" }}>
                      {getNewSupplyDesc()}
                    </div>
                    <div></div>
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
                  onClick={() => postNewSupply()}
                >
                  Add Item
                </button>
                <button
                  className={styles.whiteButton}
                  onClick={() => toggleAddItems()}
                >
                  Cancel
                </button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(Items);
