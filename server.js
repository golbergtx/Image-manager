const express = require('express');
const app = express();

const handlebars = require('hbs');
const bodyParser = require('body-parser');
const dataBase = require('./config/mongo.js');

//app config
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


dataBase.connect(function () {
    console.log("Connected successfully to server");
    app.listen(3000, function () {
        console.log('Api app started');
    });
});

app.get('/', function (req, res) {
  res.render("home");
});
