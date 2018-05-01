const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dataBaseName = 'imageManager';

const state = {
    db: null
};

module.exports.connect = function (callback) {
    if (state.db) {
        return callback();
    }
    MongoClient.connect(url, function (err, client) {
        assert.ifError(err);
        state.db = client.db(dataBaseName);
        //client.close();
        callback();
    });
};

module.exports.getDataBase = function () {
    return state.db
};

