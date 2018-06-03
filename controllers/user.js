let ObjectID = require('mongodb').ObjectID;

exports.getUsers = function (db, callback) {
    const collection = db.collection("users");
    collection.find({}).toArray(function (err, docs) {
        callback(err, docs);
    });
};
exports.getUser = function (db, filter, callback) {
    const collection = db.collection("users");
    collection.find(filter).toArray(function (err, docs) {
        callback(err, docs);
    });
};
exports.addUser = function (db, data, callback) {
    const collection = db.collection("users");
    collection.insertOne(data, function (err, docs) {
        callback(err, docs);
    });
};
exports.updateUserByID = function (db, id, newData, callback) {
    const collection = db.collection("users");
    collection.updateOne({"_id": ObjectID(id)}, {
        $set: {
            "login": newData.login,
            "firstName": newData.firstName,
            "lastName": newData.lastName,
            "age": newData.age,
            "avatarFileName": newData.avatarFileName
        }
    }, function (err, docs) {
        callback(err, docs);
    });
};
exports.comparePassword = function (value1, value2) {
    return value1 === value2;
};