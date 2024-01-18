
const express=require('express');
const app=express();
const path=require('path');
const ejs=require('ejs-mate');
const mongoose=require('mongoose');
const music=require('../models/music');
const methodOverride=require("method-override");
const User=require('../models/user');
const localStrategy=require('passport-local');
const catchAsync=require('../utils/CatchAsync');
const ExpressError=require('../utils/ExpressError');
const userSchema=require('../utils/validateuser');
const router=express.Router();
const passport=require('passport');
const {returnTo} = require('../utils/returnTo');

const validateUser=async (req,res,next)=>{
    const {error}=userSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',');
        return next(new ExpressError(msg , 400));
    }
    else
        next();
}

router.post('/register',catchAsync(async (req,res,next)=>{
    try{
     const {email,password,username} =req.body.user;
     const u = new User({email,username});
     const new_user= await User.register(u,password);
     req.login(new_user,err=>{
        if(err) return next(err);
        req.flash('success',`Welcome ${new_user.username}`);
        res.redirect('/play');
     })
     
    }catch(e){
        req.flash('error',e.message);
        return res.redirect('/register');
    }
     
}));

router.get('/register',(req,res)=>{
    res.render('players/register');
})

router.get('/login',(req,res)=>{
    res.render('players/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),catchAsync(async (req,res)=>{
    req.flash('success','Welcome back');
    res.redirect('/play');    
}))

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
}); 

module.exports=router;