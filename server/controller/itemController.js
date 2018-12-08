var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var mongoose = require('mongoose');
var item = require('../model/item');
var itemInterest = require('../model/itemInterest');
const multer = require('multer');
var mailController = require('../controller/mailController');

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
router.get('/allItems/', function (req, res) {
    item.
        find().sort({ 'item_date': -1 }).
        populate({ path: 'userId', select: 'full_name' }).
        exec(function (err, items) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            console.log("Items from Server:" + items)
            res.status(200).send(items);

        });
}); // ends

// //return all the user in the database starts
// router.get('/allRecentSoldOutItems/:id', function (req, res) {
//     var now = new Date();
//     var fiveminago = new Date(now.getTime() - 5 * 60 * 1000);
//     item.
//         //get all items which updated less than 5 minutes ago or more than file minutes ago

//         find({ item_date: { $gt: fiveminago }}
//         // find({
//         //     $and: [
//         //         { $or: [{ item_date: { $lt: fiveminago } }, { $gt: fiveminago }] },
//         //         { $or: [{ userid: mongoose.Types.ObjectId(req.body.id) }] }
//         //     ]
//         // }
//         ).sort({ 'item_date': -1 }).
//         populate({ path: 'userId', select: 'full_name' }).
//         exec(function (err, items) {
//             if (err)
//                 return res.status(500).send(err);
//             console.log("Items from Server:" + items)
//             res.status(200).send(items);

//         });
// }); // ends



// //return all the user in the database starts
// router.get('/allRecentSoldOutItems/:userid', function (req, res) {
//     //  res.status(200).send(req);

//     _getAllRecentSoldOutItems(req.params.userid).exec(function (err, values) {
//         if (err)
//             return res.status(500).send(err);
//         console.log(values)
//         res.status(200).send(values)
//     })

// }); // ends



//return all the user in the database starts
router.get('/allUserItemHistory/:userid', function (req, res) {
    //  res.status(200).send(req);

    _getUserItemHistory(req.params.userid).exec(function (err, values) {
        if (err)
            return res.status(500).send(err);
        console.log(values)
        res.status(200).send(values)
    })

}); // ends




//return all the user in the database starts
router.get('/allLogInUserHomeItems/:userid', function (req, res) {
    item.aggregate([
        {
            $lookup:
            {
                from: "iteminterests",
                localField: "_id",
                foreignField: "itemId",
                as: "item_interested"
            }
        },
        {
            $match: {
                //$and: [{ "userId": mongoose.Types.ObjectId("5bea2322564eca53bcc76b72") }]
                $and: [{ "isItem_Approved": true }]
            }
        },
        {
            $unwind: { path: '$item_interested', preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: '$item_interested.userId', preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: '$item_interested.itemId', preserveNullAndEmptyArrays: true }
        },
        {
            $project:
            {
                itemId: '$_id',
                item_name: '$item_name',
                item_number: '$item_number',
                item_image: '$item_image',
                item_cost: '$item_cost',
                item_Location: '$item_Location',
                item_date: '$item_date',
                isItem_Available: '$isItem_Available',
                latitude: '$latitude',
                longitude: '$longitude',
                item_description: '$item_description',
                // here to project whatever is needed.
                itemInterestedId: '$item_interested._id',
                interestedUserId: '$item_interested.userId'
            }
        },
        {
            $group: {
                _id: {
                    itemId: '$itemId',
                    item_name: '$item_name',
                    item_number: '$item_number',
                    item_image: '$item_image',
                    item_cost: '$item_cost',
                    item_Location: '$item_Location',
                    item_date: '$item_date',
                    isItem_Available: '$isItem_Available',
                    item_description: '$item_description',
                    latitude: '$latitude',
                    longitude: '$longitude'
                    //and here to take them in aggregation.
                },
                interestedUserId: { $push: '$interestedUserId' },
                itemInterestedId: { $push: '$itemInterestedId' }
            }
        },
        {
            $project:
            {
                _id: '$_id',
                "userInterested": {
                    $in: [mongoose.Types.ObjectId(req.params.userid), "$interestedUserId"]
                    //$in: [mongoose.Types.ObjectId(localStorage.getItem('currentUser')), "$interestedUserId"]
                },
                interestedUserId: '$interestedUserId',
                itemInterestedId: '$itemInterestedId'
            }
        },
        {
            $project:
            {
                _id: '$_id',
                userInterested: '$userInterested',
                index: { $indexOfArray: ["$interestedUserId", mongoose.Types.ObjectId(req.params.userid)] },
                interestedUserId: '$interestedUserId',
                itemInterestedId: '$itemInterestedId'
            }
        },
        {
            $project:
            {
                _id: '$_id',
                userInterested: '$userInterested',
                itemInterestedId: { $arrayElemAt: ['$itemInterestedId', '$index'] }
            }
        }
    ], function (err, result) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(result);
    });
}); // ends

