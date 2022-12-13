const express = require('express');
const passport = require('passport');
const router = express.Router();
const User=require('../models/user')
const catchError=require('../utils/catchError')
const user=require('../controllers/user')
router.get('/users/register',catchError(async (req, res) =>{
   res.render('user.ejs')
}))
router.post('/users/register',catchError(user.newuser))
 router.get('/users/login',catchError(user.login))
 router.post('/users/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/users/login'}),catchError(user.postlogin))

  router.get('/users/logout',user.logout)
module.exports = router;