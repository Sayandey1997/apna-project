//environment variable
if(process.env.NODE_ENV != "production"){
require('dotenv').config();

}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema}= require("./schema.js");
const Review = require("./models/review.js"); 
const { reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./Routes/listings.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");


app.get("/getcookies", (req, res) => {
 res.cookie("great", "hello")
 res.cookie("sayan", "ram")
  res.send("sent you some cookies");
});





const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB1");
    })
    .catch((err) => {
        console.log("Error while connecting to DB", err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
 secret : "mysupersecretcode",
 resave : false,
 saveUninitialized: true,
 cookie : {
    expires : Date.now() + 7*24 * 60 * 60 * 1000,
    maxAge : 7 * 24 *60 *60 * 1000,
    httpOnly: true,
 },

};

// app.get("/", (req,res) => {
// res.send("Hi, i am root");
// })





app.use(session(sessionOptions));
app.use(flash());


//pasport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash
app.use((req, res, next) => {
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
next();
}
)



// app.get("/demouser", async (req, res) => {
// let fakeUser = new User({
//     email: "sayan@gmail.com",
//     username: "papai"
// });

// let registeredUser = await User.register(fakeUser, "helloworld1");
// res.send(registeredUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//error server side
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong"} = err;
  res.status(statusCode).send(message);
  // res.send("something went wroong");
});



app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

// //Create Route
// app.post("/listings", async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//   });

//check create route

//////
// app.get("/testListing", async (req,res) => {
// let sampleListing = new Listing({
// title : "My New Villa",
// description : "By the beach",
// price : 1200,
// location: "Calgunte, Goa",
// country: "India"
// });

// await sampleListing.save();
// console.log("sample was saved");
// res.send("Successful testing");
// });

// Catch-all for undefined routes
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));  // message, status
// });



