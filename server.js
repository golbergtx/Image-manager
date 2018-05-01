// express App
const express = require('express');
const app = express();

//modules
const handlebars = require('hbs');
const bodyParser = require('body-parser');
const dataBase = require('./config/mongo.js');
const fs = require('fs');
let db = null;

// custom modules
const User = require('./data/user.js');
const userController = require('./controllers/user.js');

//app config
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

// handlebars config
handlebars.registerPartials(__dirname + '/views/partials');

// custom config
let user = null;

dataBase.connect(function () {
    console.log("Connected successfully to server");
    db = dataBase.getDataBase();
    app.listen(3000, function () {
        console.log('Api app started');
    });
});

// post requests
app.post('/login-check', function (req, res) {
    let userLogin = req.body.login;
    let userPassword = req.body.password;
    let loginSuccessFull = false;

    userController.getUser(db, {'login': userLogin}, function (err, docs) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        if (!!docs[0]) {
            loginSuccessFull = userModule.comparePassword(docs[0].password, userPassword);
        }
        if (loginSuccessFull) {
            user = new User(null, docs[0].firstName ,docs[0].lastName, docs[0].age, docs[0].priority, docs[0].avatarFileName);
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    });
});

// get requests
app.get('/login', function (req, res) {
    res.render("login");
});
app.get('/', function (req, res) {
    res.render("home", {
        userFullName: user.getFullName(),
        userAvatarFileName: user.avatarFileName
    });
});

// Send files
app.get('/user-avatar/:userAvatarFileName', function (req, res) {
    let fileName = req.params.userAvatarFileName;

    let pathAvatar = __dirname + "/media/users/users-avatars/" + fileName;
    let pathAvatarDefault = __dirname + '/media/users/users-avatars/avatar-default.jpg';

    fs.stat(pathAvatar, function (err, stats) {
        if (err) {
            res.sendFile(pathAvatarDefault)
        } else {
            res.sendFile(pathAvatar);
        }
    });
});