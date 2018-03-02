const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const port = 3000;

const app = express();
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot').then(() => {
  console.log('MongoDB Connected');
}).catch(err => console.log(err));

// Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');
//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handlebars middleware.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// routes
app.get('/', (req, res) => {
  title = "Welcome";
  res.render('index', { title: title });
});
app.get('/ideas', (req, res) => {
  Idea.find({}).sort({date: 'desc'}).then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({ text: "Please add a title" });
  }
  if(!req.body.details){
    errors.push({ text: "Please add some details"});
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };

    new Idea(newUser).save().then(idea => {
      res.redirect('/ideas');
    });
  }
});



//server starting
app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
