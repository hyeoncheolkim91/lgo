import React, { Component } from "react";
import "./Login.css";
import AuthService from "./AuthService";
import logo from "../AdvantestLogo.png";
import Alert from "./alert"
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert:{
      open: false,
      type: null,
      message: null

    }
  };
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.Auth = new AuthService();
  }
  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace("/");
  }
  render() {
    return (
      <div>
      <Alert message={this.state.alert.message} open = {this.state.alert.open} type={this.state.alert.type} handleClose={this.handleClose}></Alert>
        <div className="center">
          <div className="card">
            <img src={logo} alt="logo" />
            <form onSubmit={this.handleFormSubmit}>
              <input
                className="form-item"
                placeholder="Username"
                name="username"
                type="text"
                onChange={this.handleChange}
              />
              <input
                className="form-item"
                placeholder="Password"
                name="password"
                type="password"
                onChange={this.handleChange}
              />
              <input className="form-submit" value="Log In" type="submit" />
            </form>
          </div>
        </div>
        <div>
          <footer align="center" className="footer">Copyright 2021 ADVANTEST CORPORATION</footer>
        </div>
      </div>
    );
  }
handleClose(event, reason){
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      alert:{ open: false}
  });
 
}
  handleFormSubmit(e) {
    e.preventDefault();
    this.Auth.login(this.state.username, this.state.password)
      .then((res) => {
        console.log(this.state.username, this.state.password)
        this.props.history.replace("/");
      })
      .catch((err) => {
        this.setState({
          alert:{ open: true, message:err.message, type:"error"}
      });
  })
}

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
}

export default Login;
