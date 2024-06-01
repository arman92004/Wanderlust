const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schemaValidation.js");
const ExpressError = require("./utils/ExpressError.js")



module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // save the original url where user wanted to go in session object
        req.flash("error" , "You must be logged in to add a new Listing");
         return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){ 
        res.locals.redirectUrl = req.session.redirectUrl; // save redirect url in local variable bcoz session is restted by passport after login
    }
    next();
}


module.exports.isOwner =async (req,res,next)=>{
    let { id } = req.params;

    let listing  = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.user._id)){
        req.flash("error" , "You are not the owner of the listing");
        return res.redirect(`/listings/${id}/`);
    }
    next();
}

module.exports.isReviewAuthor =  async (req,res,next)=>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.user._id)){
        req.flash("error" , "You are not the author of the review");
        return res.redirect(`/listings/${id}/`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{ // validation middleware
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    } else{
        next();
    }
}

module.exports.validateReview =  (req,res,next)=>{ // validation middleware
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    } else{
        next();
    }
}