//return all the user in the database starts
router.get('/allLogInUserHomeItems/:userid', function (req, res) {
    item.aggregate([
        {
            $lookup:
            {
                from: "iteminterests",
                localField: "_id",
                foreignField: "itemId",
                as: "item_interested"
            }
        },
        {
            $match: {
                //$and: [{ "userId": mongoose.Types.ObjectId("5bea2322564eca53bcc76b72") }]
                $and: [{ "isItem_Approved": true }]
            }
        },
        {
            $unwind: { path: '$item_interested', preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: '$item_interested.userId', preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: '$item_interested.itemId', preserveNullAndEmptyArrays: true }
        },
        {
            $project:
            {
                itemId: '$_id',
                item_name: '$item_name',
                item_number: '$item_number',
                item_image: '$item_image',
                item_cost: '$item_cost',
                item_Location: '$item_Location',
                item_date: '$item_date',
                isItem_Available: '$isItem_Available',
                latitude: '$latitude',
                longitude: '$longitude',
                item_description: '$item_description',
                // here to project whatever is needed.
                itemInterestedId: '$item_interested._id',
                interestedUserId: '$item_interested.userId'
            }
        },
        {
            $group: {
                _id: {
                    itemId: '$itemId',
                    item_name: '$item_name',
                    item_number: '$item_number',
                    item_image: '$item_image',
                    item_cost: '$item_cost',
                    item_Location: '$item_Location',
                    item_date: '$item_date',
                    isItem_Available: '$isItem_Available',
                    item_description: '$item_description',
                    latitude: '$latitude',
                    longitude: '$longitude'
                    //and here to take them in aggregation.
                },
                interestedUserId: { $push: '$interestedUserId' },
                itemInterestedId: { $push: '$itemInterestedId' }
            }
        },
        {
            $project:
            {
                _id: '$_id',
                "userInterested": {
                    $in: [mongoose.Types.ObjectId(req.params.userid), "$interestedUserId"]
                    //$in: [mongoose.Types.ObjectId(localStorage.getItem('currentUser')), "$interestedUserId"]
                },
                interestedUserId: '$interestedUserId',
                itemInterestedId: '$itemInterestedId'
            }
        },
        {
            $project:
            {
                _id: '$_id',
                userInterested: '$userInterested',
                index: { $indexOfArray: ["$interestedUserId", mongoose.Types.ObjectId(req.params.userid)] },
                interestedUserId: '$interestedUserId',
                itemInterestedId: '$itemInterestedId'
            }
        },
        {
            $project:
            {
                _id: '$_id',
                userInterested: '$userInterested',
                itemInterestedId: { $arrayElemAt: ['$itemInterestedId', '$index'] }
            }
        }
    ], function (err, result) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(result);
    });
}); // ends

//return all the user in the database starts
router.get('/allHomeItems/', function (req, res) {
    item.aggregate([
        {
            $lookup:
            {
                from: "iteminterests",
                localField: "_id",
                foreignField: "itemId",
                as: "item_interested"
            }
        },
        {
            $match: {
                //$and: [{ "userId": mongoose.Types.ObjectId("5bea2322564eca53bcc76b72") }]
                $and: [{ "isItem_Approved": true }]
            }
        },
        {
            $unwind: { path: '$item_interested', preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: '$item_interested.userId', preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: '$item_interested.itemId', preserveNullAndEmptyArrays: true }
        },
        {
            $project:
            {
                itemId: '$_id',
                item_name: '$item_name',
                item_number: '$item_number',
                item_image: '$item_image',
                item_cost: '$item_cost',
                item_Location: '$item_Location',
                item_date: '$item_date',
                isItem_Available: '$isItem_Available',
                latitude: '$latitude',
                longitude: '$longitude',
                item_description: '$item_description',
                // here to project whatever is needed.
                itemInterestedId: '$item_interested._id',
                interestedUserId: '$item_interested.userId'
            }
        },
        {
            $group: {
                _id: {
                    itemId: '$itemId',
                    item_name: '$item_name',
                    item_number: '$item_number',
                    item_image: '$item_image',
                    item_cost: '$item_cost',
                    item_Location: '$item_Location',
                    item_date: '$item_date',
                    isItem_Available: '$isItem_Available',
                    item_description: '$item_description',
                    latitude: '$latitude',
                    longitude: '$longitude'
                    //and here to take them in aggregation.
                },
                interestedUserId: { $push: '$interestedUserId' },
                itemInterestedId: { $push: '$itemInterestedId' }
            }
        },
        {
            $project:
            {
                _id: '$_id',
                // "userInterested": {
                //     $in: [mongoose.Types.ObjectId(req.params.userid), "$interestedUserId"]
                //     //$in: [mongoose.Types.ObjectId(localStorage.getItem('currentUser')), "$interestedUserId"]
                // },
                interestedUserId: '$interestedUserId',
                itemInterestedId: '$itemInterestedId'
            }
        },
        {
            $project:
            {
                _id: '$_id',
                userInterested: '$userInterested',
                //   index: { $indexOfArray: ["$interestedUserId", mongoose.Types.ObjectId(req.params.userid)] },
                interestedUserId: '$interestedUserId',
                itemInterestedId: '$itemInterestedId'
            }
        },
        {
            $project:
            {
                _id: '$_id',
                userInterested: '$userInterested',
                itemInterestedId: { $arrayElemAt: ['$itemInterestedId', '$index'] }
            }
        }
    ], function (err, result) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(result);
    });
}); // ends

