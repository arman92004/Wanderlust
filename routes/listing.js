const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schemaValidation.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controller/listing.js")
const {storage} = require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })


router
    .route("/") // router.route id used to combine all the different requests for same path
 
    // index route 
    .get(wrapAsync(listingController.index))

    // Create Route post request

    .post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

    // .post( upload.single('listing[image]'), function (req, res, next) {// multer to store files
    //     res.send(req.file);
    //   })


router
    .route("/new")
    // Create route get request
    .get(isLoggedIn, listingController.renderNewForm); // isLoggedin 


router
    .route("/filter/:category")
    
    .get(listingController.filter) ;

router
    .route("/:id") 
    //show route
    .get(wrapAsync(listingController.showListing))

    //DETROY ROute
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
    // update Listing
    .put(isLoggedIn,upload.single('listing[image]'), isOwner, validateListing, wrapAsync(listingController.updateListing));



// Edit route get req
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




// router.get("/testListing",async (req,res)=>{
//     let sample = new Listing({
//         title : "My New Villa",
//         description : "Seaside facing",
//         price : 2000,
//         location : "Calangute, Goa",
//         country : "India"
//     });
//     await sample.save();
//     console.log("Sample was Saved");
//     res.send("Success")
// });

module.exports = router;



