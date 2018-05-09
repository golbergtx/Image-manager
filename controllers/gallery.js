let ObjectID = require('mongodb').ObjectID;

exports.getGalleryByID = function (db, id, callback) {
    const collection = db.collection("galleries");
    collection.find( {"_id": ObjectID(id)} ).toArray(function (err, docs) {
        callback(err, docs);
    });
};
