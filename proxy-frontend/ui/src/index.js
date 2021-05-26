import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login'
document.title = "Voice2021 Demo"
ReactDOM.render(
  <Router>
      <div>
          <Route exact path="/" component={App} />
          <Route exact path="/login" component={Login} />
      </div>
  </Router>
  , document.getElementById('root')
);
