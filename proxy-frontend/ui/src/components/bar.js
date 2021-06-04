import React, { Component } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import logo from "../AdvantestLogo.png";
import AuthService from "./AuthService";

import { Redirect } from "react-router-dom";
const useStyles = withStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 2,
    },
    appbar: {
      minHeight: 64
    },
    menuButton: {
      marginRight: theme.spacing(3),
    },
    logo: {
      marginBottom: 2,
      minWidth: "10%",
    },
  })
);

class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      islogout: false
    };
    this.Auth = new AuthService();
  }

  handleLogout(e) {
    e.preventDefault()

    this.Auth.logout(localStorage.getItem("username"))
      .then((res) => {
        this.setState({
          islogout: true
        })

      })
      .catch((err) => {
        this.setState({
          islogout: true
        })
      });
  }


  render() {
    if (this.state.islogout) {
      return <Redirect to="/login" />;
    }
    const classes = useStyles
    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <Toolbar className={classes.appbar} >
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"

            >
              <img src={logo} alt="advantest" className={classes.logo} />

              <Button
                onClick={this.handleLogout.bind(this)}
                style={{
                  borderRadius: 20,
                  fontWeight: 'bold',
                  color: "#8E0041",
                  fontSize: "18px",
                  marginRight: '10px'
                }}
                variant="text"
              >
                Log Out
            </Button>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Bar;