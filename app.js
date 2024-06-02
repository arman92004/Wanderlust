if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const mongoose = require('mongoose');
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const express = require('express');
const app = express();
// const Listing = require("./models/listing.js")
// const Review = require("./models/review.js")
// const wrapAsync = require("./utils/wrapAsync.js");
// const {listingSchema,reviewSchema} = require("./schemaValidation.js");
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB_URL; // for cloud Atlas DB
const Mongo_URL = "mongodb://127.0.0.1:27017/Wanderlust"
main()
    .then(() => {
        console.log("Connections successfull");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
    console.log("http://localhost:8080/listings/");
})

const store = MongoStore.create({
   mongoUrl: dbUrl,
   crypto:{ // crypto means encrypted form 
        secret: process.env.SECRET
   } ,
   touchAfter:  24*3600 // in seconds 
});
store.on("error",()=>{
     console.log("Error in MONGO SESSION STORE")
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { // cookie opts
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // time equivalent to 1 week in millesecinds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true // for security -> cross scripting attacks
    }
};

// app.get("/", (req, res) => {
//     res.send("Working")
// });
app.use(session (sessionOptions));
app.use(flash()); // flash ko hmesha baaki routes se pehle use krna

// Authenticaton using Passport
app.use(passport.initialize());
app.use(passport.session()); // middleware to identify that all the request from a user belong to same session
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => { // Middleware to set local variables for flash
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user; // stores info of currently loggedIn user
    next();
})

// 
app.get("/registerUser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "Student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})
app.get('/', (req, res) => {
    res.redirect('/listings');
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// Page not found
app.all("*", (req, res, next) => { // Default route if non existent route is accessed
    next(new ExpressError(404, "Page not found!!"))
})

//-------------------------------Middlewares------------------------------

// Errror handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

