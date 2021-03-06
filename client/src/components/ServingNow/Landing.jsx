import React, { Component } from "react";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Shopping from "../Assets/shopping.png";
import Login from "../Assets/login.svg";
import Register from "../Assets/register.svg";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    backgroundImage: `url(${Shopping})`,
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

export default function Landing() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
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
            height: "auto",
            overflowY: "hidden",
            marginTop: "15%",
            marginLeft: "5%",
          }}
        >
          <Typography
            style={{
              textAlign: "center",
              font: "normal normal bold 35px SF Pro Display",
              letterspacing: "0.49px",
              color: "#000000",
            }}
          >
            Welcome to
            <Typography
              style={{
                textAlign: "center",
                font: "normal normal bold 35px SF Pro Display",
                letterspacing: "0.49px",
                color: "#E7404A",
              }}
            >
              Serving Now
              <Typography
                style={{
                  textAlign: "center",
                  font: "normal normal bold 20px SF Pro Display",
                  letterspacing: "0.32px",
                  color: "#000000",
                }}
              >
                To continue
              </Typography>
            </Typography>
          </Typography>
          <img
            src={Login}
            onClick={() => history.push("/loginfth")}
            className={classes.btn}
          />
          <img
            src={Register}
            onClick={() => history.push("/register")}
            className={classes.btn}
          />
        </Grid>
      </Grid>
    </div>
  );
}
