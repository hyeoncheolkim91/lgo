require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
// const cors = require("cors");
const path = require("path");
const debug = require("debug");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const AWS = require("aws-sdk");
const userData = require('./mockingDB.json')


var debugError = debug('error')
var debugLog = debug("log")
// Implement middleware
// Setting up bodyParser to use json and set it to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "build")));
// INstantiating the express-jwt middleware. Create .env file to set env variables Like JWT secret, Port.
const jwtMW = exjwt({
  secret: process.env.JWT_SECRET || "advantest",
  algorithms: ["RS256"],
});
// MOCKING DB just for test
// Add user info into mockingDB file.
let MockDB = userData;

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Finds first username and password match in users array (assumes usernames are unique)
  var user = MockDB.users.find(
    (u) => username == u.username && password == u.password
  );
  if (user) {
    // User credentials matched (are valid)
    let token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "advantest",
      { expiresIn: 129600 }
    ); // Sigining the token
    let url = MockDB.redirect_base_url + user.username + "/"
    res.json({
      sucess: true,
      err: null,
      url: url,
      token,
    });

    AWS.config.update({ region: MockDB.region, accessKeyId: MockDB.accessKeyId, secretAccessKey: MockDB.secretAccessKey });
    const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });
    const params = {
      InstanceIds: [],
    };
    user.ec2.forEach((x)=> params.InstanceIds.push(x));

    ec2.startInstances(params, function (err, data) {
      if (err) {
        debugger;
        debugError(err); // an error occurred
      } else {
        debugger;
        debugLog(data); // successful response
      }
    });
  } else {
    // User credentials did not match (are not valid) or no user with this username/password exists
    res.status(401).json({
      sucess: false,
      token: null,
      url: null,
      err: "Username or password is incorrect",
    });
    debugError("Username or password is incorrect");
  }
});

app.post("/api/logout", (req, res) => {
  const { username } = req.body;

  var user = MockDB.users.find((u) => username == u.username);
  if (user) {
    AWS.config.update({ region: MockDB.region, accessKeyId: MockDB.accessKeyId, secretAccessKey: MockDB.secretAccessKey });
    const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });
    const params = {
      InstanceIds: [],
    };
    user.ec2.forEach((x)=> params.InstanceIds.push(x));
    ec2.stopInstances(params, function (err, data) {
      if (err) {
        debugger;
        debugError(err);
      } else {
        debugger;
        debugLog(data);
      }
    });
    res.json({
      sucess: true,
    });
  } else {
    res.status(401).json({
      err: "logout failed",
    });
    debugError("logout failed");
  }
});

app.get("/", jwtMW /* Using the express jwt MW here */, (req, res) => {
  res.send("You are authenticated");
});

app.use((err, req, res, next) => {
  debugger;
  debugError(err.stack);
  res.status(500).send("Something broke!");
});

// Setup default port
const PORT = process.env.PORT || 80;

// Start express app
app.listen(PORT, function () {
  debugger;
  debugLog(`Server is running on: ${PORT}`);
});
