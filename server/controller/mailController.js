var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// creating new user
router.post('/sendMail', function (req, res) {

  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any ex :: req.body.itemname
  console.log("From Email: " + req.body.from);
  console.log("To Email: " + req.body.to);
  console.log("Subject Email: " + req.body.subject);
  console.log("Text Email: " + req.body.text);
  
  var mailOptions = {
      from: req.body.from,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text
    };
  transporter.sendMail(mailOptions, function (err, info) {
      if (err)
          return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(info);
      // if (error) {
      //     //alert("Email error: " + error);
      //     //console.log("Email error: " + error);
      //     res.status(500).send("error");
      // } else {
      //     //alert("Email success: " + error);
      //     res.status(200).send("success");
      //     //console.log('Email sent: ' + info.response);
      // }
  }, function (err, user) {
      if (err)
          return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(user);
  });
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'avinash.bhandari24@gmail.com',
    pass: 'avi@aasaanhai'
  }
});



module.exports = router;