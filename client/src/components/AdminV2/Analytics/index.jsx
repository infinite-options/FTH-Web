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

function Analytics({ history, ...props }) {
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
      const role = localStorage.getItem('role');
      console.log("role: ", role);
      if (role !== "admin" && role !== "customer") {
        dispatch({ type: "MOUNT" });
      } else {
        history.push("/meal-plan");
      }
      // axios
      //   .get(`${API_URL}Profile/${customer_uid}`)
      //   .then((response) => {
      //     console.log("profile res: ", response);
      //     const role = response.data.result[0].role.toLowerCase();
      //     console.log("role: ", role);
      //     if (role !== "admin" && role !== "customer") {
      //       console.log("mounting")
      //       // console.log(state.mounted);
      //       dispatch({ type: "MOUNT" });
      //       // console.log("dispatch MOUNT");
      //     } else {
      //       history.push("/meal-plan");
      //     }
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

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      <AdminNavBar currentPage={"google-analytics"} />
      <h1>Analytics Page</h1>
    </div>
  );
}

export default withRouter(Analytics);
