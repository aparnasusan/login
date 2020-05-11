const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport = require('passport');

const User=require('../models/User');
router.get('/login',(req,res)=>res.render('login'));

router.get('/register',(req,res)=>res.render('register'));

//Register Handle
router.post('/register',(req,res)=>{
    const{name,email,password,password2}=req.body;
    let errors=[]

    //check required fields
    if(!name||!email||!password||!password2){
        errors.push({
            mssg:'FIll all fields'
        })
    }

    //Check passwords match
    if(password!=password2){
        errors.push({msg:'Passwords do not match'})
    }

    //Password length
    if(password.length<6){
        errors.push({msg:'password should be at least 6 char'})
    }

    if(errors.length>0){
        res.render('register',{
        errors,name,email,password,password2
        });
    }
    else
    {
        
        //Validation
        User.findOne({email:email}) //emaail is passed as a variable and we have to match it with one in database
        .then(user =>{
            if(user) {      
                errors.push({msg:'Email is already registered '})
                res.render('register',{
                    errors,name,email,password,password2
                    });
            } else{
                    const newUser=new User({
                        name,email,password
                    });
                    //hasing password
                    bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>
                    {
                        if(err)
                        throw err;
                        newUser.password=hash;
                        newUser.save()
                        .then(user=>{
                            req.flash('success_mssg','You are now registered');
                            res.redirect('/users/login');
                        })
                        .catch(err=>console.log(err));
                        
                    }))
                    
            }
        });
    }
});
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
successRedirect:'/dashboard',
failureRedirect:'/users/login',
failureFlash:true
})(req,res,next);
});

router.get('/logout',(req,res)=>{
req.logout();
req.flash('Logged out');
res.redirect('/users/login')
});
module.exports=router;