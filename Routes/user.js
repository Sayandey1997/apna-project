const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // Make sure this model exists
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


// GET route to render the signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// POST route to handle form submission
router.post("/signup", wrapAsync(async (req, res) => {
  
try{

let { username, email, password } = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if(err){
        return next(err);
      }
req.flash("success", "Welcome to wanderlust");
    res.redirect("/listings");

    })
} catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
}

    

  }));




  router.get("/login", async (req, res) => {
    res.render("users/login.ejs");
  
  
});

// POST route to handle login submission
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust   again! ");
    res.redirect("/listings");
  }
);


// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
});



  module.exports = router;

    // // Basic validation
    // if (!username || !email || !password) {
    //   req.flash("error", "All fields are required.");
    //   return res.redirect("/signup");
    // }

    // // Check if user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   req.flash("error", "Email is already registered.");
    //   return res.redirect("/signup");
    // }

    // // Hash password
    // const hashedPassword = await bcrypt.hash(password, 12);

    // //
