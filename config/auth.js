module.exports={
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_mssg','You must be logged in ');
        res.redirect('/users/login')
    }
}