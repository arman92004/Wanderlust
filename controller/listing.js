const Listing = require("../models/listing")
const ExpressError = require("../utils/ExpressError.js")


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}
module.exports.filter = async (req,res)=>{
    const {category} = req.params;
    const allListings = await Listing.find({category : category});
    console.log(allListings);
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => { 
    console.log(req.user)
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: { // nested populate method to populate reviews with their authors
            path: "author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist");;
        res.redirect("/listings");
    }
    else res.render("listings/show.ejs", { listing });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing does not exist");;
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250,h_167");
    res.render("listings/edit.ejs", { listing , originalImageUrl})
}

module.exports.updateListing = async (req, res, next) => {
    if (!req.body.listing) {
        next(new ExpressError(400, "Send valid data for listing"))
    }
    let { id } = req.params;
    console.log(id);
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });  // ... means deconstruct
    if(typeof req.file!="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename , url}
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully");

    res.redirect(`/listings/${id}/`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");

    console.log(listing);
    res.redirect("/listings");
}