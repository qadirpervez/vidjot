const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;

//handlebars middleware.

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// routes
app.get('/', (req, res) => {
  title = "Welcome";
  res.render('index', { title: title });
});

app.get('/about', (req, res) => {
  res.render('about');
});

//server starting
app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
