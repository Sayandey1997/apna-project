const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema}= require("../schema.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const multer  = require('multer');
const {storage} =   require("../cloudConfig.js");
const upload = multer({ storage });



//middle were data base handling validation
const validateListing = (req,res, next) => {
let {error} = listingSchema.validate(req.body);
  
  if(error){
    throw new ExpressError(400, error);
  }
  else{
    next();
  }
}




//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));
  

  //New Route
router.get("/new",  isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
  });

  //Show Route
router.get("/:id",upload.single("listing[image]"), wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path :"reviews", populate: {path: "author",},}).populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested for does not exists!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }));
  

  
  // Create Route (FIXED)
router.post("/", isLoggedIn, upload.single("listing[image]"),  validateListing, wrapAsync(async (req, res, next) => {
   try{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    const listingData = req.body.listing;
  
    // Wrap the image string into an object with a 'url' field
    listingData.image = {
        url: listingData.image
    };

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success" , "New listing created!");
    res.redirect("/listings");
   }catch(err){
    next(err);
   }})
  );
  
//     // Corrected POST route
// router.post('/', upload.single('listing[image]'), function (req, res, next) {
//     res.send(req.file);
// });




  
    //Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync( async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
      req.flash("error", "Listing you requested for does not exists!");
      res.redirect("/listings");
    }
      res.render("listings/edit.ejs", { listing });
    }));
  
  
  
//   // Update Route
// router.put("/:id", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync( async (req, res) => {
//     let { id } = req.params;
  
//     // Wrap the image in an object with a 'url' field
//     const updatedListing = req.body.listing;
//     updatedListing.image = { url: updatedListing.image }; // Fix: Wrap image URL in an object with a 'url' property
    
//     await Listing.findByIdAndUpdate(id, updatedListing);
//     if(typeof req.file !="undefined"){
//      let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = {url , filename};
//      await newListing.save();
//     }
//     req.flash("success" , "Updated created!");
//     res.redirect(`/listings/${id}`);
//   }));
  
  
// Update Route
router.put("/:id", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id); // Fetch existing listing

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Update text fields
  const updatedData = req.body.listing;
  await Listing.findByIdAndUpdate(id, updatedData);

  // Update image if a new file is uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save(); // Save the updated listing
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));

 

////////////////////////////
  
    //Delete Route
router.delete("/:id", isLoggedIn,wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
       req.flash("success" , "Deleted");
      res.redirect("/listings");
    }));
  
  module.exports = router;