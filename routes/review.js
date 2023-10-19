const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const{validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");



//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=  await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    await listing.save();
    req.flash("success","new review is added!");
    res.redirect(`/listings/${listing._id}`);
    
    }));
    
    //Delete  review route
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review is deleted!");
        res.redirect(`/listings/${id}`);
        
        }));
        module.exports=router;