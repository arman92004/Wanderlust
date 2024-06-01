const express = require('express');
const router = express.Router({ mergeParams: true }); /// mergeParams attrubute hai use true isle kia hai kyuki by default jo parent route ke params(ID in this case) hote hain wo app.js me hi reh jate hain yaha ni aate
const User = require("../models/user.js")
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controller/user.js")

router.
    route("/signup")
    .get(userController.getSignUpForm)

    .post(wrapAsync(userController.signUp));

// login 
router
    .route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl, passport
        .authenticate("local", {
            failureRedirect: "/login", failureFlash: true
        }), userController.login);


router.get("/logout", userController.logout)

module.exports = router;