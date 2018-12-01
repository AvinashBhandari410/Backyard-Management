var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var user = require('../model/user');
var nodemailer = require('nodemailer');

// creating new user
router.post('/register', function (req, res) {

    user.create({
        full_name: req.body.full_name,
        email_address: req.body.email_address,
        password: req.body.password,
        phone_number: req.body.phone_number,
        address: req.body.address,
        user_type: "user",
        is_useractive: false,
        created_date: req.body.created_date
    },

        function (err, user) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

//return all the user in the database
router.get('/allUsers', function (req, res) {
    user.find({ user_type: 'user' }, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});


router.put('/updateUserStatus', function (req, res) {
    user.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), req.body, { new: true }, function (err, post) {
        console.log("Current User Which we updated: " + req.body.is_useractive)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(post);
    });
});

//return a user on the basis of email and password
router.post('/login', function (req, res) {
    console.log('req ', req)
    debugger
    user.findOne({ email_address: req.body.email_address, password: req.body.password }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        console.log('user from userController', user);
        res.status(200).send(user);
    });
});


// // upload files
// router.post('/sendMail', function (req, res) {

//     // req.files is array of `photos` files
//     // req.body will contain the text fields, if there were any ex :: req.body.itemname
//     console.log("From Email: " + req.body.from);
//     console.log("To Email: " + req.body.to);
//     console.log("Subject Email: " + req.body.subject);
//     console.log("Text Email: " + req.body.text);
//     var mailOptions = {
//         from: req.body.from,
//         to: req.body.to,
//         subject: req.body.subject,
//         text: req.body.text
//     };

//     console.log('here');
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             //alert("Email error: " + error);
//             console.log("Email error: " + error);
//             res.status(500).send("error");
//         } else {
//             //alert("Email success: " + error);
//             res.status(200).send("success");
//             //console.log('Email sent: ' + info.response);
//         }
//     });
// });


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