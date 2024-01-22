require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
const ejs=require('ejs-mate');
const mongoose=require('mongoose');
const music=require('./models/music');
const methodOverride=require("method-override");
const User=require('./models/user');
const catchAsync=require('./utils/CatchAsync');
const ExpressError=require('./utils/ExpressError');
const userSchema=require('./utils/validateuser');
const musicRoutes=require('./routes/music');
const userRoutes=require('./routes/users');
const session = require('express-session');
const flash=require('connect-flash');
mongoose.connect('mongodb://127.0.0.1:27017/music-player',{
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
});
const passport=require('passport');
const localStrategy=require('passport-local');
const Joi = require('joi');



app.engine("ejs",ejs);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


const sessionObject = {
    secret:"This is my secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 604000*1000,
        maxAge:604000*1000,
        httpOnly:true
    }
}
app.use(session(sessionObject));
app.use(express.static(path.join(__dirname + 'public')));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser=req.user;
    next();
})

app.get('/',async (req,res)=>{
    res.render('home');
})

app.use('/',userRoutes);
app.use('/play',musicRoutes);


app.get('/add',catchAsync(async(req,res)=>{
    res.render('players/new.ejs')
}))

app.post('/add',catchAsync(async(req,res)=>{
    const {name,singer,url,desc,image} = req.body.song;
    const song=new music({name:name,singer:singer, songURL:url ,songImg:image, description:desc});
    await song.save();
    res.redirect('/play');
}))



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message)
        err.message='Something went Wrong';
    res.status(statusCode).render("players/error",{err});

})

app.listen(7000,()=>{
    console.log("Listening on Port 7000");
})


