const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const port = 3000;

const app = express();
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot')
.then(() => {
  console.log('MongoDB Connected');
}).catch(err => console.log(err));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Method override middleware.
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
// flash middleware
app.use(flash());
//handlebars middleware.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// routes
app.get('/', (req, res) => {
  title = "Welcome";
  res.render('index', { title: title });
});

app.get('/about', (req, res) => {
  res.render('about');
});

// Load Ideas routes
const ideaRoutes = require('./routes/idea');

//Configure Idea Routes
app.use('/ideas', ideaRoutes);


//server starting
app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
