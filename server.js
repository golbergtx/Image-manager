const express = require('express');
const app = express();

const handlebars = require('hbs');
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render("home");
});

app.listen(3000, function () {
  console.log('App started');
}); 
