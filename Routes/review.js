const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const {listingSchema}= require("../schema.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");  // <== Add this line
const { isLoggedIn } = require("../middleware.js");





//middle were data base handling
const validateReview = (req,res, next) => {
  let {error} = reviewSchema.validate(req.body);
    
    if(error){
      throw new ExpressError(400, error);
    }
    else{
      next();
    }
  }




//validate
  router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  const review = new Review(req.body.review);
   review.author = req.user._id; // ✅ Set the logged-in user as author
  await review.save();
  listing.reviews.push(review._id);
  await listing.save();
   req.flash("success" , "New Review created!");

  res.redirect(`/listings/${id}`);
}));

  

  

//delete review 
router.delete("/:reviewId", isLoggedIn, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
   req.flash("success" , "Review Deleted!");
  res.redirect(`/listings/${id}`);
}));


  module.exports = router;