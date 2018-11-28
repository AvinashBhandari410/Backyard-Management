var express = require('express');
var app = express();
var db = require('./db');

// user controller
var UserController = require('./controller/userController');
// ride controller
var ItemController = require('./controller/itemController');

var MailController = require('./controller/mailController');

var publicDir = require('path').join(__dirname,'/uploads');
app.use(express.static(publicDir));

//Solve the cross site scripting issue
//https://stackoverflow.com/questions/32500073/request-header-field-access-control-allow-headers-is-not-allowed-by-itself-in-pr

//app.use(express.methodOveride())
// https://enable-cors.org/server_expressjs.html
app.use(function (req, res, next) {
  // res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.header("Access-Control-Allow-Methods", "GET");
  // res.header("Access-Control-Allow-Methods", "POST");
  // res.header("Access-Control-Allow-Methods", "PUT");
  // res.header("Access-Control-Allow-Methods", "DELETE");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// user 
app.use('/user', UserController);

// ride
app.use('/item', ItemController);

//Send Mail
app.use('/mail', MailController);



module.exports = app;