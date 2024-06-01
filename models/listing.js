const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title : {
        type :String,
        required :true
    },
    description : String,
    image : {
        
        // default :"https://unsplash.com/photos/aerial-view-photography-of-boats-on-seashore-2ueUnL4CkV8",//to set deafult image if no omage is passed
        // set : (v)=> v===""?"https://unsplash.com/photos/aerial-view-photography-of-boats-on-seashore-2ueUnL4CkV8":v // to set default value if blank string url is passsed
        filename : String,
        url : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner:{
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing; 
