require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const AWS = require("aws-sdk");
const userData = require('./mockingDB.json')

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
    res.json({
      sucess: true,
      err: null,
      url: MockDB.redirect_base_url,
      token,
    });

    AWS.config.update({ region: MockDB.region, accessKeyId: user.accessKeyId, secretAccessKey: user.secretAccessKey });
    const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });
    const params = {
      InstanceIds: [],
    };
    user.ec2.forEach((x)=> params.InstanceIds.push(x));

    ec2.startInstances(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data); // successful response
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
  }
});

app.post("/api/logout", (req, res) => {
  const { username } = req.body;

  var user = MockDB.users.find((u) => username == u.username);
  if (user) {
    AWS.config.update({ region: MockDB.region, accessKeyId: user.accessKeyId, secretAccessKey: user.secretAccessKey });
    const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });
    const params = {
      InstanceIds: [],
    };
    user.ec2.forEach((x)=> params.InstanceIds.push(x));
    ec2.stopInstances(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    });
    res.json({
      sucess: true,
    });
  } else {
    res.status(401).json({
      err: "Username or password is incorrect",
    });
  }
});

app.get("/", jwtMW /* Using the express jwt MW here */, (req, res) => {
  res.send("You are authenticated");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Setup default port
const PORT = process.env.PORT || 80;

// Start express app
app.listen(PORT, function () {
  console.log("hi");
  console.log(`Server is running on: ${PORT}`);
});