//return all the user in the database starts
router.get('/allRecentSoldOutItems/:id', function (req, res) {
    var now = new Date();
    var fiveminago = new Date(now.getTime() - 2 * 60 * 1000);

    queryParams = {
        'userId': {
            $eq: mongoose.Types.ObjectId(req.params.id)
        },
        'item_soldOutDate': { $gt: fiveminago }
    }
    item.
        find({ $and: [ { userId: { $eq: mongoose.Types.ObjectId(req.params.id)} }, { item_soldOutDate: { $gt: fiveminago } } ] }).sort({ 'item_date': -1 }).
        populate({ path: 'userId', select: 'full_name' }).
        exec(function (err, items) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            // console.log("Items from Server:" + items)
            res.status(200).send(items);

        });
}); // ends


//return all the user in the database starts
router.get('/allUserItems/:id', function (req, res) {
    item.
        find({ 'userId': mongoose.Types.ObjectId(req.params.id) }).sort({ 'item_date': -1 }).
        populate({ path: 'userId', select: 'full_name' }).
        exec(function (err, items) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            // console.log("Items from Server:" + items)
            res.status(200).send(items);

        });
}); // ends

// save  starts
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

router.put('/updateAllItemStatus', function (req, res) {
    // item.find({}, req.body, { new: true }), function (err, post) {
    //     console.log("Current Item Which we updated: " + req.body.is_useractive)
    //     if (err)
    //         return res.status(500).send("There was a problem adding the information to the database.");
    //     res.status(200).send(post);
    // }

    console.log("Current Item Which we updated: " + req.body.isItem_Approved)
    item.update({}, {

        $set: {
            "isItem_Approved": req.body.isItem_Approved,
        }
    }, { multi: true }, function (err, values) {
        if (err) {
            console.log("error on UPDATING");
            return res.status(500).send("error");
        }
        else {
            console.log("success on UPDATING");
            res.status(200).send("success");
        }
    }
    );
});




router.put('/updateItemAvailablity', function (req, res) {
    item.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), req.body, { new: true }, function (err, post) {
        console.log("Current Item Which we updated: " + req.body.isItem_Available)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(post);
    });
});


// save  starts
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



// router.put('/updateUserItemInterest', function (req, res) {
//     itemInterest.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), req.body, { new: true }, function (err, post) {
//         console.log("Current Item Which we updated: " + req.body.isItemInterested)
//         if (err)
//             return res.status(500).send("There was a problem adding the information to the database.");
//         res.status(200).send(post);
//     });
// });




//return all the user in the database starts
router.get('/allUserItemHistory/:userid', function (req, res) {
    //  res.status(200).send(req);

    _getUserItemHistory(req.params.userid).exec(function (err, values) {
        if (err)
            return res.status(500).send(err);
        console.log(values)
        res.status(200).send(values)
    })

}); // ends







