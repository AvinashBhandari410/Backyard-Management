var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var mongoose = require('mongoose');
var item = require('../model/item');
var itemInterest = require('../model/itemInterest');
const multer = require('multer');


//Get reference for select multiple columns from multiple tables joins
//https://scotch.io/@ossaijad/how-to-do-join-operations-and-create-links-between-mongodb-collection


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
        //field name is uploads[] .You can change it to originalname
        //cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage }).array('item_image', 10)

// upload files
router.post('/', function (req, res) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any ex :: req.body.itemname

})

//return all the user in the database starts
router.get('/allItems', function (req, res) {
    item.
        find({}).sort({ 'item_date': -1 }).
        populate({ path: 'userId', select: 'full_name' }).
        exec(function (err, items) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            console.log("Items from Server:" + items)
            res.status(200).send(items);

        });
}); // ends



//return all the user in the database starts
router.get('/allHomeItems', function (req, res) {
    item.aggregate([
        // {
        //     $match: {
        //         iteminterests.userId: 
        //     }
        // },
        {
            $lookup:
            {
                from: "iteminterests",
                localField: "_id",
                foreignField: "itemId",
                as: "item_interested"
            }
        }
    ], function (err, result) {
        if (err) {
            return res.status(500).send("There was a problem adding the information to the database.");
            //console.log(err);
        }
        res.status(200).send(result);
        //console.log(result);
    });
    // item.find({'isItem_Approved': true}).sort({ 'item_date': -1 })
    //     .populate('userId', ['full_name', 'address'])
    //     //.populate('itemId', ['isItemInterested'])
    //     //populate({ path: 'userId', select: 'full_name', select: 'full_name'}).
    //     .exec(function (err, items) {
    //         if (err)
    //             return res.status(500).send("There was a problem adding the information to the database.");
    //         console.log("Items from Server:" + items)
    //         res.status(200).send(items);

    //     });
}); // ends



//return all the user in the database starts
router.get('/allUserItemHistory', function (req, res) {
    item.aggregate([
        // define some conditions here 
        // {
        //     $match: {
        //         $and: [{ "userId": mongoose.Types.ObjectId("5bea2322564eca53bcc76b72") }]
        //         //$and: [{ "userId": mongoose.Types.ObjectId(localStorage.getItem('currentUser')) }]
        //     }
        // },

        {
            $lookup:
            {
                from: "iteminterests",
                localField: "_id",
                foreignField: "itemId",
                as: "iteminterestsDetails"
            }
        }, // item interest lookup ends
        {
            
            $unwind: { path: "$iteminterestsDetails"} // ,preserveNullAndEmptyArrays: true
           
       },
        
        {
            $lookup:
            {
                from: "users",       // other table name
                localField: "iteminterestsDetails.userId",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "user_info"         // alias for userinfo table
            }
        },
        {
         $unwind:{ path: "$user_info"} //,preserveNullAndEmptyArrays: true
        }, 
        {
            $project: { // what you want to manipulate before aggregation
                _id: 1, //id 
                item_name: 1,
                interestedUsers: {
                    interesteduserID: '$iteminterestsDetails.userId',
                    interestedusername: '$user_info.full_name', 
                    interesteduseremail: '$user_info.email_address', 
                    interesteduseraddress: '$user_info.address'
                }

           }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    item_name:'$item_name'
                },
                interestedUsers:{$push:'$interestedUsers'}
                // interestedusers: "$interestedusers",
                // interesteduserdetails: "$interesteduserdetails"
            }
        }

      //  { $project : { items: "items", full_name : "$user_info1.full_name" , email_address : "$user_info1.email_address" } }


    ], function (err, result) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(result);
    });
}); // ends


//return all the user in the database starts
router.get('/allUserItems', function (req, res) {
    item.
        find({ 'userId': mongoose.Types.ObjectId(localStorage.getItem('currentUser')) }).sort({ 'item_date': -1 }).
        populate({ path: 'userId', select: 'full_name' }).
        exec(function (err, items) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            // console.log("Items from Server:" + items)
            res.status(200).send(items);

        });
}); // ends

