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
import styles from "./donations.module.css";

const initialState = {
  mounted: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    default:
      return state;
  }
}

function Donations({ history, ...props }) {
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

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      <AdminNavBar currentPage={"donations"} />
      <Container fluid className={styles.container}>
        <Row
          id="header"
          className={styles.section}
          style={{ height: "123px", padding: "26px 19px" }}
        >
          <Col md="auto">
            <div className={styles.headerText}>Transactions / Donations</div>
          </Col>
          <Col></Col>

          <Col md="auto">
            <button className={styles.headerButtonWhite}>Add Donation +</button>
          </Col>
        </Row>
        <Row id="main" className={styles.section} style={{ marginTop: "20px" }}>
          <Col>
            {/* REMOVE IF NO TABLE FILTERING IS USED */}
            {/* <Row id="mainHeader">
            </Row> */}
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
                            Package UPC
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
                            Item Name
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
                            Donation Type
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
                            Qty Recieved
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
                            Recieved Date
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
                            Available Date
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
                            Exp. Date
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody> {/* TABLE BODY GOES HERFE */}</TableBody>
                  </Table>
                </TableContainer>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(Donations);
