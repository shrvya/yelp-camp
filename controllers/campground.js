const Campground = require('../models/campground');
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index', { campgrounds })
}

module.exports.new = async (req, res) => {
    res.render('new')
}
module.exports.postnew = async (req, res,next) => {
    
    try{
    const camp=new Campground(req.body.Campground)
    camp.author=req.user._id;
    await camp.save().then(()=>{
        console.log("saved")
    }).catch((err)=>{
        console.log(err)
    })
    const _id = camp._id.toString()
    req.flash('success','Successfully created new post')
    res.redirect(`/campgrounds/${_id}`)
    console.log(camp,'*********************')
}catch(e){
    next(e)
}
}

module.exports.edit = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render('edit', { campgrounds })
}

module.exports.getone = async (req, res) => {
    try{
        const campgrounds = await Campground.findById(req.params.id).populate('reviews').populate('author');
        console.log(res.locals)
        res.render('show', { campgrounds })
    }
    catch(e){
        console.log(e)
    }  
}

module.exports.put =  async (req, res) => {
    const { id } = req.params; 
   
     const campground = await Campground.findByIdAndUpdate(id, req.body.Campground,{new:true})
    console.log(campground,"edit put********")
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
   
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}