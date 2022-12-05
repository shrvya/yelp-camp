const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate')
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const campground = require('./models/campground');
const morgan=require('morgan')
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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index', { campgrounds })
});
app.get('/campgrounds/new', async (req, res) => {
    
    res.render('new')
});
app.post('/campgrounds/new', async (req, res) => {
    const camp=new Campground(req.body.Campground)
    camp.save().then(()=>{
        console.log("saved")
    }).catch((err)=>{
        console.log(err)
    })
    console.log(req.body)
    res.send(req.body);
    res.redirect(`/campgrounds/:${camp._id}`)
});
app.get('/campgrounds/:id', async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render('show', { campgrounds })
});
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render('edit', { campgrounds })
});
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, req.body.Campground ,{new:true})
   
    res.redirect(`/campgrounds/${campground._id}`)
});
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
});
app.use((req,res)=>{
res.status(400).send("not found")
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
})