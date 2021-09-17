import React, { Component } from "react";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import bg from "../Assets/bg.png";
import Login from "../Assets/login.svg";
import Register from "../Assets/register.svg";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    backgroundImage: `url(${bg})`,
    backgroundPosition: "center",
    backgroundSize: "70%",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  header: {
    width: "100%",
    height: "80px",
    backgroundColor: "#e7404a",
  },
  btn: {
    cursor: "pointer",
    width: "50%",
    marginLeft: "25%",
  },
}));

export default function ResetPassword() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root} id="passwordreset">
      <Grid container>
        <Grid item xs={12}>
          <Box className={classes.header}>
            <Typography
              style={{
                textAlign: "left",
                font: "normal normal bold 22px/26px SF Pro Display",
                letterSpacing: "0.24px",
                color: "#FFFFFF",
                opacity: 1,
                marginLeft: "10rem",
                paddingTop: "25px",
              }}
            >
              Serving Now
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid
          item
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            opacity: 1,
            backgroundColor: "#ffffff",
            borderRadius: "68px",
            border: "2px solid #E7404A",
            marginTop: "5%",
            marginLeft: "15%",
          }}
        >
          <Typography
            style={{
              textAlign: "center",
              font: "normal normal bold 20px SF Pro Display",
              letterspacing: "0.32px",
              color: "#000000",
            }}
          >
            Forgot your password?
          </Typography>
          <Typography
            style={{
              textAlign: "center",
              font: "normal normal 300 18px SF Pro Display",
              letterspacing: "0.2px",
              color: "#000000",
            }}
          >
            Enter the phone number associated with your account.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
