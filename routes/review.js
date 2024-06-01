const express = require('express');
const router = express.Router({mergeParams: true}); /// mergeParams attrubute hai use true isle kis hai kyuki by default jo parent route ke params(ID in this case) hote hain wo app.js me hi reh jate hain yaha ni aate
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require("../schemaValidation.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controller/review.js")


// ------------------------------ Reviews

// Post review
router.post("/" ,isLoggedIn ,validateReview ,wrapAsync( reviewController.createReview ));

// Delete review
router.delete("/:reviewId" ,isLoggedIn ,isReviewAuthor , wrapAsync(reviewController.destroyReview)
);

module.exports = router;