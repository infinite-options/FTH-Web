import React, { useEffect, useState } from 'react';
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import styles from "./donations.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";

const AddDonation = (props) => {

	// fetched data
	const [brands, setBrands] = useState(null);

	// user input data
	const [packageUPC, setPackageUPC] = useState(null);
	const [brandName, setBrandName] = useState(null);
	const [item, setItem] = useState(null);
	const [packageReceived, setPackageReceived] = useState(null);
	const [photoURL, setPhotoURL] = useState(null);
	const [donationType, setDonationType] = useState(null);
	const [qtyReceived, setQtyReceived] = useState(null);
	const [receiveDate, setReceiveDate] = useState(null);
	const [availableDate, setAvailableDate] = useState(null);
	const [expDate, setExpDate] = useState(null);

	useEffect(() => {
		axios
			.get(`${API_URL}get_brands_list`)
			.then((response) => {
				console.log("brands res: ", response);
				setBrands(response.data.result);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response);
				}
				console.log(err);
			});
	}, []);

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
					// border: '1px solid green'
				}}
			>
				<ModalCloseBtn
					// style={{ 
						// position: 'absolute',
						// right: '10px',
						// top: '10px',
						// cursor: 'pointer'
					// }}
					className={styles.closeBtn}
					onClick={() => props.toggleShowAddDonation()}
				>

				</ModalCloseBtn>
				<div
					style={{
						// border: '1px dashed',
						width: 'calc(100% - 60px)',
						margin: '15px 30px',
						// height: 'calc(100% - 40px)',
					}}
				>
					<div
						style={{
							// border: '1px solid red',
							// width: '800px',
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
							// minheight: '340px',
							display: 'flex' 
						}}
					>
						<div className={styles.ad_body_left}>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Package UPC</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input className={styles.ad_section_input}/>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Brand Name</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<select 
										name="cars" 
										id="cars" 
											// value={state.itemTypeFilter}
											// onChange={(event) =>
											// 	dispatch({
											// 		type: "FILTER_BY_FOOD_TYPE",
											// 		payload: event.target.value,
											// 	})
											// }
										className={styles.ad_section_dropdown}
									>
										<option value="volvo">Volvo</option>
										<option value="saab">Saab</option>
										<option value="mercedes">Mercedes</option>
										<option value="audi">Audi</option>
									</select>
									<button 
										className={styles.ad_plus}
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
										name="cars" 
										id="cars" 
										className={styles.ad_section_dropdown}
									>
										<option value="volvo">Volvo</option>
										<option value="saab">Saab</option>
										<option value="mercedes">Mercedes</option>
										<option value="audi">Audi</option>
									</select>
									<button 
										className={styles.ad_plus}
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
										name="cars" 
										id="cars" 
										className={styles.ad_section_dropdown}
									>
										<option value="volvo">Volvo awd awd awd awd awda wd awd awd awd awd</option>
										<option value="saab">Saab</option>
										<option value="mercedes">Mercedes</option>
										<option value="audi">Audi</option>
									</select>
									<button 
										className={styles.ad_plus}
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
									<input
										type="file"
										name="upload_file"
										onChange={(e) => {
											setPhotoURL(URL.createObjectURL(e.target.files[0]));
										}}
									/>
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
										name="cars" 
										id="cars" 
										className={styles.ad_section_dropdown}
									>
										<option value="volvo">Volvo</option>
										<option value="saab">Saab</option>
										<option value="mercedes">Mercedes</option>
										<option value="audi">Audi</option>
									</select>
									{/* <button 
										className={styles.ad_plus}
									>
										+
									</button> */}
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Qty. Received</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input className={styles.ad_section_input}></input>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Receive Date</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input className={styles.ad_section_input}></input>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Available Date</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input className={styles.ad_section_input}></input>
								</div>
							</div>
							<div className={styles.ad_section_container}>
								<div className={styles.ad_section_label_wrapper}>
									<span className={styles.ad_section_label}>Exp. Date</span>
								</div>
								<div className={styles.ad_section_input_wrapper}>
									<input className={styles.ad_section_input}></input>
								</div>
							</div>
						</div>
					</div>
					<div
						style={{
							// border: '1px solid blue',
							// width: '100px',
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
								height: '130px',
								// height: '100%'
							}}
						>
							<div
								style={{
									height: '50%',
									// flexGrow: '1',
									// border: '1px solid green',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<button
									className={styles.redButton}
									// style={{
									// 	width: '220px',
									// 	padding: '10px',
									// 	margin: '10px',
									// 	backgroundColor: '#E7404A',
									// 	color: 'white',
									// 	border: '1px solid',
									// 	borderRadius: '20px'
									// }}
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
									// style={{
									// 	width: '220px',
									// 	padding: '10px',
									// 	margin: '10px',
									// 	color: '#E7404A',
									// 	backgroundColor: 'white',
									// 	border: '1px solid',
									// 	borderRadius: '20px'
									// }}
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

  return (
    <div
			style={{
				height: "100%",
				width: "100%",
				zIndex: "101",
				left: "0",
				top: "0",
				overflow: "auto",
				position: "fixed",
				// display: "grid",
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: "rgba(255, 255, 255, 0.8)",
				// border: '1px solid blue'
			}}
		>
			{brands ? (
				displayModal()
			) : (
				"LOADING..."
			)}
		</div>
  );
};

export default AddDonation;
