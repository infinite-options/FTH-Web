import React, { useEffect, useState } from 'react';
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import styles from "../Donations/donations.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import AddSupply from '../Modals/AddSupply';
import AddBrand from '../Modals/AddBrand';
import AddItem from '../Modals/AddItem';
import AddTags from '../Modals/AddTags';

const AddDonation = (props) => {

  const [businessUID, setBusinessUID] = useState(null);

	// fetched data
	const [brands, setBrands] = useState(null);
  const [items, setItems] = useState(null);
  const [supply, setSupply] = useState(null);
  const [donationTypes, setDonationTypes] = useState(null);

  // set once all data fetched
  const [dataFetched, setDataFetched] = useState(false);

  // maps uids to values
  const [itemMap, setItemMap] = useState(null);
  const [brandMap, setBrandMap] = useState(null);
  const [packUpcMap, setPackUpcMap] = useState(null);
  const [packReceivedMap, setPackReceivedMap] = useState(null);

	// user input data
	const [packageUPC, setPackageUPC] = useState(null);
	const [brandName, setBrandName] = useState(null);
	const [itemName, setItemName] = useState(null);
	const [packageReceived, setPackageReceived] = useState(null);
	const [photoURL, setPhotoURL] = useState(null);
	const [donationType, setDonationType] = useState(null);
	const [qtyReceived, setQtyReceived] = useState(null);
	const [receiveDate, setReceiveDate] = useState(null);
	const [availableDate, setAvailableDate] = useState(null);
	const [expDate, setExpDate] = useState(null);

  const [showAddSupply, setShowAddSupply] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddItemTags, setShowAddItemTags] = useState(false);

  // fetch all data on initial page load
	useEffect(() => {
    setBusinessUID(localStorage.getItem('role'));
		axios
			.get(`${API_URL}get_brands_list`)
			.then((response) => {
				console.log("brands res: ", response);
        let fetched_brands = response.data.result;
        const brand_map = new Map();
        fetched_brands.forEach((fetched_brand) => {
          brand_map.set(fetched_brand.brand_name, fetched_brand);
        });
        setBrandMap(brand_map);
				setBrands(fetched_brands);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response);
				}
				console.log(err);
			});
    axios
			.get(`${API_URL}get_items_list`)
			.then((response) => {
				console.log("items res: ", response);
        let fetched_items = response.data.result;
        const item_map = new Map();
        fetched_items.forEach((fetched_item) => {
          item_map.set(fetched_item.item_name, fetched_item);
        });
        setItemMap(item_map);
				setItems(fetched_items);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response);
				}
				console.log(err);
			});
    axios
			.get(`${API_URL}supply_items`)
			.then((response) => {
				console.log("supply res: ", response);
        let fetched_supply = response.data.result;
        const pr_map = new Map();
        const upc_map = new Map();
        fetched_supply.forEach((fetched_supply) => {
          pr_map.set(fetched_supply.sup_desc, fetched_supply);
          upc_map.set(fetched_supply.package_upc, fetched_supply);
        });
        setPackReceivedMap(pr_map);
        setPackUpcMap(upc_map);
				setSupply(fetched_supply);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response);
				}
				console.log(err);
			});
    axios
			.get(`${API_URL}get_receive_list`)
			.then((response) => {
				console.log("receive res: ", response);
        var uniqueTypes = [];
        response.data.result.forEach((rec) => {
          // console.log("rec: ", rec);
          let check = uniqueTypes.some(e => {
            if(typeof(e) === 'undefined') {
              return false;
            } else {
              return e.donation_type !== rec.donation_type;
            }
          });
          if(check === false) {
            uniqueTypes.push(rec.donation_type);
          }
        });
        console.log("uniqueTypes: ", uniqueTypes);
        setDonationTypes(uniqueTypes);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response);
				}
				console.log(err);
			});
	}, []);

  // once all data loaded, display modal (otherwise, display "LOADING...")
  useEffect(() => {
    if(
      brands !== null && 
      items !== null && 
      supply !== null && 
      donationTypes !== null
    ) { setDataFetched(true) }
  }, [brands, items, supply, donationTypes]);

  // brand name dropdown
  const brandOptions = () => {
    var brandOptions = [<option disabled selected value> -- select an option -- </option>];
    brands.forEach((brand, index) => {
      brandOptions.push(
        <option key={index} value={brand.brand_name}>
          {brand.brand_name}
        </option>
      );
    });
    return brandOptions;
  }

  // item dropdown
  const itemOptions = () => {
    var itemOptions = [<option disabled selected value> -- select an option -- </option>];
    items.forEach((item, index) => {
      itemOptions.push(
        <option key={index} value={item.item_name}>
          {item.item_name}
        </option>
      );
    });
    return itemOptions;
  }

  // donation type dropdown
  const donationOptions = () => {
    var donationOptions = [<option disabled selected value> -- select an option -- </option>];
    donationTypes.forEach((don, index) => {
      console.log("don: ", don);
      donationOptions.push(
        <option key={index} value={don}>
          {don}
        </option>
      );
    });
    return donationOptions;
  }

  const handleChangeUPC = (input) => {
    console.log("in handleChangeUPC");
    setPackageUPC(input);
    console.log("(hc_upc) input: ", input)
    let upc_found = packUpcMap.get(input);
    console.log("(hc_upc) upc found? ", upc_found);
    if(upc_found && input !== '') {
      setBrandName(upc_found.brand_name);
      setItemName(upc_found.item_name);
      setPackageReceived(upc_found.sup_desc);
      setPhotoURL(upc_found.item_photo);
    }
    // return '';
  }

  // package received dropdown
  const filterSupplies = () => {
    console.log("(FS) brand: ", brandName);
    console.log("(FS) item: ", itemName);
    var filteredSupplies = [<option disabled selected value> -- select an option -- </option>];
    supply.forEach((sup, index) => {
      if(
        brandName === sup.brand_name && 
        itemName === sup.item_name &&
        brandName !== null && itemName !== null
      ) {
        console.log("(FS) sup: ", sup);
        filteredSupplies.push(
          <option key={index} value={sup.sup_desc}>
            {sup.sup_desc}
          </option>
        );
      }
    });
    return filteredSupplies;
  }

  const disableReceiveItem = () => {
    if(
      packageUPC === null || packageUPC === '' ||
      brandName === null || brandName === '' ||
      itemName === null || itemName === '' ||
      packageReceived === null || packageReceived === '' ||
      photoURL === null || photoURL === '' ||
      donationType === null || donationType === '' ||
      qtyReceived === null || qtyReceived === '' ||
      receiveDate === null || receiveDate === '' ||
      availableDate === null || availableDate === '' ||
      expDate === null || expDate === ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  // handles receive item button click
  const receiveItem = () => {

    let mappedItem = itemMap.get(itemName);
    let mappedBrand = brandMap.get(brandName);
    let mappedSupply = packReceivedMap.get(packageReceived);
    console.log("(RI) mappedItem: ", mappedItem);
    console.log("(RI) mappedBrand: ", mappedBrand);
    console.log("(RI) mappedSupply: ", mappedSupply);
    console.log("(RI) business uid: ", businessUID);

    let receive_data = {
      receive_supply_uid: mappedSupply.supply_uid,
      receive_business_uid: businessUID, 
      donation_type: donationType,
      qty_received: qtyReceived,
      receive_date: receiveDate,
      available_date: availableDate, 
      exp_date: expDate
    };

    console.log("receive_data: ", receive_data);

    axios
      .post(API_URL + 'add_donation', receive_data)
      .then((res) => {
        console.log("(getItems) res: ", res);
        
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }

  const toggleAddBrand = () => {
    // if (state.showAddBrand) {
    //   getSupplyModalData();
      // dispatch({ type: "EDIT_NEW_BRAND", payload: initialState.newBrand });
    // } else {
    // }

    console.log("in toggle add brand");
    // dispatch({ type: "TOGGLE_ADD_BRAND" });
    setShowAddBrand(!showAddBrand);
    // dispatch({ type: "TOGGLE_ADD_SUPPLY" });
    // setShowAddSupply(!showAddSupply);
  };

  const toggleAddItem = () => {
    // if (showAddItem) {
    //   getSupplyModalData();
    //   itemTagList.forEach((itemTag) => {
    //     itemTag.active = 0;
    //   });
    //   // dispatch({ type: "EDIT_NEW_ITEM", payload: initialState.newItem });
    // } else {
    //   getItemTypes();
    // }

    // dispatch({ type: "TOGGLE_ADD_ITEM" });
    setShowAddItem(!showAddItem);
    // dispatch({ type: "TOGGLE_ADD_SUPPLY" });
    setShowAddSupply(!showAddSupply);
  };

  const toggleAddItemTags = () => {
    // if (!showAddItemTags) {
    //   getItemTags();
    // }
    // dispatch({ type: "TOGGLE_ADD_ITEM_TAGS" });
    setShowAddItemTags(!showAddItemTags);
  };

  const toggleAddSupply = () => {
    // if (!state.showAddSupply) {
    //   getSupplyModalData();
    // } else {
    //   getSupplyItems();
    //   dispatch({ type: "EDIT_NEW_SUPPLY", payload: initialState.newSupply });
    //   state.selectedFile = null;
    // }

    // dispatch({ type: "TOGGLE_ADD_SUPPLY" });
    setShowAddSupply(!showAddSupply);
  };

  // displays modal after all data fetched
	const displayModal = () => {
		return (
			<div
				style={{
					position: "relative",
					// justifySelf: "center",
					// alignSelf: "center",
					// display: "block",
					border: "2px solid #E7404A",
					backgroundColor: "white",
					height: "auto",
					width: "auto",
					zIndex: "102",
					padding: "10px 0px 10px 0px",
					borderRadius: "20px",
					display: 'inline-block'
				}}
			>
				<ModalCloseBtn
					className={styles.closeBtn}
					onClick={() => props.toggleShowAddDonation()}
				/>
				<div
					style={{
						// border: '1px dashed',
						width: 'calc(100% - 60px)',
						margin: '15px 30px'
					}}
				>
					<div
						style={{
							// border: '1px solid red',
							height: '60px'
						}}
					>
						<span
							style={{
								fontWeight: 'bold',
								fontSize: '20px'
							}}
						>
							Receive Table
						</span>
					</div>
					<div
						style={{
							// border: '1px solid green',
							width: '950px',
							display: 'flex' 
						}}
					>
						<div className={styles.ad_body_left}>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Package UPC</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input 
                    className={styles.ad_section_input} 
                    value={packageUPC}
                    // onChange={e => setPackageUPC(e.target.value)}
                    onChange={e => handleChangeUPC(e.target.value)}
                  />
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Brand Name</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<select
                    value={brandName}
                    onChange={event => {
                      setBrandName(event.target.value);
                      setPackageUPC('');
                    }}
										className={styles.ad_section_dropdown}
									>
                    {brandOptions()}
									</select>
									<button 
										className={styles.ad_plus}
                    onClick={toggleAddBrand}
									>
										+
									</button>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Item</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
                  <select
                    value={itemName}
                    onChange={event => {
                      setItemName(event.target.value)
                      setPackageUPC('');
                    }}
										className={styles.ad_section_dropdown}
									>
                    {itemOptions()}
									</select>
									<button 
										className={styles.ad_plus}
                    onClick={toggleAddItem}
									>
										+
									</button>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Package Received</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
                  <select
                    value={packageReceived}
                    onChange={event => {
                      console.log("pr val: ", event.target.value);
                      let found = supply.filter((sup) => {
                        console.log("s1: ", sup);
                        console.log("s2: ", event.target.value);
                        return sup.sup_desc === event.target.value
                      });
                      console.log("found: ", found);
                      console.log("found2: ", found[0].package_upc);
                      setPackageUPC(found[0].package_upc);
                      setPackageReceived(event.target.value)
                      setPhotoURL(found[0].item_photo);
                    }}
										className={styles.ad_section_dropdown}
									>
                    {filterSupplies()}
									</select>
									<button 
										className={styles.ad_plus}
                    onClick={toggleAddSupply}
									>
										+
									</button>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Picture</span>
								</div>
								<div className={styles.ad_section_photo_wrapper}>
									<img
										className={styles.ad_section_image}
										src={photoURL}
									/>
									{/* <input
										type="file"
										name="upload_file"
										onChange={(e) => {
											setPhotoURL(URL.createObjectURL(e.target.files[0]));
										}}
									/> */}
								</div>
							</div>
						</div>
						<div className={styles.ad_body_right}>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Donation Type</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
                  <select
                    value={donationType}
                    onChange={event => setDonationType(event.target.value)}
										className={styles.ad_section_dropdown}
									>
                    {donationOptions()}
									</select>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Qty. Received</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input 
                    className={styles.ad_section_input}
                    value={qtyReceived}
                    onChange={e => setQtyReceived(e.target.value)}
                  />
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Receive Date</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input 
                    className={styles.ad_section_input}
                    value={receiveDate}
                    onChange={e => setReceiveDate(e.target.value)}
                  />
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Available Date</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input 
                    className={styles.ad_section_input}
                    value={availableDate}
                    onChange={e => setAvailableDate(e.target.value)}
                  />
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Exp. Date</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input 
                    className={styles.ad_section_input}
                    value={expDate}
                    onChange={e => setExpDate(e.target.value)}
                  />
								</div>
							</div>
						</div>
					</div>
					<div
						style={{
							// border: '1px solid blue',
							height: '150px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<div
							style={{
								// border: '1px dashed',
								display: 'inline-block',
								height: '130px'
							}}
						>
							<div
								style={{
									height: '50%',
									// border: '1px solid green',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<button
									className={styles.redButton}
									onClick={() => receiveItem()}
                  disabled={disableReceiveItem()}
								>
									Receive Item
								</button>
							</div>
							<div
								style={{
									height: '50%',
									// border: '1px solid green',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<button
									className={styles.whiteButton}
									onClick={() => props.toggleShowAddDonation()}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

  // render component
  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          zIndex: "101",
          left: "0",
          top: "0",
          overflow: "auto",
          position: "fixed",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: "rgba(255, 255, 255, 0.8)"
        }}
      >
        {dataFetched ? displayModal() : "LOADING..."}
      </div>
      {showAddSupply && (
        <AddSupply
          toggleAddSupply={toggleAddSupply}
          toggleAddBrand={toggleAddBrand}
          toggleAddItem={toggleAddItem}
          toggleAddItemTags={toggleAddItemTags}
          showAddSupply={showAddSupply}
        />
      )}
      {showAddBrand && (
        <AddBrand
          toggleAddBrand={toggleAddBrand}
          showAddBrand={showAddBrand}
        />
      )}
      {showAddItem && (
        <AddItem
          toggleAddItem={toggleAddItem}
          toggleAddItemTags={toggleAddItemTags}
          showAddItemTags={showAddItemTags}
          showAddItem={showAddItem}
        />
      )}
    </>
  );
};

export default AddDonation;
