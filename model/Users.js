"use strict";
var mongoose = require('mongoose');
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    access: {
        type: Number,
        "default": 0
    }
});
var UserModel = mongoose.model('users', _schema);
var Users = (function () {
    function Users() {
    }
    Users.findUserLogin = function (user) {
        return new Promise(function (resolve, reject) {
            var arFilter;
            if (user.access == 1)
                arFilter = { username: user.username, password: user.password, access: user.access };
            else
                arFilter = { username: user.username, password: user.password };
            UserModel.findOne(arFilter, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    Users.getAllUser = function () {
        return new Promise(function (resolve, reject) {
            UserModel.find(function (err, users) {
                if (err)
                    reject(err);
                resolve(users);
            });
        });
    };
    return Users;
}());
exports.Users = Users;
