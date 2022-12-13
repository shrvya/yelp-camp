const User=require('../models/user')

module.exports.newuser = async (req, res) => async (req, res) =>{
    const {email,username,password}=req.body
    const user=new User({email,username});
    const registerdUser=await User.register(user,password)
    req.login(registerdUser,err=>{
      if (err) return next(err);
      req.flash('success',"login done")
      res.redirect('/campgrounds')
    })
    
 }
 module.exports.login= async (req, res) =>{

    res.render('login.ejs')

 }
 module.exports.postlogin= async (req, res) =>{
    const redirectUrl=req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
  }
  module.exports.logout= (req, res) =>{
   
    req.logout(req.user, err => {
       if(err) return next(err);
       res.redirect("/campgrounds");
     });
    req.flash('success',"Logged Out")
   
  }