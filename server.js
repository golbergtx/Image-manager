// express App
const express = require('express');
const app = express();

//modules
const multer = require('multer');
const handlebars = require('hbs');
const bodyParser = require('body-parser');
const dataBase = require('./config/mongo.js');
const fs = require('fs');
let db = null;

// custom modules
const User = require('./data/user.js');
const userController = require('./controllers/user.js');
const galleryController = require('./controllers/gallery.js');

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
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './media/images/' + user.userID);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
let uploadImages = multer({storage: storage}).array('new-images', 30); // for parsing multipart/form-data

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
            loginSuccessFull = userController.comparePassword(docs[0].password, userPassword);
        }
        if (loginSuccessFull) {
            user = new User(docs[0]._id, docs[0].firstName, docs[0].lastName, docs[0].age, docs[0].priority, docs[0].avatarFileName);
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    });
});
app.post('/get-gallery-data', function (req, res) {
    let userID;
    userID = user ? user.userID : null;

    galleryController.getGalleryByID(db, userID, function (err, docs) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        res.status(200).json(docs[0]);
    });
});
app.post('/save-gallery-data', function (req, res) {
    let userID, newData;
    userID = user ? user.userID : null;
    newData = req.body;

    galleryController.updateGalleryByID(db, userID, newData, function (err, docs) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        res.status(200).end();
    });
});
app.post('/upload-new-images', function (req, res) {
    uploadImages(req, res, function (err) {
        if (err) {
            return res.status(501).end();
        }

        let fileNames = [];

        req.files.forEach(function (item) {
            fileNames.push(item.filename)
        });

        res.status(200).json(fileNames);
    });
});

// middleware
app.use('/', function (req, res, next) {
    if (req.path === "/login") {
        if (user) {
            res.redirect("/");
        } else {
            next();
        }
    } else {
        if (!user) {
            console.warn("User unauthorized");
            res.redirect("/login");
        } else {
            next();
        }
    }
});

// get requests
app.get('/login', function (req, res) {
    res.render("login");
});
app.get('/log-out', function (req, res) {
    user = null;
    res.redirect("/login");
});
app.get('/', function (req, res) {
    res.render("home", {
        userFullName: user.getFullName(),
        userAvatarFileName: user.avatarFileName
    });
});
app.get('/categories', function (req, res) {
    res.render("categories", {
        userFullName: user.getFullName(),
        userAvatarFileName: user.avatarFileName
    });
});
app.get('/profile', function (req, res) {
    res.render("profile", {
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
app.get('/images/:userID/:fileName', function (req, res) {
    let userID = req.params.userID;
    let fileName = req.params.fileName;

    let pathImage = __dirname + `/media/images/${userID}/${fileName}`;
    let pathImageDefault = __dirname + '/media/users/users-avatars/default-image.jpg';

    fs.stat(pathImage, function (err, stats) {
        if (err) {
            res.sendFile(pathImageDefault)
        } else {
            res.sendFile(pathImage);
        }
    });
});