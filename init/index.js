const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/Wanderlust"
main()
.then(()=>{
    console.log("Connections successfull");
})
.catch((err)=> console.log(err));

async function main(){
    await mongoose.connect(Mongo_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "660c5a8b0199f84ca1b6a4cb"
    }));
    await Listing.insertMany(initData.data);
    console.log("DB was initiated");
};
initDB();