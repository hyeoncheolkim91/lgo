import React,{Component} from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import logo from "../AdvantestLogo.png";
import AuthService from "./AuthService";
import withAuth from "./withAuth";

const useStyles = withStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 2,
    },
    appbar:{
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
const Auth = new AuthService();
class Bar extends Component {
  constructor() {
    super();
    
  }

  handleLogout(e) {
    this.Auth.logout(this.props.user.username)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        alert(err);
      });
  }


  render() {

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
                fontWeight:'bold',
                color: "#8E0041",
                fontSize: "18px",
                marginRight:'10px'
              }}
              variant="text"
            >
              Logout
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
    );
  }
}

export default withAuth(Bar);