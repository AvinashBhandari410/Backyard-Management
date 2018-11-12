var express= require('express');
var router=express.Router();
var bodyParser=require('body-parser');
var mongoose = require('mongoose');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());
var user=require('../model/user');

// creating new user
router.post('/register', function(req,res){

    user.create({
        full_name:req.body.full_name, 
        email_address:req.body.email_address,
        password:req.body.password,
        phone_number:req.body.phone_number,
        address:req.body.address,
        user_type: "user",
        is_useractive: false,
        created_date : req.body.created_date
    },
    
function(err,user){
    if(err)
    return res.status(500).send("There was a problem adding the information to the database.");
    res.status(200).send(user);
});
});

//return all the user in the database
router.get('/allUsers',function(req,res){
    user.find({user_type: 'user'},function(err,users){
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
router.post('/login',function(req,res){
console.log('req ',req)
debugger
user.findOne({email_address:req.body.email_address,password:req.body.password},function(err,user){
        if (err) return res.status(500).send("There was a problem finding the user.");
        console.log('user from userController',user);
        res.status(200).send(user);
    });
});

module.exports=router;