import React, { Component } from "react";
import logo from "./AdvantestLogo.png";
import "./App.css";
import AuthService from "./components/AuthService";
import withAuth from "./components/withAuth";


class App extends Component {
  constructor() {
    super();
    
    this.Auth = new AuthService();
  }

  handleLogout(e) {
    e.preventDefault();

    this.Auth.logout(this.props.user.username)
      .then((res) => {
        this.props.history.replace("/login");
      })
      .catch((err) => {
        alert(err);
      });
  }


  render() {

    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome Voice2021</h2>
          <div className="container"> 
            <iframe className="responsive-iframe" src={this.props.url} />
          </div>
            
          <button
            type="button"
            className="form-submit"
            onClick={this.handleLogout.bind(this)}
          >
            Logout
          </button>
        </div>
        <p className="App-intro">
          
        </p>
      </div>
    );
  }
}

export default withAuth(App);
