const express=require('express');
const app=express();
const path=require('path');
const ejs=require('ejs-mate');
const mongoose=require('mongoose');
const music=require('../models/music');
const methodOverride=require("method-override");
const User=require('../models/user');
const passport=require('passport');
const localStrategy=require('passport-local');
const catchAsync=require('../utils/CatchAsync');
const ExpressError=require('../utils/ExpressError');
const userSchema=require('../utils/validateuser')
const router=express.Router();
const isLoggedIn=require('../utils/isLoggedIn')
const flash=require('connect-flash');

app.use(flash());
const findNext= async (id)=>{
    const songs= await music.find({})
    let currentSong; let nextSong;
    for(let i=0;i<songs.length;i++)
    {
        if(songs[i]._id == id)
        {
            currentSong=i;
            break;
        }
    }
    if(currentSong!=songs.length-1)
    {
        nextSong=currentSong+1;
    }
    else{
        nextSong=0;
    }
    const next=await music.findById(songs[nextSong]._id);
    return next;
}
const findPrev= async (id)=>{
    const songs= await music.find({})
    let currentSong; let nextSong;
    for(let i=0;i<songs.length;i++)
    {
        if(songs[i]._id == id)
        {
            currentSong=i;
            break;
        }
    }
    if(currentSong!=0)
    {
        nextSong=currentSong-1;
    }
    else{
        nextSong=songs.length-1;
    }
    const next=await music.findById(songs[nextSong]._id);
    return next;
}

router.get('/',isLoggedIn,catchAsync(async (req,res)=>{
    const song=await music.find({});
    res.render('players/index',{song});
}))

router.get('/:id',isLoggedIn,catchAsync(async (req,res)=>{
    const {id}=req.params;
    //console.log("song searching1");
    const song = await music.findById(id);
    req.flash('success',`Playing ${song.title}`)
    //console.log("song searching2");
    if(!song){
        //console.log("song not found");
        req.flash('error','Song Unavailable');
        return res.redirect('/play');
    }
    else{
    res.render('players/show',{song})
    }
}))

router.post('/:id/prev',isLoggedIn,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const prev=await findPrev(id);
    res.redirect(`/play/${prev._id}`);
}))

router.post('/:id/forward',isLoggedIn,catchAsync(async (req,res)=>{
    const {id} = req.params;
    const next=await findNext(id);
    res.redirect(`/play/${next._id}`)
}))

module.exports=router;