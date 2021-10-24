import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import styles from "../Items/items.module.css";
import { API_URL } from "../../../reducers/constants";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import axios from "axios";

const AddSupply = (props) => {

  const [newSupply, setNewSupply] = useState({
    sup_brand_uid: "",
    sup_item_uid: "",
    sup_desc: ["", "", "", "", "", ""],
    sup_num: "",
    sup_measure: "",
    detailed_num: "",
    detailed_measure: "",
    item_photo: "",
    package_upc: "",
  });
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
  const [newItem, setNewItem] = useState({
    item_name: "",
    item_desc: "",
    item_type: "",
    item_tags: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [supplyNonSpecificUnits, setSupplyNonSpecificUnits] = useState([]);
  const [items, setItems] = useState([]);
  const [supplyUnits, setSupplyUnits] = useState([]);
  const [uniqueItems, setUniqueItems] = useState([]);
  const [uniqueBrands, setUniqueBrands] = useState([]);
  const [itemTagList, setItemTagList] = useState([]);
  const [itemTypeList, setItemTypeList] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showAddSupply, setShowAddSupply] = useState(false);

  const getBrandNameByID = (id) => {
    return uniqueBrands.filter((brand) => brand.brand_uid === id)[0]
      .brand_name;
  };
  const getItemNameByID = (id) => {
    return uniqueItems.filter((item) => item.item_uid === id)[0]
      .item_name;
  };

  const editNewSupply = (field, value) => {
    const newItemDesc = [...newSupply.sup_desc];

    if (field === "sup_brand_uid") newItemDesc[0] = getBrandNameByID(value);
    // if (field === "sup_brand_uid") newItemDesc[0] = getBrandByName(value);
    else if (field === "sup_item_uid") newItemDesc[1] = getItemNameByID(value);
    // else if (field === "sup_item_uid") newItemDesc[1] = getItemByName(value);
    else if (field === "sup_num") newItemDesc[2] = value;
    else if (field === "sup_measure") newItemDesc[3] = value;
    else if (field === "detailed_num") newItemDesc[4] = value;
    else if (field === "detailed_measure") newItemDesc[5] = value;

    const updatedSupply = {
      ...newSupply,
      sup_desc: newItemDesc,
      [field]: value,
    };
    setNewSupply(updatedSupply);
  };

  const getNewSupplyDesc = () => {
    const descArr = newSupply.sup_desc;
    const descStr = `${descArr[0]} ${descArr[1]}, ${descArr[2]} ${descArr[3]}, ${descArr[4]} ${descArr[5]}`;
    return descStr;
  };

  const postNewSupply = () => {
    const supplyFormData = new FormData();

    if (selectedFile === null) {
      alert("invalid inputs");
      return;
    }

    for (const field of Object.keys(newSupply)) {
      if (field !== "sup_desc" && newSupply[field] === "") {
        alert(`invalid inputs: ${field}`);
        return;
      }

      if (field === "sup_desc") {
        supplyFormData.append(field, getNewSupplyDesc());
      } else if (field === "item_photo") {
        supplyFormData.append(field, selectedFile);
      } else {
        supplyFormData.append(field, newSupply[field]);
      }
    }

    // console.log("posting new supply: ", supplyFormData.values());
    // for (var value of supplyFormData.values()) {
    //   console.log("new supply: ", value);
    // }
    for(var pair of supplyFormData.entries()) {
      console.log("entry: ", pair[0]+ ', '+ pair[1]);
    }
    axios
      .post(`${API_URL}add_supply`, supplyFormData)
      .then((response) => {
        if (response.status === 200) {
          props.toggleAddSupply();
        }
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
        setSupplyUnits(units);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getUniqueBrands = () => {
    console.log("in getUniqueBrands");
    axios
      .get(`${API_URL}get_brands_list`)
      .then((response) => {
        console.log("gub res: ", response);
        const brands = response.data.result;
        setUniqueBrands(brands);
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
        setUniqueItems(items);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getSupplyNonSpecificUnits = () => {
    axios
      .get(`${API_URL}get_non_specific_unit_list`)
      .then((response) => {
        const nonSpecificUnits = response.data.result;
        setSupplyNonSpecificUnits(nonSpecificUnits)
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getItemTypes = () => {
    axios
      .get(`${API_URL}get_types_list`)
      .then((response) => {
        const typesList = response.data.result;
        // dispatch({ type: "GET_ITEM_TYPE_LIST", payload: typesList });
        setItemTypeList(typesList);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getSupplyModalData = () => {
    console.log("in getSupplyModalData");
    getSupplyUnits();
    getSupplyNonSpecificUnits();
    getUniqueBrands();
    getUniqueItems();
  };

  const toggleAddBrand = () => {
    if (showAddBrand) {
      getSupplyModalData();
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
    } else {
    }

    setShowAddBrand(!showAddBrand);
    setShowAddSupply(!showAddSupply);
  };

  const toggleAddItem = () => {
    if (showAddItem) {
      getSupplyModalData();
      itemTagList.forEach((itemTag) => {
        itemTag.active = 0;
      });
      setNewItem({
        item_name: "",
        item_desc: "",
        item_type: "",
        item_tags: [],
      });
    } else {
      getItemTypes();
    }

    setShowAddItem(!showAddItem);
    setShowAddSupply(!showAddSupply);
  };

  return (
    <>
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
        // border: '1px solid green'
      }}
    >
      <div style={{ textAlign: "right", padding: "10px" }}>
        <ModalCloseBtn
          style={{ cursor: "pointer" }}
          onClick={() => {
            props.toggleAddSupply();
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
              value={newSupply.package_upc}
              onChange={(event) =>
                editNewSupply("package_upc", event.target.value)
              }
            />
            <div className={styles.modalPlusBtn}/>
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
              value={newSupply.sup_brand_uid}
            >
              <option key={0} value="">
                Select Brand Name
              </option>
              {items &&
              uniqueBrands.map((brand, index) => {
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
              value={newSupply.sup_item_uid}
            >
              <option key={0} value="">
                Select Item Name
              </option>
              {items &&
              uniqueItems.map((item, index) => {
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
              {newSupply.item_photo && (
              <img
                height="150px"
                width="150px"
                style={{border: '1px dashed'}}
                src={newSupply.item_photo}
              />
              )}
              {!newSupply.item_photo && (
              <div style={{ height: "150px", width: "150px" }}></div>
              )}
              <input
              type="file"
              name="upload_file"
              onChange={(e) => {
                selectedFile = e.target.files[0];
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
              value={newSupply.sup_num}
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
              value={newSupply.sup_measure}
              >
              <option key="0" value="">
                  -
              </option>
              {supplyNonSpecificUnits &&
                supplyNonSpecificUnits.map((unit, index) => {
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
              value={newSupply.detailed_num}
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
              value={newSupply.detailed_measure}
              >
              <option key="0" value="">
                  -
              </option>
              {supplyUnits &&
              supplyUnits.map((unit, index) => {
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
          onClick={() => props.toggleAddSupply()}
        >
          Cancel
        </button>
      </Modal.Footer>
      </div>
    </div>
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
          visibility: showAddBrand ? "visible" : "hidden",
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
    </>
  );
}

export default AddSupply;