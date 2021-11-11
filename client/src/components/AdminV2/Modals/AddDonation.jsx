import React, { useEffect, useState } from 'react';
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import styles from "../Donations/donations.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import AddSupply from '../Modals/AddSupply';
import AddBrand from '../Modals/AddBrand';
import AddItem from '../Modals/AddItem';
import AddTags from '../Modals/AddTags';
import AddDonor from '../Modals/AddDonor';
import AddFoodBank from '../Modals/AddFoodBank';

const RECEIVE_WAITING = 0;
const RECEIVE_SUCCESS = -1;
const RECEIVE_FAILURE = 1;

const AddDonation = (props) => {

  const [businessUID, setBusinessUID] = useState(null);

	// fetched data
	const [brands, setBrands] = useState(null);
  const [items, setItems] = useState(null);
  const [supply, setSupply] = useState(null);
  const [donationTypes, setDonationTypes] = useState(null);
  const [donors, setDonors] = useState(null);
  const [foodBanks, setFoodBanks] = useState(null);

  // set once all data fetched
  const [dataFetched, setDataFetched] = useState(false);

  // maps uids to values
  const [itemMap, setItemMap] = useState(null);
  const [brandMap, setBrandMap] = useState(null);
  const [packUpcMap, setPackUpcMap] = useState(null);
  const [packReceivedMap, setPackReceivedMap] = useState(null);

  // receive input data
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
  const [donor, setDonor] = useState(null);
  const [foodBank, setFoodBank] = useState(null);

  const [showAddSupply, setShowAddSupply] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddItemTags, setShowAddItemTags] = useState(false);
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [showAddFoodBank, setShowAddFoodBank] = useState(false);

  const [receiveStatus, setReceiveStatus] = useState(null);

  const getBrands = () => {
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
  }

  const getItems = () => {
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
  }

  const getSupply = () => {
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
  }

  const getDonations = () => {
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
  }

  const getDonors = () => {
    axios
			.get(`${API_URL}customers?role=DONOR`)
			.then((response) => {
				console.log("donors res: ", response);
        setDonors(response.data.result);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response);
				}
				console.log(err);
			});
  }

  const getFoodBanks = () => {
    axios
			.get(`${API_URL}businesses`)
			.then((response) => {
				console.log("food banks res: ", response);
        setFoodBanks(response.data.result.result);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response);
				}
				console.log(err);
			});
  }

  // fetch all data on initial page load
	useEffect(() => {
    setBusinessUID(localStorage.getItem('role'));
		getBrands();
    getItems();
    getSupply();
    getDonations();
    getDonors();
    getFoodBanks();
	}, []);

  // once all data loaded, display modal (otherwise, display "LOADING...")
  useEffect(() => {
    if(
      brands !== null && 
      items !== null && 
      supply !== null && 
      donationTypes !== null &&
      donors !== null &&
      foodBanks !== null
    ) { 
      console.log("data fetched");
      setDataFetched(true);
    } else {
      console.log("data not fetched");
    }
  }, [
    brands, items, 
    supply, donationTypes, 
    donors, foodBanks
  ]);

  // refresh data when added to database
  // useEffect(() => {
  //   if(refreshing === false) {

  //   }
  // }, [refreshing]);

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

  // donor dropdown
  const donorOptions = () => {
    var donorOptions = [<option disabled selected value> -- select an option -- </option>];
    donors.forEach((d, index) => {
      donorOptions.push(
        <option key={index} value={d.customer_uid}>
          {
            d.customer_first_name + " " + 
            d.customer_last_name + " (" +
            d.customer_uid.substring(4) + ")"
          }
        </option>
      );
    });
    return donorOptions;
  }

  // food bank dropdown
  const foodBankOptions = () => {
    var foodBankOptions = [<option disabled selected value> -- select an option -- </option>];
    console.log("foodBanks: ", foodBanks);
    foodBanks.forEach((fb, index) => {
      foodBankOptions.push(
        <option key={index} value={fb.business_uid}>
          {fb.business_name + " (" + fb.business_uid.substring(4) + ")"}
        </option>
      );
    });
    return foodBankOptions;
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
      expDate === null || expDate === '' ||
      receiveStatus !== null
    ) {
      return true;
    } else {
      return false;
    }
  }

  // handles receive item button click
  const receiveItem = () => {
    console.log("(RI) donor: ", donor);

    setReceiveStatus(RECEIVE_WAITING);
    // setReceiveStatus(RECEIVE_SUCCESS);
    // setReceiveStatus(RECEIVE_FAILURE);

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
      exp_date: expDate,
      donor_uid: donor
    };

    console.log("receive_data: ", receive_data);

    axios
      .post(API_URL + 'add_donation', receive_data)
      .then((res) => {
        console.log("(getItems) res: ", res);
        setReceiveStatus(RECEIVE_SUCCESS);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
        setReceiveStatus(RECEIVE_FAILURE);
      });
  }

  const toggleAddBrand = (refresh_brands) => {
    setShowAddBrand(!showAddBrand);
    if(refresh_brands === true){
      setDataFetched(false);
      getBrands();
    }
    setShowAddSupply(!showAddSupply);
  };

  const toggleAddItem = (refresh_items) => {
    setShowAddItem(!showAddItem);
    if(refresh_items === true){
      setDataFetched(false);
      getItems();
    }
    setShowAddSupply(!showAddSupply);
  };

  const toggleAddItemTags = () => {
    setShowAddItemTags(!showAddItemTags);
  };

  const toggleAddSupply = (refresh_supply) => {
    if(refresh_supply === true){
      setDataFetched(false);
      getSupply();
    }
    setShowAddSupply(!showAddSupply);
  };

  const toggleAddDonor = (refresh_donors) => {
    console.log("in toggleAddDonor");
    if(refresh_donors === true){
      console.log("in refresh_donors");
      setDataFetched(false);
      getDonors();
    }
    setShowAddDonor(!showAddDonor);
  };

  const toggleAddFoodBank = () => {
    setShowAddFoodBank(!showAddFoodBank);
  };

  const displayReceiveStatus = () => {
    console.log("in displayReceiveStatus");
    if(receiveStatus !== null) {
      return (
        <div
          style={{
            // border: "2px solid #E7404A",
            // border: '1px dashed',
            // padding: '20px',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: '0',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '110',
            backgroundColor: 'rgb(255,255,255,0.5)'
          }}
        >
          {receiveStatus === RECEIVE_WAITING &&
            <div
              style={{
                border: "2px solid #E7404A",
                padding: '20px',
                zIndex: '111',
                backgroundColor: 'white',
                borderRadius: '15px',
                textAlign: 'center'
              }}
            >
              <h3><strong>Receiving Donation</strong></h3><br/>
              <span>Please wait...</span>
            </div>
          }
          {receiveStatus === RECEIVE_SUCCESS &&
            <div
              style={{
                border: "2px solid #E7404A",
                padding: '20px',
                zIndex: '111',
                backgroundColor: 'white',
                borderRadius: '15px',
                textAlign: 'center'
              }}
            >
              <h3><strong>Success</strong></h3>
              <span style={{display: 'block', margin: '20px'}}>Donation received.</span>
              <button 
                className={styles.receiveStatusBtn}
                onClick={() => setReceiveStatus(null)}
              >
                OK
              </button>
            </div>
          }
          {receiveStatus === RECEIVE_FAILURE &&
            <div
              style={{
                border: "2px solid #E7404A",
                padding: '20px',
                zIndex: '111',
                backgroundColor: 'white',
                borderRadius: '15px',
                textAlign: 'center'
              }}
            >
              <h3><strong>Error</strong></h3>
              <span style={{display: 'block', margin: '20px'}}>Failed to add donation.</span>
              <button 
                className={styles.receiveStatusBtn}
                onClick={() => setReceiveStatus(null)}
              >
                OK
              </button>
            </div>
          }
        </div>
      );
    } else {
      return null;
    }
  }

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
					display: 'inline-block',
          maxHeight: 'calc(100vh - 40px)',
          overflow: 'auto'
				}}
			>

        {displayReceiveStatus()}

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
						<h1
              // className={styles.ad_header}
							style={{
								fontWeight: 'bold',
								fontSize: '20px'
							}}
						>
							{/* Receive Table */}
              Add Donation
						</h1>
					</div>

					<div className={styles.ad_body}>
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
								</div>
							</div>
						</div>
						<div className={styles.ad_body_right}>
              <div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Donor</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<select
                    value={donor}
                    onChange={e => {
                      setDonor(e.target.value);
                    }}
										className={styles.ad_section_dropdown}
									>
                    {donorOptions()}
									</select>
									<button 
										className={styles.ad_plus}
                    onClick={toggleAddDonor}
									>
										+
									</button>
								</div>
							</div>
              <div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Food Bank</span>
								</div>
								{/* <div className={styles.ad_section_input_wrapper}>
									<select
                    value={foodBank}
                    onChange={e => {
                      setFoodBank(e.target.value);
                    }}
										className={styles.ad_section_dropdown}
									>
                    {foodBankOptions()}
									</select>
									<button 
										className={styles.ad_plus}
                    onClick={toggleAddFoodBank}
									>
										+
									</button>
								</div> */}
                <div className={styles.ad_section_input_wrapper}>
                  {console.log("Business UID: ", businessUID)}
									{businessUID !== 'ADMIN' && businessUID !== 'CUSTOMER' && businessUID !== 'DONOR' ? (
                    <span>{businessUID}</span>
                  ) : (
                    <select
                      value={foodBank}
                      onChange={e => {
                        setFoodBank(e.target.value);
                      }}
                      className={styles.ad_section_dropdown}
                    >
                      {foodBankOptions()}
                    </select>
                  )}
								</div>
							</div>
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
                    placeholder={"YYYY-MM-DD"}
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
                    placeholder={"YYYY-MM-DD"}
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
                    placeholder={"YYYY-MM-DD"}
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
      {showAddDonor && (
        <AddDonor
          toggleAddDonor={toggleAddDonor}
          showAddDonor={showAddDonor}
        />
      )}
      {showAddFoodBank && (
        <AddFoodBank
          toggleAddFoodBank={toggleAddFoodBank}
          showAddFoodBank={showAddFoodBank}
        />
      )}
    </>
  );
};

export default AddDonation;