router.get('/allUserItemHistory', function (req, res) {
    //Aggregation function


    item.aggregate([
        //  { $match: {
        //      _id: accountId
        //  }},
        { $unwind: "$users" },

        {
            $group: {
                _id: "$_id",
                full_name: "$users.full_name",
                email_address: "$users.email_address",
                phone_number: "$users.phone_number",
                address: "$users.address"
            }
        }
    ], function (err, result) {
        if (err) {
            return res.status(500).send("There was a problem adding the information to the database.");
            //console.log(err);
        }
        res.status(200).send(result);
        //console.log(result);
    });

    // itemInterest.
    // find({'userId': mongoose.Types.ObjectId(localStorage.getItem('currentUser'))}).sort({ 'item_date': -1 })
    //     .populate('userId', ['full_name', 'email_address','phone_number','address'])
    //     ///populate({ path: 'itemId', select: 'full_name' }).
    //     exec(function (err, items) {
    //         if (err)
    //             return res.status(500).send("There was a problem adding the information to the database.");
    //        // console.log("Items from Server:" + items)
    //         res.status(200).send(items);

    //     });
}); // ends

// save ride starts
router.post('/addItem', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.end(err.toString());
        } else if (err) {
            // An unknown error occurred when uploading.
            res.end(err.toString());
        }

        item.create({
            item_name: req.body.item_name,
            item_number: req.body.item_number,
            item_date: req.body.item_date,
            item_description: req.body.item_description,
            //item_image: 'uploads/' + req.files[0].filename,
            item_image: 'http://localhost:8080/' + req.files[0].filename,
            //item_image: req.body.item_image,
            item_cost: req.body.item_cost,
            item_Location: req.body.item_Location,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            isItem_Approved: req.body.isItem_Approved.toLowerCase() == 'true' ? true : false,
            isItem_Available: req.body.isItem_Available.toLowerCase() == 'true' ? true : false,
            userId: mongoose.Types.ObjectId(req.body.userId)
        }, function (err, item) {
            console.log("Current Item Which we added: " + item)
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(item);
        });
        //res.status(200).send({ status: 'success' });
    });

}); // save itemManagement ends

/* UPDATE BOOK */
router.put('/updateItemStatus', function (req, res) {
    item.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), req.body, { new: true }, function (err, post) {
        console.log("Current Item Which we updated: " + req.body.is_useractive)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(post);
    });
});

router.put('/updateItemAvailablity', function (req, res) {
    item.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), req.body, { new: true }, function (err, post) {
        console.log("Current Item Which we updated: " + req.body.isItem_Available)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(post);
    });
});


// save ride starts
router.post('/addUserItemInterest', function (req, res) {

    itemInterest.create({
        isItemInterested: req.body.isItemInterested,
        userId: mongoose.Types.ObjectId(req.body.userId),
        itemId: mongoose.Types.ObjectId(req.body.itemId)
    }, function (err, item) {
        console.log("Current Item Which we added: " + item)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(item);
    });
    //res.status(200).send({ status: 'success' });
});


router.put('/updateUserItemInterest', function (req, res) {
    itemInterest.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), req.body, { new: true }, function (err, post) {
        console.log("Current Item Which we updated: " + req.body.isItemInterested)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(post);
    });
});



router.put('/updateUserItemInterest', function (req, res) {
    itemInterest.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), req.body, { new: true }, function (err, post) {
        console.log("Current Item Which we updated: " + req.body.isItemInterested)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(post);
    });
});


/* DELETE BOOK */
router.delete('/deleteUserItemInterest/:id', function (req, res) {
    res.status(200).send(req);
    itemInterest.findByIdAndDelete(req.body.id, req.body, function (err, post) {
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send("ID: " + req.body._id);
    });
});


// cancel ride
router.get('/deleteUserItemInterest/:itemInterestId/', function (req, res) {
    itemInterest.
        findByIdAndDelete({ _id: req.params.itemInterestId }, req.body, function (err, ride) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send("ID: " + req.body._id);
            // res.redirect(url.format({
            //     pathname: "/ride/",
            //     query: {
            //         "userid": req.params.userid,
            //     }
            // }))
        })
}); // ends

module.exports = router;