const Campground = require('../models/campground');
const flash = require('connect-flash');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/users/login');
    }
    next();
}
module.exports.isAuthor=async(req,res,next) =>{
    const { id } = req.params; 
    const camp=await Campground.findById(id)
    console.log(req.user,"*req")
    if(!camp.author[0]._id.equals(req.user._id))
    {
        req.flash('error','You cannot edit this ')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}