function _getAllRecentSoldOutItems(userid) {
    var now = new Date();
    var fiveminago = new Date(now.getTime() - 5 * 60 * 1000);
    let queryParams = {}
    queryParams = {
        'userId': {
            $eq: mongoose.Types.ObjectId(userid)
        },
        'item_soldOutDate': { $gt: fiveminago }
    }

    return item.aggregate([
        // define some conditions here 
        {
            $match: queryParams
            // $match: {
            //     //$and: [{ "userId": mongoose.Types.ObjectId("5bea2322564eca53bcc76b72") }]
            //     $and: [{ "userId": mongoose.Types.ObjectId(req.body.id) }]
            // }
        },
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

            $unwind: { path: "$iteminterestsDetails" } // ,preserveNullAndEmptyArrays: true

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
            $unwind: { path: "$user_info" } //,preserveNullAndEmptyArrays: true
        },
        {
            $project: { // what you want to manipulate before aggregation
                _id: 1, //id 
                item_name: '$item_name',
                item_number: '$item_number',
                item_image: '$item_image',
                item_cost: '$item_cost',
                item_Location: '$item_Location',
                item_date: '$item_date',
                isItem_Available: '$isItem_Available',
                latitude: '$latitude',
                longitude: '$longitude',
                item_description: '$item_description',
                interestedUsers: {
                    interesteduserID: '$iteminterestsDetails.userId',
                    interestedfirstname: '$user_info.full_name',
                    interesteduseremail: '$user_info.email_address',
                    interesteduseraddress: '$user_info.address',
                    interesteduserphonenumber: '$user_info.phone_number'
                }

            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    item_name: '$item_name',
                    item_number: '$item_number',
                    item_image: '$item_image',
                    item_cost: '$item_cost',
                    item_Location: '$item_Location',
                    item_date: '$item_date',
                    isItem_Available: '$isItem_Available',
                    latitude: '$latitude',
                    longitude: '$longitude',
                    item_description: '$item_description'
                },
                interestedUsers: { $push: '$interestedUsers' }
                // interestedusers: "$interestedusers",
                // interesteduserdetails: "$interesteduserdetails"
            }
        }

        //  { $project : { items: "items", full_name : "$user_info1.full_name" , email_address : "$user_info1.email_address" } }

    ])
    // ]), function (err, result) {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     res.status(200).send(result);
    // });
}
function _getUserItemHistory(userid) {
    let queryParams = {}
    queryParams = {
        'userId': {
            $eq: mongoose.Types.ObjectId(userid)
        }
    }

    return item.aggregate([
        // define some conditions here 
        {
            $match: queryParams
            // $match: {
            //     //$and: [{ "userId": mongoose.Types.ObjectId("5bea2322564eca53bcc76b72") }]
            //     $and: [{ "userId": mongoose.Types.ObjectId(req.body.id) }]
            // }
        },
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

            $unwind: { path: "$iteminterestsDetails" } // ,preserveNullAndEmptyArrays: true

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
            $unwind: { path: "$user_info" } //,preserveNullAndEmptyArrays: true
        },
        {
            $project: { // what you want to manipulate before aggregation
                _id: 1, //id 
                item_name: '$item_name',
                item_number: '$item_number',
                item_image: '$item_image',
                item_cost: '$item_cost',
                item_Location: '$item_Location',
                item_date: '$item_date',
                isItem_Available: '$isItem_Available',
                latitude: '$latitude',
                longitude: '$longitude',
                item_description: '$item_description',
                interestedUsers: {
                    interesteduserID: '$iteminterestsDetails.userId',
                    interestedfirstname: '$user_info.full_name',
                    interesteduseremail: '$user_info.email_address',
                    interesteduseraddress: '$user_info.address',
                    interesteduserphonenumber: '$user_info.phone_number'
                }

            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    item_name: '$item_name',
                    item_number: '$item_number',
                    item_image: '$item_image',
                    item_cost: '$item_cost',
                    item_Location: '$item_Location',
                    item_date: '$item_date',
                    isItem_Available: '$isItem_Available',
                    latitude: '$latitude',
                    longitude: '$longitude',
                    item_description: '$item_description'
                },
                interestedUsers: { $push: '$interestedUsers' }
                // interestedusers: "$interestedusers",
                // interesteduserdetails: "$interesteduserdetails"
            }
        }

        //  { $project : { items: "items", full_name : "$user_info1.full_name" , email_address : "$user_info1.email_address" } }

    ])
    // ]), function (err, result) {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     res.status(200).send(result);
    // });
}
// cancel 
router.get('/deleteUserItemInterest/:itemInterestId/', function (req, res) {
    itemInterest.
        findByIdAndDelete({ _id: req.params.itemInterestId }, req.body, function (err, user) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send("ID: " + req.body._id);
            // res.redirect(url.format({
            //     pathname: "//",
            //     query: {
            //         "userid": req.params.userid,
            //     }
            // }))
        })
}); // ends

module.exports = router;