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
  Hidden,
} from "@material-ui/core";
import { style } from "@material-ui/system";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import AdminNavBar from "../AdminNavBar";
import { act } from "react-dom/test-utils";
import { formatTime, sortedArray } from "../../../reducers/helperFuncs";
import styles from "./items.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";

const google = window.google;

const initialState = {
  mounted: false,
  showAddSupply: false,
  showAddBrand: false,
  showAddItem: false,
  showAddItemTags: false,
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
  supplyNonSpecificUnits: [],
  uniqueBrands: [],
  uniqueItems: [],
  itemTagList: [],
  itemTypeList: [],
  autocomplete: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "TOGGLE_ADD_SUPPLY":
      return {
        ...state,
        showAddSupply: !state.showAddSupply,
      };
    case "TOGGLE_ADD_ITEM":
      return {
        ...state,
        showAddItem: !state.showAddItem,
      };
    case "TOGGLE_ADD_BRAND":
      return {
        ...state,
        showAddBrand: !state.showAddBrand,
      };
    case "TOGGLE_ADD_ITEM_TAGS":
      return {
        ...state,
        showAddItemTags: !state.showAddItemTags,
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
    case "GET_SUPPLY_NON_SPECIFIC_UNITS":
      return {
        ...state,
        supplyNonSpecificUnits: action.payload,
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
    case "GET_ITEM_TAG_LIST":
      return {
        ...state,
        itemTagList: action.payload,
      };
    case "GET_ITEM_TYPE_LIST":
      return {
        ...state,
        itemTypeList: action.payload,
      };
    case "TOGGLE_AUTOCOMPLETE":
      return {
        ...state,
        autocomplete: !state.autocomplete,
      };
    default:
      return state;
  }
}

function Items({ history, ...props }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addressInput = useRef(null);

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
    getSupplyItems();
  }, []);

  const addressAutocomplete = () => {
    const input = document.getElementById("pac-input");
    if (input) {
      const options = {
        componentRestrictions: { country: "us" },
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener(
        "place_changed",
        (newBrandState = state.newBrand) => {
          let address1 = "";
          let postcode = "";
          let city = "";
          let state = "";

          let address1Field = document.querySelector("#pac-input");
          let postalField = document.querySelector("#postcode");

          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
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

          // console.log(newBrandState);
          const updatedBrand = {
            ...newBrandState,
            brand_address: address1,
            brand_city: city,
            brand_state: state,
            brand_zip: postcode,
          };

          console.log(updatedBrand);

          dispatch({ type: "EDIT_NEW_BRAND", payload: updatedBrand });

          // this.setState({
          //   name: place.name,
          //   street: address1,
          //   city: city,
          //   state: state,
          //   addressZip: postcode,
          //   latitude: place.geometry.location.lat(),
          //   longitude: place.geometry.location.lng(),
          //   // streetChanged: false,
          //   autoCompleteClicked: true,
          // });
          //console.log(this.state.autoCompleteClicked)
        }
      );
    }
  };

  const toggleAddItem = () => {
    if (state.showAddItem) {
      getSupplyModalData();
      state.itemTagList.forEach((itemTag) => {
        itemTag.active = 0;
      });
      dispatch({ type: "EDIT_NEW_ITEM", payload: initialState.newItem });
    } else {
      getItemTypes();
    }

    dispatch({ type: "TOGGLE_ADD_ITEM" });
    dispatch({ type: "TOGGLE_ADD_SUPPLY" });
  };

  const getSupplyItems = () => {
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
  };

  const toggleAddSupply = () => {
    if (!state.showAddSupply) {
      getSupplyModalData();
    } else {
      getSupplyItems();
      dispatch({ type: "EDIT_NEW_SUPPLY", payload: initialState.newSupply });
    }

    dispatch({ type: "TOGGLE_ADD_SUPPLY" });
  };

  const toggleAddBrand = () => {
    if (state.showAddBrand) {
      getSupplyModalData();
    } else {
      // addressAutocomplete();
    }

    dispatch({ type: "TOGGLE_ADD_BRAND" });
    dispatch({ type: "TOGGLE_ADD_SUPPLY" });
  };

  const toggleAddItemTags = () => {
    if (!state.showAddItemTags) {
      getItemTags();
    }
    dispatch({ type: "TOGGLE_ADD_ITEM_TAGS" });
  };

  const getBrandNameByID = (id) => {
    return state.uniqueBrands.filter((brand) => brand.brand_uid === id)[0]
      .brand_name;
  };
  const getItemNameByID = (id) => {
    return state.uniqueItems.filter((item) => item.item_uid === id)[0]
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
    const descStr = `${descArr[0]} ${descArr[1]}, ${descArr[2]} ${descArr[3]}, ${descArr[4]} ${descArr[5]}`;
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

  const toggleItemTag = (itemIndex) => {
    console.log(state.itemTagList[itemIndex]);
    const updatedItemTags = [...state.itemTagList];
    updatedItemTags[itemIndex].active
      ? (updatedItemTags[itemIndex].active = 0)
      : (updatedItemTags[itemIndex].active = 1);
    console.log(updatedItemTags);
    dispatch({ type: "GET_ITEM_TAG_LIST", payload: updatedItemTags });
  };

  const saveItemTags = () => {
    // get all item tags that are active and add to newItem.item_tags
    const activeItemTags = [];
    state.itemTagList.forEach((itemTag) => {
      if (itemTag.active === 1) {
        activeItemTags.push(itemTag.tag_name);
      }
    });
    editNewItem("item_tags", activeItemTags);
    toggleAddItemTags();
  };

  const editNewBrand = (field, value) => {
    const updatedBrand = {
      ...state.newBrand,
      [field]: value,
    };
    dispatch({ type: "EDIT_NEW_BRAND", payload: updatedBrand });
  };

  const getUniqueBrands = () => {
    axios.get(`${API_URL}get_brands_list`).then((response) => {
      const brands = response.data.result;
      dispatch({ type: "GET_UNIQUE_BRANDS", payload: brands });
    });
  };

  const getUniqueItems = () => {
    axios.get(`${API_URL}get_items_list`).then((response) => {
      const items = response.data.result;
      dispatch({ type: "GET_UNIQUE_ITEMS", payload: items });
    });
  };

  const getSupplyUnits = () => {
    axios.get(`${API_URL}get_units_list`).then((response) => {
      const units = response.data.result;
      dispatch({ type: "GET_SUPPLY_UNITS", payload: units });
    });
  };

  const getSuuplyNonSpecificUnits = () => {
    axios.get(`${API_URL}get_non_specific_unit_list`).then((response) => {
      const nonSpecificUnits = response.data.result;
      dispatch({
        type: "GET_SUPPLY_NON_SPECIFIC_UNITS",
        payload: nonSpecificUnits,
      });
    });
  };

  const getItemTags = () => {
    axios.get(`${API_URL}get_tags_list`).then((response) => {
      const tagRes = response.data.result;
      const tagsList = tagRes.map((tag) => {
        const tagItem = {
          tag_name: tag.tags,
          active: state.newItem.item_tags.includes(tag.tags) ? 1 : 0,
        };
        return tagItem;
      });
      dispatch({ type: "GET_ITEM_TAG_LIST", payload: tagsList });
    });
  };

  const getItemTypes = () => {
    axios.get(`${API_URL}get_types_list`).then((response) => {
      const typesList = response.data.result;
      dispatch({ type: "GET_ITEM_TYPE_LIST", payload: typesList });
    });
  };

  const postNewSupply = () => {
    const supplyFormData = new FormData();

    if (state.selectedFile === null) {
      alert("invalid inputs");
      return;
    }

    for (const field of Object.keys(state.newSupply)) {
      if (field !== "sup_desc" && state.newSupply[field] === "") {
        alert(`invalid inputs: ${field}`);
        return;
      }

      if (field === "sup_desc") {
        supplyFormData.append(field, getNewSupplyDesc());
      } else if (field === "item_photo") {
        supplyFormData.append(field, state.selectedFile);
      } else {
        supplyFormData.append(field, state.newSupply[field]);
      }
    }

    axios.post(`${API_URL}add_supply`, supplyFormData).then((response) => {
      if (response.status === 200) {
        toggleAddSupply();
      }
    });
  };

  const postNewBrand = () => {
    const brandFormData = new FormData();

    for (const field of Object.keys(state.newBrand)) {
      brandFormData.append(field, state.newBrand[field]);
    }

    axios.post(`${API_URL}add_brand`, brandFormData).then((response) => {
      if (response.status === 200) {
        dispatch({ type: "EDIT_NEW_BRAND", payload: initialState.newBrand });
        toggleAddBrand();
      }
    });
  };

  const postNewItem = () => {
    const itemFormData = new FormData();

    for (const field of Object.keys(state.newItem)) {
      itemFormData.append(field, state.newItem[field]);
    }

    axios.post(`${API_URL}add_items`, itemFormData).then((response) => {
      if (response.status === 200) {
        dispatch({ type: "EDIT_NEW_ITEM", payload: initialState.newItem });
        toggleAddItem();
      }
    });
  };

  const getSupplyModalData = () => {
    getSupplyUnits();
    getSuuplyNonSpecificUnits();
    getUniqueBrands();
    getUniqueItems();
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
                toggleAddSupply();
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
      {state.showAddSupply && (
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
                  toggleAddSupply();
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
                      value={state.newSupply.sup_brand_uid}
                    >
                      <option key={0} value="">
                        Select Brand Name
                      </option>
                      {state.items &&
                        state.uniqueBrands.map((brand, index) => {
                          return (
                            <option
                              key={brand.brand_uid}
                              value={brand.brand_uid}
                            >
                              {brand.brand_name}
                            </option>
                          );
                        })}
                    </select>
                    <div
                      className={styles.modalPlusBtn}
                      onClick={() => toggleAddBrand()}
                    >
                      +
                    </div>
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
                      value={state.newSupply.sup_item_uid}
                    >
                      <option key={0} value="">
                        Select Item Name
                      </option>
                      {state.items &&
                        state.uniqueItems.map((item, index) => {
                          return (
                            <option key={item.item_uid} value={item.item_uid}>
                              {item.item_name}
                            </option>
                          );
                        })}
                    </select>
                    <div
                      className={styles.modalPlusBtn}
                      onClick={() => {
                        toggleAddItem();
                      }}
                    >
                      +
                    </div>
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
                        value={state.newSupply.sup_measure}
                      >
                        <option key="0" value="">
                          -
                        </option>
                        {state.supplyNonSpecificUnits &&
                          state.supplyNonSpecificUnits.map((unit, index) => {
                            return (
                              <option
                                key={index + 1}
                                value={unit.ns_units_name}
                              >
                                {unit.ns_units_name}
                              </option>
                            );
                          })}
                      </select>
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
                        value={state.newSupply.detailed_measure}
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
                  onClick={() => toggleAddSupply()}
                >
                  Cancel
                </button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      )}
      {/* {state.showAddBrand && ( */}
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
          visibility: state.showAddBrand ? "visible" : "hidden",
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
              onClick={() => toggleAddBrand()}
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
                    value={state.newBrand.brand_name}
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
                      value={state.newBrand.brand_address}
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
                      value={state.newBrand.brand_unit}
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
                    value={state.newBrand.brand_city}
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
                      value={state.newBrand.brand_state}
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
                      value={state.newBrand.brand_zip}
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
                      value={state.newBrand.brand_contact_first_name}
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
                      value={state.newBrand.brand_contact_last_name}
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
                      value={state.newBrand.brand_phone_num1}
                      onChange={(event) =>
                        editNewBrand("brand_phone_num1", event.target.value)
                      }
                    ></input>
                  </div>
                  <div className={styles.modalContainerVertical}>
                    <div>Phone Number 2</div>
                    <input
                      className={styles.modalInput}
                      value={state.newBrand.brand_phone_num2}
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
                onClick={() => toggleAddBrand()}
              >
                Cancel
              </button>
            </Modal.Footer>
          </div>
        </div>
        {addressAutocomplete()}
      </div>
      {/* )} */}
      {state.showAddItem && (
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
              overflow: "scroll",
              maxHeight: "90%",
            }}
          >
            <div style={{ textAlign: "right", padding: "10px" }}>
              <ModalCloseBtn
                style={{ cursor: "pointer" }}
                onClick={() => toggleAddItem()}
              />
            </div>
            <div
              style={{
                border: "none",
                paddingLeft: "15px",
                fontWeight: "bold",
              }}
            >
              <Modal.Title style={{ fontWeight: "bold" }}>Item</Modal.Title>
              <Modal.Body>
                <div className={styles.modalContainerVertical}>
                  <div className={styles.modalContainerHorizontal}>
                    <div className={styles.modalFormLabel}>Item Name</div>
                    <input
                      className={styles.modalInput}
                      value={state.newItem.item_name}
                      onChange={(event) =>
                        editNewItem("item_name", event.target.value)
                      }
                      style={{ width: "220px" }}
                    ></input>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div className={styles.modalFormLabel}>
                      Item Description
                    </div>
                    <input
                      className={styles.modalInput}
                      value={state.newItem.item_desc}
                      onChange={(event) =>
                        editNewItem("item_desc", event.target.value)
                      }
                      style={{ width: "220px" }}
                    ></input>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div
                      className={styles.modalFormLabel}
                      onClick={() => {
                        toggleAddItemTags();
                      }}
                    >
                      Add Item Tags +
                    </div>
                    <div style={{ width: "260px", paddingLeft: "40px" }}>
                      {state.newItem &&
                        state.newItem.item_tags &&
                        state.newItem.item_tags.map((itemTag, index) => {
                          return (
                            <div key={index} className={styles.itemTagSelected}>
                              {itemTag}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className={styles.modalContainerHorizontal}>
                    <div className={styles.modalFormLabel}>Type of Food</div>
                    <select
                      className={styles.modalDropdown}
                      onChange={(event) =>
                        editNewItem("item_type", event.target.value)
                      }
                      value={state.newItem.item_type}
                      style={{ width: "220px" }}
                    >
                      <option key="0" value="">
                        Select Type of Food
                      </option>
                      {state.itemTypeList &&
                        state.itemTypeList.map((type, index) => {
                          return (
                            <option key={index} value={type.types}>
                              {type.types}
                            </option>
                          );
                        })}
                    </select>
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
                  onClick={() => postNewItem()}
                >
                  Add Item
                </button>
                <button
                  className={styles.whiteButton}
                  onClick={() => toggleAddItem()}
                >
                  Cancel
                </button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      )}
      {state.showAddItemTags && (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            position: "fixed",
            display: "grid",
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
              height: "auto",
              width: "auto",
              zIndex: "102",
              padding: "10px 0px 10px 0px",
              borderRadius: "20px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                border: "none",
                paddingLeft: "15px",
                fontWeight: "bold",
              }}
            >
              <Modal.Title style={{ fontWeight: "bold" }}>
                Select Item tags to add
              </Modal.Title>
              <Modal.Body>
                <div style={{ maxWidth: "300px" }}>
                  {state.itemTagList &&
                    state.itemTagList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            item.active
                              ? styles.itemTagSelected
                              : styles.itemTagNotSelected
                          }
                          onClick={() => toggleItemTag(index)}
                        >
                          {item.tag_name}
                        </div>
                      );
                    })}
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
                  className={styles.whiteButton}
                  onClick={() => saveItemTags()}
                >
                  Add Meal Tags
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
