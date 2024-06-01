const User = require("../models/user.js")



module.exports.getSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUp = async (req,res)=>{
    try{let {username , email , password}  = req.body;
    const newUser = new User ({email , username});
    const registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    req.login(registeredUser , (err)=>{ // login method of Passport
        if(err){
            return next(err);
        }
        req.flash("success" , "Welcome to Wanderlust");
        res.redirect("/listings");
    })
}catch(err){
    req.flash("error" , err.message);
    res.redirect("/signup")
}
}

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs")
}
module.exports.login = async(req,res)=>{
    req.flash("success" , "Welcome back to Wanderlust")
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{ // callback functin what to do after logout
        if(err){
            return next(err);
        }else{
            req.flash("success" , "Loggged Out Successfully");
            res.redirect("/listings")
        }
    })
}