
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const campground=require('../controllers/campground')
const { campgroundSchema} = require('../schema');
const catchError=require('../utils/catchError')
const {isLoggedIn,isAuthor}=require('../middleware/login')
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/campgrounds',campground.index );
router.get('/campgrounds/new',isLoggedIn,campground.new);
router.post('/campgrounds/new', campground.postnew);
router.get('/campgrounds/:id',isLoggedIn, campground.getone);

router.get('/campgrounds/:id/edit',isAuthor,catchError(campground.edit));
router.put('/campgrounds/:id',isAuthor,campground.put);
router.delete('/campgrounds/:id',isAuthor, campground.delete);
module.exports = router;