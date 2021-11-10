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
// import styles from "./donors.module.css";
import classes from "./donors.module.css";
import Carousel from "react-multi-carousel";
import { ReactComponent as LeftArrow } from "../../../images/LeftArrowRed.svg";
import { ReactComponent as RightArrow } from "../../../images/RightArrowRed.svg";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Paper,
  ClickAwayListener,
} from "@material-ui/core";

const NO_ITEMS_FOUND = 1;

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

function Donors({ history, ...props }) {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [donors, setDonors] = useState(null);
  const [businessUID, setBusinessUID] = useState(null);
  const [donorUID, setDonorUID] = useState(null);
  const [donorItems, setDonorItems] = useState(null);
  const carouselRef = useRef();

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
        // dispatch({ type: "MOUNT" });
        setBusinessUID(role);
        getDonors();
      } else {
        history.push("/meal-plan");
      }
    } else {
      // Reroute to log in page
      history.push("/");
    }
  }, []);

  const getDonors = () => {
    // http://localhost:2000/api/v2/getItems?receive_business_uid=200-000069&donor_uid=100-000177
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

  // const getDonorItems = (donor_uid) => {
    // axios
		// 	.get(`${API_URL}getItems?donor_uid=${donor_uid}`)
		// 	.then((response) => {
		// 		console.log("getItems res: ", response);
    //     setDonorItems(response.data.result);
		// 	})
		// 	.catch((err) => {
		// 		if (err.response) {
		// 			console.log(err.response);
		// 		}
		// 		console.log(err);
		// 	});
  // }

  useEffect(() => {
    setDonorItems(null);
    if(donorUID !== null) {
      axios
        .get(`${API_URL}getItems?donor_uid=${donorUID}`)
        .then((response) => {
          console.log("getItems res: ", response);
          if(response.status === 200) {
            setDonorItems(response.data.result);
          } else if (response.status === 204) {
            setDonorItems(NO_ITEMS_FOUND);
          }
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    }
  }, [donorUID]);

  return (
    <>
      <AdminNavBar currentPage={"donors"} />

      {console.log("donor items: ", donorItems)}
      {donorItems &&
        <div className={classes.itemsContainer}>
          <div className={classes.itemsModal}>
            <h3 className={classes.donorUID}>Items for donor {donorUID}</h3>
            <ModalCloseBtn 
              className={classes.closeBtn}
              onClick={() => { setDonorUID(null) }}
            />
            <div className={classes.itemsList}>
              {donorItems === NO_ITEMS_FOUND ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // border: '1px dashed',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <span
                    style={{
                      fontSize: '20px'
                    }}
                  >
                    No items donated
                  </span>
                </div>
              ) : (
                <table className={classes.donorTable}>
                  <tr className={classes.donorTableRow}>
                    <th className={classes.itemsTableHeader}>Receive UID</th>
                    <th className={classes.itemsTableHeader}>Supply UID</th>
                    <th className={classes.itemsTableHeader}>Food Bank UID</th>
                    <th className={classes.itemsTableHeader}>Description</th>
                    <th className={classes.itemsTableHeader}>Quantity</th>
                    <th className={classes.itemsTableHeader}>Receive Date</th>
                    <th className={classes.itemsTableHeader}>Available Date</th>
                    <th className={classes.itemsTableHeader}>Expiration Date</th>
                  </tr>
                  {donorItems.map((item, index) => {
                    return (
                      <tr className={classes.tableRow}>
                        <td className={classes.tableCell}>{item.receive_uid}</td>
                        <td className={classes.tableCell}>{item.receive_supply_uid}</td>
                        <td className={classes.tableCell}>{item.receive_business_uid}</td>
                        <td className={classes.tableCell}>{item.sup_desc}</td>
                        <td className={classes.tableCell}>{item.qty_received}</td>
                        <td className={classes.tableCell}>{item.receive_date}</td>
                        <td className={classes.tableCell}>{item.available_date}</td>
                        <td className={classes.tableCell}>{item.exp_date}</td>
                      </tr>
                    )
                  })}
                </table>
              )}
            </div>
          </div>
        </div>
      }

      <div
        style={{
          // border: '1px solid blue',
          height: 'calc(100vh - 100px)'
        }}
      >
        <h3
          className={classes.redBorder}
          style={{
            padding: '10px',
            fontWeight: 'bold'
          }}
        >
          Donors
        </h3>
        <div 
          className={classes.redBorder}
          style={{
            height: 'calc(100vh - 210px)',
            overflow: 'auto'
          }}
        >
          <table className={classes.donorTable}>
            <tr className={classes.donorTableRow}>
              <th className={classes.donorTableHeader}>UID</th>
              <th className={classes.donorTableHeader}>Name</th>
              <th className={classes.donorTableHeader}>Address</th>
              <th className={classes.donorTableHeader}>Phone Number</th>
              <th className={classes.donorTableHeader}>Email</th>
              <th className={classes.donorTableHeader}>Items Donated</th>
            </tr>
            {donors && donors.map((donor, index) => {
              return (
                <tr className={classes.tableRow}>
                  <td className={classes.tableCell}>{donor.customer_uid}</td>
                  <td className={classes.tableCell}>{donor.customer_first_name + " " + donor.customer_last_name}</td>
                  <td className={classes.tableCell}>
                    {donor.customer_address + ", "}<br/>
                    {donor.customer_city + ", " + donor.customer_state + ", " + donor.customer_zip}
                  </td>
                  <td className={classes.tableCell}>{donor.customer_phone_num}</td>
                  <td className={classes.tableCell}>{donor.customer_email}</td>
                  <td className={classes.tableCell}>
                    <button
                      className={classes.itemsLink}
                      onClick={() => setDonorUID(donor.customer_uid)}
                    >
                      See Items
                    </button>
                  </td>
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    </>
  );
}

export default withRouter(Donors);
