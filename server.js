const express = require('express');
const app = express();

const handlebars = require('hbs');
const bodyParser = require('body-parser');
const dataBase = require('./config/mongo.js');

//app config
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


dataBase.connect(function () {
    console.log("Connected successfully to server");
    app.listen(3000, function () {
        console.log('Api app started');
    });
});

app.post('/login-check', function (req, res) {
    console.log(req.body);
    res.json({ user: 'tobi' });
    //res.send('POST request to homepage');
});

app.get('/', function (req, res) {
  res.render("home");
});

app.get('/login', function (req, res) {
    res.render("login");
});

