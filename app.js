const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const app = express();
const flash=require('connect-flash');
const session=require('express-session')
const passport=require('passport');
const db=require('./config/keys').MongoURI; 

require('./config/passport')(passport);
//connct to mongoose
mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log('Mongodb connected')
    )
    .catch((err)=>console.log(err)
    );


app.use(expressLayouts); //to set view engine
app.set('view engine','ejs');

//body-parser
app.use(express.urlencoded({extended:false})); //to get data from form.Extended false allows to you to get data from form with req.body

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  app.use(flash());

  app.use((req,res,next)=>{
      res.locals.success_mssg=req.flash('success');
      res.locals.error_mssg=req.flash('error');
      next();
  })

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT=process.env.PORT||5000;
app.listen(PORT,console.log('server is on '+ PORT));