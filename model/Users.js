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
    },
    active: {
        type: Number,
        "default": 1
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
                arFilter = { username: user.username, password: user.password, access: user.access, active: 1 };
            else
                arFilter = { username: user.username, password: user.password, active: 1 };
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
    Users.getUserById = function (id) {
        return new Promise(function (resolve, reject) {
            UserModel.findOne({ _id: id }, function (err, users) {
                if (err)
                    reject(err);
                resolve(users);
            });
        });
    };
    Users.updateUser = function (id, user) {
        return new Promise(function (resolve, reject) {
            UserModel.findById(id, function (err, upuser) {
                if (err)
                    reject(err);
                else {
                    upuser.username = user.username;
                    upuser.password = user.password;
                    upuser.name = user.name;
                    upuser.email = user.email;
                    upuser.access = user.access;
                    upuser.active = user.active;
                    upuser.save(function (err, user) {
                        if (err)
                            reject(err);
                        resolve(user);
                    });
                }
            });
        });
    };
    Users.addUser = function (user) {
        return new Promise(function (resolve, reject) {
            var userModel = UserModel({
                username: user.username,
                password: user.password,
                name: user.name,
                email: user.email,
                access: user.access
            });
            userModel.save(function (err, user) {
                if (err)
                    reject(err);
                resolve(user);
            });
        });
    };
    Users.deActiveUser = function (id) {
        return new Promise(function (resolve, reject) {
            UserModel.findById(id, function (err, upuser) {
                if (err)
                    reject(err);
                else {
                    upuser.active = 0;
                    upuser.save(function (err, user) {
                        if (err)
                            reject(err);
                        resolve(user);
                    });
                }
            });
        });
    };
    return Users;
}());
exports.Users = Users;
