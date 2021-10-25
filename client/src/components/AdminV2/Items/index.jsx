import { useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { Container, Row, Col, Modal } from "react-bootstrap";
import {
  Table,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { withRouter } from "react-router";
import AdminNavBar from "../AdminNavBar";
import { sortedArray } from "../../../reducers/helperFuncs";
import styles from "./items.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import AddSupply from '../Modals/AddSupply';
import AddBrand from '../Modals/AddBrand';
import AddItem from '../Modals/AddItem';
import AddTags from '../Modals/AddTags';

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
  sortSupply: {
    field: "",
    direction: "asc",
  },
  itemBrandSearch: "",
  itemNameSearch: "",
  itemPackageSearch: "",
  itemTypeFilter: "",
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
    case "SORT_SUPPLY":
      return {
        ...state,
        sortSupply: {
          field: action.payload.field,
          direction: action.payload.direction,
        },
      };
    case "FILTER_BY_BRAND_NAME":
      return {
        ...state,
        itemBrandSearch: action.payload,
      };
    case "FILTER_BY_ITEM_NAME":
      return {
        ...state,
        itemNameSearch: action.payload,
      };
    case "FILTER_BY_PACKAGE":
      return {
        ...state,
        itemPackageSearch: action.payload,
      };
    case "FILTER_BY_FOOD_TYPE":
      return {
        ...state,
        itemTypeFilter: action.payload,
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
      console.log("(mount) customer_uid: ", customer_uid);
      const role = localStorage.getItem('role');
      if (role !== "admin" && role !== "customer") {
        dispatch({ type: "MOUNT" });
      } else {
        history.push("/meal-plan");
      }

      // axios
      //   .get(`${API_URL}Profile/${customer_uid}`)
      //   .then((response) => {
      //     console.log("Profile res: ", response);
      //     const role = response.data.result[0].role.toLowerCase();
      //     console.log("role: ", role);
          // if (role !== "admin" && role !== "customer") {
          //   // console.log("mounting")
          //   // console.log(state.mounted);
          //   dispatch({ type: "MOUNT" });
          // } else {
          //   history.push("/meal-plan");
          // }
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
    getSupplyItems();
    getItemTypes();
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

          dispatch({ type: "EDIT_NEW_BRAND", payload: updatedBrand });
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
      state.selectedFile = null;
    }

    dispatch({ type: "TOGGLE_ADD_SUPPLY" });
  };

  const toggleAddBrand = () => {
    if (state.showAddBrand) {
      getSupplyModalData();
      dispatch({ type: "EDIT_NEW_BRAND", payload: initialState.newBrand });
    } else {
    }

    console.log("in toggle add brand");
    dispatch({ type: "TOGGLE_ADD_BRAND" });
    dispatch({ type: "TOGGLE_ADD_SUPPLY" });
  };

  const toggleAddItemTags = () => {
    // if (!state.showAddItemTags) {
    //   getItemTags();
    // }
    dispatch({ type: "TOGGLE_ADD_ITEM_TAGS" });
  };

  const getBrandNameByID = (id) => {
    return state.uniqueBrands.filter((brand) => brand.brand_uid === id)[0]
      .brand_name;
  };
  const getBrandByName = (id) => {
    console.log("gbbn id: ", id);
    let brand = state.uniqueBrands.filter((brand) => brand.brand_name === id)[0]
      .brand_name
    console.log("gbbn brand: ", brand);
    return brand;
  };
  const getItemNameByID = (id) => {
    return state.uniqueItems.filter((item) => item.item_uid === id)[0]
      .item_name;
  };
  const getItemByName = (id) => {
    console.log("gibn id: ", id);
    let product = state.uniqueItems.filter((item) => item.item_name === id)[0]
      .item_name
    console.log("gibn brand: ", product);
    return product;
  };

  const sortSupply = (field) => {
    const isAsc =
      state.sortSupply.field === field && state.sortSupply.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_SUPPLY",
      payload: { field: field, direction: direction },
    });
    const sortedSupply = sortedArray(state.items, field, direction);
    dispatch({ type: "UPDATE_ITEMS", payload: sortedSupply });
  };

  const editNewSupply = (field, value) => {
    const newItemDesc = [...state.newSupply.sup_desc];

    if (field === "sup_brand_uid") newItemDesc[0] = getBrandNameByID(value);
    // if (field === "sup_brand_uid") newItemDesc[0] = getBrandByName(value);
    else if (field === "sup_item_uid") newItemDesc[1] = getItemNameByID(value);
    // else if (field === "sup_item_uid") newItemDesc[1] = getItemByName(value);
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
    const descStr = `${descArr[0]} ${descArr[1]}, ${descArr[2]} ${descArr[3]}, ${descArr[4]} ${descArr[5]}`;
    return descStr;
  };

  const editNewItem = (field, value) => {
    const updatedItem = {
      ...state.newItem,
      [field]: value,
    };
    dispatch({ type: "EDIT_NEW_ITEM", payload: updatedItem });
  };

  // const toggleItemTag = (itemIndex) => {
  //   const updatedItemTags = [...state.itemTagList];
  //   updatedItemTags[itemIndex].active
  //     ? (updatedItemTags[itemIndex].active = 0)
  //     : (updatedItemTags[itemIndex].active = 1);
  //   dispatch({ type: "GET_ITEM_TAG_LIST", payload: updatedItemTags });
  // };

  // const saveItemTags = () => {
  //   // get all item tags that are active and add to newItem.item_tags
  //   const activeItemTags = [];
  //   state.itemTagList.forEach((itemTag) => {
  //     if (itemTag.active === 1) {
  //       activeItemTags.push(itemTag.tag_name);
  //     }
  //   });
  //   editNewItem("item_tags", activeItemTags);
  //   toggleAddItemTags();
  // };

  const editNewBrand = (field, value) => {
    const updatedBrand = {
      ...state.newBrand,
      [field]: value,
    };
    dispatch({ type: "EDIT_NEW_BRAND", payload: updatedBrand });
  };

  const getUniqueBrands = () => {
    console.log("in getUniqueBrands");
    axios
      .get(`${API_URL}get_brands_list`)
      .then((response) => {
        console.log("gub res: ", response);
        const brands = response.data.result;
        dispatch({ type: "GET_UNIQUE_BRANDS", payload: brands });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getUniqueItems = () => {
    console.log("in getUniqueItems");
    axios
      .get(`${API_URL}get_items_list`)
      .then((response) => {
        console.log("gui res: ", response);
        const items = response.data.result;
        dispatch({ type: "GET_UNIQUE_ITEMS", payload: items });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getSupplyUnits = () => {
    axios
      .get(`${API_URL}get_units_list`)
      .then((response) => {
        const units = response.data.result;
        dispatch({ type: "GET_SUPPLY_UNITS", payload: units });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getSuuplyNonSpecificUnits = () => {
    axios
      .get(`${API_URL}get_non_specific_unit_list`)
      .then((response) => {
        const nonSpecificUnits = response.data.result;
        dispatch({
          type: "GET_SUPPLY_NON_SPECIFIC_UNITS",
          payload: nonSpecificUnits,
        });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  // const getItemTags = () => {
  //   axios
  //     .get(`${API_URL}get_tags_list`)
  //     .then((response) => {
  //       const tagRes = response.data.result;
  //       const tagsList = tagRes.map((tag) => {
  //         const tagItem = {
  //           tag_name: tag.tags,
  //           active: state.newItem.item_tags.includes(tag.tags) ? 1 : 0,
  //         };
  //         return tagItem;
  //       });
  //       dispatch({ type: "GET_ITEM_TAG_LIST", payload: tagsList });
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log(err.response);
  //       }
  //       console.log(err);
  //     });
  // };

  const getItemTypes = () => {
    axios
      .get(`${API_URL}get_types_list`)
      .then((response) => {
        const typesList = response.data.result;
        dispatch({ type: "GET_ITEM_TYPE_LIST", payload: typesList });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  // const postNewSupply = () => {
  //   const supplyFormData = new FormData();

  //   if (state.selectedFile === null) {
  //     alert("invalid inputs");
  //     return;
  //   }

  //   for (const field of Object.keys(state.newSupply)) {
  //     if (field !== "sup_desc" && state.newSupply[field] === "") {
  //       alert(`invalid inputs: ${field}`);
  //       return;
  //     }

  //     if (field === "sup_desc") {
  //       supplyFormData.append(field, getNewSupplyDesc());
  //     } else if (field === "item_photo") {
  //       supplyFormData.append(field, state.selectedFile);
  //     } else {
  //       supplyFormData.append(field, state.newSupply[field]);
  //     }
  //   }

  //   // console.log("posting new supply: ", supplyFormData.values());
  //   // for (var value of supplyFormData.values()) {
  //   //   console.log("new supply: ", value);
  //   // }
  //   for(var pair of supplyFormData.entries()) {
  //     console.log("entry: ", pair[0]+ ', '+ pair[1]);
  //   }
  //   axios
  //     .post(`${API_URL}add_supply`, supplyFormData)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         toggleAddSupply();
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log(err.response);
  //       }
  //       console.log(err);
  //     });
  // };

  // const postNewBrand = () => {
  //   const brandFormData = new FormData();

  //   for (const field of Object.keys(state.newBrand)) {
  //     brandFormData.append(field, state.newBrand[field]);
  //   }

  //   axios
  //     .post(`${API_URL}add_brand`, brandFormData)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         dispatch({ type: "EDIT_NEW_BRAND", payload: initialState.newBrand });
  //         toggleAddBrand();
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log(err.response);
  //       }
  //       console.log(err);
  //     });
  // };

  // const postNewItem = () => {
  //   const itemFormData = new FormData();

  //   for (const field of Object.keys(state.newItem)) {
  //     itemFormData.append(field, state.newItem[field]);
  //   }

  //   axios
  //     .post(`${API_URL}add_items`, itemFormData)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         dispatch({ type: "EDIT_NEW_ITEM", payload: initialState.newItem });
  //         toggleAddItem();
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log(err.response);
  //       }
  //       console.log(err);
  //     });
  // };

  const filterItems = () => {
    console.log("filterItems items: ", state.items);
    return state.items
      .filter((item) => {
        if (state.itemBrandSearch === "") {
          return item;
        } else if (
          item.brand_name &&
          item.brand_name.length > 0 &&
          item.brand_name
            .toLowerCase()
            .includes(state.itemBrandSearch.toLowerCase())
        ) {
          return item;
        }
      })
      .filter((item) => {
        if (state.itemNameSearch === "") {
          return item;
        } else if (
          item.item_name &&
          item.item_name.length > 0 &&
          item.item_name
            .toLowerCase()
            .includes(state.itemNameSearch.toLowerCase())
        ) {
          return item;
        }
      })
      .filter((item) => {
        if (state.itemPackageSearch === "") {
          return item;
        } else if (
          item.sup_desc &&
          item.sup_desc.length > 0 &&
          item.sup_desc
            .toLowerCase()
            .includes(state.itemPackageSearch.toLowerCase())
        ) {
          return item;
        }
      })
      .filter((item) => {
        if (state.itemTypeFilter === "") {
          return item;
        } else if (
          item.item_type &&
          item.item_type.length > 0 &&
          item.item_type
            .toLowerCase()
            .includes(state.itemTypeFilter.toLowerCase())
        ) {
          return item;
        }
      });
  };

  const getSupplyModalData = () => {
    console.log("in getSupplyModalData");
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
                  value={state.itemBrandSearch}
                  onChange={(event) =>
                    dispatch({
                      type: "FILTER_BY_BRAND_NAME",
                      payload: event.target.value,
                    })
                  }
                />
              </Col>
              <Col md="auto">
                <input
                  type="text"
                  placeholder="Item"
                  className={styles.tableSearch}
                  value={state.itemNameSearch}
                  onChange={(event) =>
                    dispatch({
                      type: "FILTER_BY_ITEM_NAME",
                      payload: event.target.value,
                    })
                  }
                />
              </Col>
              <Col md="auto">
                <input
                  type="text"
                  placeholder="Package"
                  className={styles.tableSearch}
                  value={state.itemPackageSearch}
                  onChange={(event) =>
                    dispatch({
                      type: "FILTER_BY_PACKAGE",
                      payload: event.target.value,
                    })
                  }
                />
              </Col>
              <Col md="auto">
                <select
                  className={styles.dropdown}
                  value={state.itemTypeFilter}
                  onChange={(event) =>
                    dispatch({
                      type: "FILTER_BY_FOOD_TYPE",
                      payload: event.target.value,
                    })
                  }
                >
                  <option key={0} value="">
                    Type of Food
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
                            direction={state.sortSupply.direction}
                            onClick={() => sortSupply("supply_uid")}
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
                            direction={state.sortSupply.direction}
                            onClick={() => sortSupply("brand_name")}
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
                            direction={state.sortSupply.direction}
                            onClick={() => sortSupply("item_name")}
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
                            direction={state.sortSupply.direction}
                            onClick={() => sortSupply("sup_desc")}
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
                            direction={state.sortSupply.direction}
                            onClick={() => sortSupply("item_type")}
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
                            direction={state.sortSupply.direction}
                            onClick={() => sortSupply("sup_measure")}
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
                            direction={state.sortSupply.direction}
                            onClick={() => sortSupply("detailed_measure")}
                          >
                            Item
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.items &&
                        filterItems().map((item, index) => {
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
        <AddSupply
          toggleAddSupply={toggleAddSupply}
          toggleAddBrand={toggleAddBrand}
          toggleAddItem={toggleAddItem}
          // toggleAddItemTags={toggleAddItemTags}
          showAddSupply={state.showAddSupply}
        />
      )}
      {state.showAddBrand && (
        <AddBrand
          toggleAddBrand={toggleAddBrand}
          showAddBrand={state.showAddBrand}
        />
      )}
      {state.showAddItem && (
        <AddItem
          toggleAddItem={toggleAddItem}
          toggleAddItemTags={toggleAddItemTags}
          showAddItemTags={state.showAddItemTags}
          showAddItem={state.showAddItem}
        />
      )}
      {/* {state.showAddItemTags && (
        <AddTags
          toggleAddItemTags={toggleAddItemTags}
          showAddItemTags={state.showAddItemTags}
        />
      )} */}
      {/* {state.showAddBrand && ( */}
      {/* <div
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
      </div> */}
      {/* )} */}
      {/* {state.showAddItem && (
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
      )} */}
    </div>
  );
}

export default withRouter(Items);
