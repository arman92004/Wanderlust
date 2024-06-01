const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({ // Schema me userName or Password attributes define nhi krne kyuki unhe PassPort-Local-Mongoose khud hi create kr dega by default jb user Schema implement hoga
    email : {
        type : String ,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose); // this plugin is used to implement username and password attribute creation and HAshing and salting while storing them

module.exports = mongoose.model("User" , userSchema);