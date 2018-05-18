let ObjectID = require('mongodb').ObjectID;

exports.getGalleryByID = function (db, id, callback) {
    const collection = db.collection("galleries");
    collection.find({"_id": ObjectID(id)}).toArray(function (err, docs) {
        callback(err, docs);
    });
};

exports.updateGalleryByID = function (db, id, newData, callback) {
    const collection = db.collection("galleries");
    collection.updateOne({"_id": ObjectID(id)}, {$set: {"gallery": newData.gallery}}, function (err, docs) {
        callback(err, docs);
    });
};