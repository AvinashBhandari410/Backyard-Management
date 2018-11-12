var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var mongoose = require('mongoose');
var item = require('../model/item');
const multer = require('multer');

//Get reference for select multiple columns from multiple tables joins
//https://scotch.io/@ossaijad/how-to-do-join-operations-and-create-links-between-mongodb-collection

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../../../client/src/Images/')
//     },
//     filename: (req, file, cb) => {
//         if (!file.originalname.match('/\.(png)$/')) {
//             var err = new Error();
//             err.code = "filetype";
//             return cb(err);
//         }
//         else {
//             cb(null, Date.now()+ '_' + file.originalname);
//         }
//     }
// });
// var upload = multer({ storage: storage, limits: { fileSize: 1000000 } }).single('item_image');
// const options = {  
//     transformRequest: angular.identity,
//     headers: {
//         'Content-Type': undefined
//     }
// };

// const upload = multer({
//     dest: '../../client/src/Images/' // this saves your file into a directory called "uploads"
//   });
// //return all the user in the database starts
// router.get('/allItems', function (req, res) {
//     var userId=mongoose.Types.ObjectId(req.body.userId);
//     console.log("Node JS: " + userId)
//         // item should be todays or greater than todays date.
//         item.
//             find({'userId': userId}).sort({ 'item_date': -1 }).
//             populate('item_number')
//             exec(function (err, items) {
//                 if (err)
//                     return res.status(500).send("There was a problem adding the information to the database.");
//                 console.log("Items from Server:" + items)
//                 res.status(200).send(items);

//             });

//     }); // ends


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

//return all the user in the database starts
router.get('/allItems', function (req, res) {
    //var userId=mongoose.Types.ObjectId(req.body.userId);
    // console.log("Node JS: " + userId)
    // item should be todays or greater than todays date.
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
    //var userId=mongoose.Types.ObjectId(req.body.userId);
    // console.log("Node JS: " + userId)
    // item should be todays or greater than todays date.
    item.
        find({'isItem_Approved': true}).sort({ 'item_date': -1 })
        .populate('userId', ['full_name', 'address'])
        //populate({ path: 'userId', select: 'full_name', select: 'full_name'}).
        .exec(function (err, items) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            console.log("Items from Server:" + items)
            res.status(200).send(items);

        });
}); // ends


//return all the user in the database starts
router.get('/allUserItems', function (req, res) {
    console.log(req.body.id);
    item.
    find().
        exec(function (err, items) {
            if (err)
                return res.status(500).send("There was a problem adding the information to the database.");
            console.log("Items from Server:" + items)
            res.status(200).send(items);

        });
}); // ends

// router.get('/allItems/', (req, res) => {
//     var userId=mongoose.Types.ObjectId(req.body.userId);
//     item.find({}, (err, rsvps) => {
//       let rsvpsArr = [];
//       if (err) {
//         return res.status(500).send({message: err.message});
//       }
//       if (rsvps) {
//         rsvps.forEach(rsvp => {
//           rsvpsArr.push(rsvp);
//         });
//       }
//       res.send(rsvpsArr);
//     });
//   });

// save ride starts
router.post('/addItem', function (req, res) {
    
    // upload(req,res,function(err){
    //     //transformRequest: angular.identity
    //     if(err)
    //     {
    //         if(err.code === 'LIMIT_FILE_SIZE')
    //         {
    //             return res.status(500).send("File size is too large.");
    //         }
    //         else if(err.code === 'filetype')
    //         {
    //             return res.status(500).send("Filetype is Invalid.");
    //         }
    //         else
    //         {
    //             return res.status(500).send("File was not uploaded.");
    //         }
    //     }
    //     else 
    //     {
    //         if(!req.file)
    //         {
    //             return res.status(500).send("No file was selected.");
    //         }
    //         else
    //         {
    //             return res.status(500).send("file was selected.");
    //         }
    //     }
    // });

    // upload(req,res,function(err){
    //     console.log(req.file);
    //     if(err){
    //          res.json({error_code:1,err_desc:err});
    //          return;
    //     }
    //      res.json({error_code:0,err_desc:null});

    // });
  //  console.log("Image_123_" + req.file);
    item.create({
        item_name: req.body.item_name,
        item_number: req.body.item_number,
        item_date: req.body.item_date,
        item_description: req.body.item_description,
        //   item_image: 'client/src/Images/' + req.file.filename,
        item_image: req.body.item_image,
        item_cost: req.body.item_cost,
        item_Location: req.body.item_Location,
        isItem_Approved: req.body.isItem_Approved,
        isItem_Available: req.body.isItem_Available,
        userId: mongoose.Types.ObjectId(req.body.userId)
    }, function (err, item) {
        console.log("Current Item Which we added: " + item)
        if (err)
            return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(item);
    });
}); // save itemManagement ends


// // save ride starts
// router.post('/updateItemStatus', function (req, res) {

//     var id = mongoose.Types.ObjectId(req.body._id);
//     var status = req.body.isItem_Approved;
//     item.findOne({ '_id': _id }, function (err, list) {
//         debugger
//         console.log("Current Item Which we updated: " + list)
//             if(err)
//             return res.status(500).send("There was a problem adding the information to the database.");
//             list.isItem_Approved= status? false: true;
//             console.log("Updated Item Status" + list.isItem_Approved)
//             list.save();
//             res.status(200).send(list);
//     }
//     );

// }); // save itemManagement ends

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

// router.put('/updateItemStatus', function(req, res) {
//     item.update({_id: req.body._id}, { isItem_Approved: true}, function (err, post) {
//         console.log("Current Item Which we updated: " + req.body.isItem_Approved)
//       if (err)    
//       return res.status(500).send("There was a problem adding the information to the database.");
//       res.status(200).send(item);
//     });
//   });

module.exports = router;