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

exports.comparePassword = function (value1, value2) {
    return value1 === value2;
};