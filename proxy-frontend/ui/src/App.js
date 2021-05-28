import React, { Component } from "react";
import "./App.css";
// import AuthService from "./components/AuthService";
import withAuth from "./components/withAuth";
import Appbar from "./components/bar"

class App extends Component {
  constructor() {
    super();
    
    
  }

 


  render() {

    
    return (
      <div className="App">
      <Appbar></Appbar>
        <div className="App-header">
          <div className="brstyle"></div>
          <div className="container"> 
          <iframe className="responsive-iframe" src={this.props.url} />
          </div>          
        </div>
      </div>
    );
  }
}

export default withAuth(App);
