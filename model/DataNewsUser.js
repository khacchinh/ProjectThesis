"use strict";
var mongoose = require('mongoose');
var _schemaDataNewsUser = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newitems"
    },
    types: {
        type: String
    }
});
var DataNewsUserModel = mongoose.model('savenews', _schemaDataNewsUser);
var DataNewsUser = (function () {
    function DataNewsUser() {
    }
    DataNewsUser.addDataNewsUser = function (data) {
        return new Promise(function (resolve, reject) {
            var saveNewsModel = DataNewsUserModel({
                user: data.user,
                news: data.news,
                types: data.types
            });
            saveNewsModel.save(function (err, user) {
                if (err)
                    reject(false);
                resolve(true);
            });
        });
    };
    DataNewsUser.getDataNewsUserById = function (user_id) {
        return new Promise(function (resolve, reject) {
            DataNewsUserModel.find({
                user: user_id
            })
                .exec(function (err, data) {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    };
    DataNewsUser.getDataNewsById = function (news_id) {
        return new Promise(function (resolve, reject) {
            DataNewsUserModel.find({
                news: news_id
            })
                .exec(function (err, data) {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    };
    DataNewsUser.getDataNewsUserByIdDetail = function (user_id) {
        return new Promise(function (resolve, reject) {
            DataNewsUserModel.find({
                user: user_id
            })
                .populate('news')
                .exec(function (err, data) {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    };
    DataNewsUser.removeDataUser = function (data) {
        return new Promise(function (resolve, reject) {
            DataNewsUserModel.remove(data, function (err, result) {
                if (err)
                    reject(false);
                resolve(true);
            });
        });
    };
    return DataNewsUser;
}());
exports.DataNewsUser = DataNewsUser;
