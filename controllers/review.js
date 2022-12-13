const Campground = require('../models/campground');
const Review=require('../models/review')
module.exports.newreview = async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.save();
    campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
   
}
module.exports.deletereview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}
