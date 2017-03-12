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
    }
});
var UserModel = mongoose.model('users', _schema);
var Users = (function () {
    function Users() {
    }
    Users.findUserLogin = function (user) {
        return new Promise(function (resolve, reject) {
            UserModel.findOne({ username: user.username, password: user.password }, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    return Users;
}());
exports.Users = Users;
