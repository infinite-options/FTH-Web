import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import styles from "../Items/items.module.css";
import { API_URL } from "../../../reducers/constants";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import axios from "axios";

import AddBrand from '../Modals/AddBrand';
import AddItem from '../Modals/AddItem';
import AddTags from '../Modals/AddTags';

const RECEIVE_WAITING = 0;
const RECEIVE_SUCCESS = -1;
const RECEIVE_FAILURE = 1;

const AddSupply = (props) => {

  const [packageUPC, setPackageUPC] = useState(null);
	const [brandUID, setBrandUID] = useState(null);
	const [itemUID, setItemUID] = useState(null);
	const [itemPhoto, setItemPhoto] = useState(null);

  const [receiveStatus, setReceiveStatus] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [supplyNonSpecificUnits, setSupplyNonSpecificUnits] = useState(null);
  const [items, setItems] = useState([]);
  const [supplyUnits, setSupplyUnits] = useState([]);
  const [uniqueItems, setUniqueItems] = useState(null);
  const [uniqueBrands, setUniqueBrands] = useState(null);
  const [itemTagList, setItemTagList] = useState([]);
  const [itemTypeList, setItemTypeList] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddItemTags, setShowAddItemTags] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);

  const [massUnits, setMassUnits] = useState(null);
  const [volumeUnits, setVolumeUnits] = useState(null);
  const [lengthUnits, setLengthUnits] = useState(null);
  const [eachUnits, setEachUnits] = useState(null);

  const [massNum, setMassNum] = useState(null);
  const [massMeasure, setMassMeasure] = useState(null);
  const [volumeNum, setVolumeNum] = useState(null);
  const [volumeMeasure, setVolumeMeasure] = useState(null);
  const [lengthNum, setLengthNum] = useState(null);
  const [lengthMeasure, setLengthMeasure] = useState(null);
  const [eachNum, setEachNum] = useState(null);
  const [eachMeasure, setEachMeasure] = useState(null);

  const [smallestMeasure, setSmallestMeasure] = useState(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getSupplyModalData();
  }, []);

  const getBrandNameByID = (id) => {
    return uniqueBrands.filter((brand) => brand.brand_uid === id)[0]
      .brand_name;
  };

  const getItemNameByID = (id) => {
    return uniqueItems.filter((item) => item.item_uid === id)[0]
      .item_name;
  };

  const formatSupplyDescription = (brand_uid, item_uid, measure) => {
    if(brand_uid === null || item_uid === null || measure === null) {return '<error>'}
    let formattedStr = measure + " of " + getBrandNameByID(brandUID) + " " + getItemNameByID(itemUID) + " (";
    let measures = 0;
    if(
      volumeNum !== null &&
      volumeMeasure !== null
    ) {
      formattedStr = formattedStr + volumeNum + " " + volumeMeasure;
      measures++;
    }
    if (
      massNum !== null &&
      massMeasure !== null
    ) {
      if(measures > 0) {
        formattedStr = formattedStr + ", " + massNum + " " + massMeasure;
      } else {
        formattedStr = formattedStr + massNum + " " + massMeasure;
      }
      measures++;
    }
    if (
      lengthNum !== null &&
      lengthMeasure !== null
    ) {
      if(measures > 0) {
        formattedStr = formattedStr + ", " + lengthNum + " " + lengthMeasure;
      } else {
        formattedStr = formattedStr + lengthNum + " " + lengthMeasure;
      }
      measures++;
    }
    if (
      eachNum !== null &&
      eachMeasure !== null
    ) {
      if(measures > 0) {
        formattedStr = formattedStr + ", " + eachNum + " " + eachMeasure;
      } else {
        formattedStr = formattedStr + eachNum + " " + eachMeasure;
      }
      measures++;
    }
    formattedStr += ")"
    return formattedStr;
  }

  const postNewSupply = () => {
    console.log("clicked add item: ", smallestMeasure);
    // console.log("desc: ", formatSupplyDescription());
    let sup_desc = formatSupplyDescription(
      brandUID,
      itemUID,
      smallestMeasure
    );
    console.log("supply description: ", sup_desc);
    
    setReceiveStatus(RECEIVE_WAITING);
    const supplyFormData = new FormData();
    supplyFormData.append('package_upc', packageUPC);
    supplyFormData.append('sup_brand_uid', brandUID);
    supplyFormData.append('sup_item_uid', itemUID);
    supplyFormData.append('sup_desc', sup_desc);
    supplyFormData.append('sup_measure', smallestMeasure);
    if(massNum !== null) supplyFormData.append('mass_num', massNum);
    if(massMeasure !== null) supplyFormData.append('mass_measure', massMeasure);
    if(volumeNum !== null) supplyFormData.append('volume_num', volumeNum);
    if(volumeMeasure !== null) supplyFormData.append('volume_measure', volumeMeasure);
    if(lengthNum !== null) supplyFormData.append('length_num', lengthNum);
    if(lengthMeasure !== null) supplyFormData.append('length_measure', lengthMeasure);
    if(eachNum !== null) supplyFormData.append('each_num', eachNum);
    if(eachMeasure !== null) supplyFormData.append('each_measure', eachMeasure);
    if(selectedFile !== null) supplyFormData.append('item_photo', selectedFile);
    axios
      .post(`${API_URL}add_supply`, supplyFormData)
      .then((response) => {
        if (response.status === 200) {
          props.toggleAddSupply(true);
          setReceiveStatus(null);
        }
        setReceiveStatus(null);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
        setReceiveStatus(null);
      });
  }

  const getSupplyUnits = () => {
    axios
      .get(`${API_URL}get_units_list`)
      .then((response) => {
        console.log("gul res: ", response);
        const units = response.data.result;
        // setSupplyUnits(units);
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
        console.log("gnsul res: ", response);
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

  const disableReceiveSupply = () => {
    if(
      receiveStatus !== null || selectedFile === null ||
      brandUID === null || itemUID === null || 
      packageUPC === null || packageUPC === '' ||
      smallestMeasure === null ||
      (
        (
          volumeNum === null || 
          volumeMeasure === null ||
          volumeNum === ''
        ) &&
        (
          massNum === null || 
          massMeasure === null ||
          massNum === ''
        ) &&
        (
          lengthNum === null || 
          lengthMeasure === null ||
          lengthNum === ''
        ) &&
        (
          eachNum === null || 
          eachMeasure === null ||
          eachNum === ''
        )
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  const getSupplyModalData = () => {
    console.log("in getSupplyModalData");
    getSupplyUnits();
    getSupplyNonSpecificUnits();
    getUniqueBrands();
    getUniqueItems();
  };

  useEffect(() => {
    if(
      volumeUnits !== null && lengthUnits !== null && 
      eachUnits !== null && massUnits !== null &&
      supplyNonSpecificUnits !== null && 
      uniqueBrands !== null && uniqueItems !== null
    ) {
      setMounted(true);
    }
  }, [
    volumeUnits, lengthUnits, eachUnits, massUnits,
    supplyNonSpecificUnits, uniqueBrands, uniqueItems
  ]);

  const smallestMeasureOptions = () => {
    let opts = [<option disabled selected value> -- </option>];
    supplyNonSpecificUnits.forEach((unit, index) => {
      // console.log("smo unit: ", unit);
      opts.push(
        <option key={index} value={unit.ns_units_name}>
          {unit.ns_units_name}
        </option>
      );
    });
    return opts;
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
              {mounted ? (
      <div
        style={{
          position: "relative",
          justifySelf: "center",
          alignSelf: "center",
          display: "block",
          border: "2px solid #E7404A",
          backgroundColor: "white",
          maxHeight: "90%",
          overflow: "auto",
          width: "auto",
          zIndex: "102",
          // padding: "10px 0px 10px 0px",
          borderRadius: "20px",
          // border: '1px solid green'
        }}
      >
        {/* <div 
          // style={{ textAlign: "right", padding: "10px" }}
        >
          <ModalCloseBtn
            className={styles.closeBtn}
            onClick={() => {
              props.toggleAddSupply();
            }}
          />
        </div> */}

        <ModalCloseBtn
          className={styles.as_closeBtn}
          onClick={() => {
            props.toggleAddSupply();
          }}
        />

          <div
            style={{
              border: "none",
              // paddingLeft: "15px",
              margin: '60px 20px 20px 20px',
              fontWeight: "bold",
              // border: '1px dashed',
              // width: ''
            }}
          >

            {/* <Modal.Title style={{ fontWeight: "bold" }}>
              Add Supply
            </Modal.Title> */}
            <h3 style={{ fontWeight: "bold" }}>
              Add Supply
            </h3>

            {/* <Modal.Body> */}
            <div 
              style={{
                // border: '1px solid brown', 
                margin: '30px 0' 
              }}
            >
              <div
                className={styles.modalContainerVertical}
                // style={{ height: "530px" }}
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
                  // value={newSupply.package_upc}
                  value={packageUPC}
                  onChange={(event) => setPackageUPC(event.target.value)}
                    // editNewSupply("package_upc", event.target.value)
                  // }
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
                  // onChange={event => {
                  //   console.log("click: ", event.target.value);
                  //   setBrandUID(event.target.value.brand_uid);
                  //   setBrandName(event.target.value.brand_name);
                  // }}
                  onChange={event => setBrandUID(event.target.value)}
                  //   editNewSupply("sup_brand_uid", event.target.value);
                  // }}
                  // value={newSupply.sup_brand_uid}
                  value={brandUID}
                >
                  {/* <option key={0} value="">
                    Select Brand Name
                  </option> */}
                  <option disabled selected value> -- </option>
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
                  onClick={() => props.toggleAddBrand()}
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
                  onChange={(event) => setItemUID(event.target.value)}
                  //   editNewSupply("sup_item_uid", event.target.value);
                  // }}
                  // value={newSupply.sup_item_uid}
                  value={itemUID}
                >
                  {/* <option key={0} value="">
                    Select Item Name
                  </option> */}
                  <option disabled selected value> -- </option>
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
                    props.toggleAddItem();
                  }}
                >
                  +
                </div>
              </div>

              <div style={{ marginTop: '30px' }} className={styles.modalContainerHorizontal}>
                <div
                  className={styles.modalFormLabel}
                  style={{ width: "150px" }}
                >
                  Picture
                </div>

                {/* <div className={styles.ad_section_label_wrapper}>
                  <span className={styles.ad_section_label}>Picture</span>
                </div>
                <div className={styles.ad_section_photo_wrapper}>
                  <img
                    className={styles.ad_section_image}
                    src={photoURL}
                  />
                </div> */}

                <div className={styles.modalContainerVertical}>
                  {/* {newSupply.item_photo && (
                  <img
                    height="150px"
                    width="150px"
                    style={{border: '1px dashed'}}
                    src={newSupply.item_photo}
                  />
                  )} */}
                  {/* {newSupply.item_photo && ( */}
                    <img
                      height="150px"
                      width="150px"
                      style={{marginBottom: '10px'}}
                      // src={newSupply.item_photo}
                      src={itemPhoto}
                    />
                  {/* )} */}
                  {/* {!newSupply.item_photo && (
                    <div style={{ height: "150px", width: "150px" }}></div>
                  )} */}
                  <input
                    type="file"
                    name="upload_file"
                    onChange={(e) => {
                      // selectedFile = e.target.files[0];
                      setSelectedFile(e.target.files[0]);
                      console.log("selected photo: ", e.target.files[0]);
                      // editNewSupply(
                      //   "item_photo",
                      //   URL.createObjectURL(e.target.files[0])
                      // );
                      setItemPhoto(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </div>
                </div>

                {/* <div className={styles.modalContainerHorizontal}>

                  <div >

                  </div> */}

                  {/* <div className={styles.modalContainerVertical}>
                    <div className={styles.modalFormLabel}>Package</div>
                    <input
                      className={styles.modalInput}
                      style={{ width: "79px", textAlign: "center" }}
                      value={newSupply.sup_num}
                      onChange={(event) =>
                          editNewSupply("sup_num", event.target.value)
                      }
                    />
                  </div> */}

                  {/* <div className={styles.modalContainerVertical}>
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
                  </div> */}
  
                  {/* <div className={styles.modalContainerVertical}>
                    <div className={styles.modalFormLabel}>Item</div>
                    <input
                    className={styles.modalInput}
                    style={{ width: "79px", textAlign: "center" }}
                    value={newSupply.detailed_num}
                    onChange={(event) =>
                        editNewSupply("detailed_num", event.target.value)
                    }
                    />
                  </div> */}

                  {/* <div className={styles.modalContainerVertical}>
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
                  </div> */}

                {/* </div> */}

                <div style={{marginTop: '30px', width: '500px'}} className={styles.input_container}>
                  <span>What is the smallest distributable package received?</span>
                  {/* <select
                    value={smallestMeasure}
                    onChange={e => {
                      setSmallestMeasure(e.target.value);
                    }}
                    // className={styles.ad_section_dropdown}
                  >
                    {smallestMeasureOptions()}
                  </select> */}
                  <div className={styles.input_1stFromRight}>
                    <span>Measure</span>
                    <select
                      value={smallestMeasure}
                      onChange={e => {
                        setSmallestMeasure(e.target.value);
                      }}
                      className={styles.measure_dropdown}
                    >
                      {smallestMeasureOptions()}
                    </select>
                    <div className={styles.dropdownArrow}/>
                  </div>
                </div>

                <div style={{marginTop: '40px'}} className={styles.input_container}>
                  <span style={{color: "black"}}>(Please enter at least one of the following equivalent measures)</span>
                </div>

                <div className={styles.input_container}>
                  <span>Each {smallestMeasure ? smallestMeasure.toLowerCase() : "<measure>"} is (volume)</span>
                  <div className={styles.input_1stFromRight}>
                    <span>Measure</span>
                    <select
                      value={volumeMeasure}
                      onChange={e => {
                        setVolumeMeasure(e.target.value);
                      }}
                      className={styles.measure_dropdown}
                    >
                      {volumeOptions()}
                    </select>
                    <div className={styles.dropdownArrow}/>
                  </div>
                  <div className={styles.input_2ndFromRight}>
                    <span>Num</span>
                    <input 
                      value={volumeNum}
                      onChange={e => setVolumeNum(e.target.value)}
                      className={styles.measure_input}
                    />
                  </div>
                </div>

                <div className={styles.input_container}>
                  <span>Each {smallestMeasure ? smallestMeasure.toLowerCase() : "<measure>"}  is (mass)</span>
                  <div className={styles.input_1stFromRight}>
                    <span>Measure</span>
                    <select
                      value={massMeasure}
                      onChange={e => {
                        setMassMeasure(e.target.value);
                      }}
                      className={styles.measure_dropdown}
                    >
                      {massOptions()}
                    </select>
                    <div className={styles.dropdownArrow}/>
                  </div>
                  <div className={styles.input_2ndFromRight}>
                    <span>Num</span>
                    <input 
                      value={massNum}
                      onChange={e => setMassNum(e.target.value)}
                      className={styles.measure_input}
                    />
                  </div>
                </div>

                <div className={styles.input_container}>
                  <span>Each {smallestMeasure ? smallestMeasure.toLowerCase() : "<measure>"}  is (length)</span>
                  <div className={styles.input_1stFromRight}>
                    <span>Measure</span>
                    <select
                      value={lengthMeasure}
                      onChange={e => {
                        setLengthMeasure(e.target.value);
                      }}
                      className={styles.measure_dropdown}
                    >
                      {lengthOptions()}
                    </select>
                    <div className={styles.dropdownArrow}/>
                  </div>
                  <div className={styles.input_2ndFromRight}>
                    <span>Num</span>
                    <input 
                      value={lengthNum}
                      onChange={e => setLengthNum(e.target.value)}
                      className={styles.measure_input}
                    />
                  </div>
                </div>

                <div className={styles.input_container}>
                  <span>Each {smallestMeasure ? smallestMeasure.toLowerCase() : "<measure>"}  contains</span>
                  <div className={styles.input_1stFromRight}>
                    <span>Measure</span>
                    <select
                      value={eachMeasure}
                      onChange={e => {
                        setEachMeasure(e.target.value);
                      }}
                      className={styles.measure_dropdown}
                    >
                      {eachOptions()}
                    </select>
                    <div className={styles.dropdownArrow}/>
                  </div>
                  <div className={styles.input_2ndFromRight}>
                    <span>Num</span>
                    <input 
                      value={eachNum}
                      onChange={e => setEachNum(e.target.value)}
                      className={styles.measure_input}
                    />
                  </div>
                </div>

              {/* <div className={styles.modalContainerHorizontal}>
                <div className={styles.modalFormLabel}>
                    Package Recieved
                </div>
                <div style={{ lineHeight: "40px" }}>
                    {getNewSupplyDesc()}
                </div>
                <div></div>
              </div> */}

            </div>
          {/* </Modal.Body> */}
          </div>

            {/* <Modal.Footer
              style={{
                border: "none",
                justifyContent: "center",
                flexDirection: "column",
              }}
            > */}
            <div
              style={{
                // border: "1px solid teal",
                display: 'flex',
                justifyContent: "center",
                flexDirection: "column",
                margin: '20px 0'
              }}
            >
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.redButton}
                  onClick={() => postNewSupply()}
                  disabled={disableReceiveSupply()}
                >
                  Add Item
                </button>
              </div>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.whiteButton}
                  onClick={() => props.toggleAddSupply()}
                >
                  Cancel
                </button>
              </div>
            {/* </Modal.Footer> */}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            // border: '1px dashed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span>LOADING...</span>
        </div>
      )}

      {/* <div
        style={{
          height: "100%",
          width: "100%",
          zIndex: "101",
          left: "0",
          top: "0",
          position: "fixed",
          display: "grid",
          backgroundColor: "rgba(255, 255, 255, 0.8)"
        }}
      > */}
        {/* {showAddBrand && <AddBrand/>}
        {showAddItem && <AddItem/>}
        {showAddItemTags && <AddTags/>}
      </div> */}

    </div>
  );
}

export default AddSupply;