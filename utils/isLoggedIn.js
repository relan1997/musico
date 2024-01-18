const isLoggedIn=async (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error','Please Log In');
        return res.redirect('/login');
    }
    next();
}
module.exports=isLoggedIn;