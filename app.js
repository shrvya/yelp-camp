const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport=require('passport')
const LocalStrategy = require('passport-local');
const User=require('./models/user')
const ejsMate=require('ejs-mate')
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const { campgroundSchema, reviewSchema } = require('./schema');

const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');
const user= require('./routes/user');
const ExpressError = require('./utils/ExpressError');
const morgan=require('morgan');
const { nextTick } = require('process');
mongoose.connect('mongodb://localhost:27017/yelp-camp-repo', {
    useNewUrlParser: true,
    
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(morgan('tiny'))
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 ,
        maxAge: 1000 * 60 
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'))
//Flash for success


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash
app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user;//de-serializes the user data
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/',user)
app.use('/', campgrounds);
app.use('/', reviews);
app.get('/', (req, res) => {
    res.render('home')
});
app.all('*',(req,res,next)=>{
    
    next(ExpressError('url not found',404))
})
app.use((err,req,res,next)=>{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
res.status(statusCode ).render('error.ejs',{err})
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
})
