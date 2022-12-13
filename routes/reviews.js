const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Review=require('../models/review')
const review=require('../controllers/review')
const { reviewSchema} = require('../schema');
const catchError=require('../utils/catchError')
const {isLoggedIn}=require('../middleware/login')
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/campgrounds/:id/reviews',isLoggedIn,validateReview,catchError(review.newreview))
router.delete('/campgrounds/:id/reviews/:reviewId', catchError(review.deletereview));
module.exports = router;