"use strict";
var mongoose = require('mongoose');
var _schemaAuthor = new mongoose.Schema({
    codename: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    url: {
        type: String
    },
    active: {
        type: Number,
        "default": 1
    }
});
var AuthorModel = mongoose.model('authors', _schemaAuthor);
var Author = (function () {
    function Author() {
    }
    Author.getAllAuthor = function () {
        return new Promise(function (resolve, reject) {
            AuthorModel.find(function (err, items) {
                if (err)
                    reject(err);
                resolve(items);
            });
        });
    };
    Author.getAllAuthorActive = function () {
        return new Promise(function (resolve, reject) {
            AuthorModel.find({ active: 1 }, 'codename', function (err, items) {
                if (err)
                    reject(err);
                resolve(items);
            });
        });
    };
    Author.deActiveAuthor = function (id) {
        return new Promise(function (resolve, reject) {
            AuthorModel.findById(id, function (err, upauthor) {
                if (err)
                    reject(err);
                else {
                    upauthor.active = 0;
                    upauthor.save(function (err, user) {
                        if (err)
                            reject(err);
                        resolve(user);
                    });
                }
            });
        });
    };
    Author.onActiveAuthor = function (id) {
        return new Promise(function (resolve, reject) {
            AuthorModel.findById(id, function (err, upauthor) {
                if (err)
                    reject(err);
                else {
                    upauthor.active = 1;
                    upauthor.save(function (err, user) {
                        if (err)
                            reject(err);
                        resolve(user);
                    });
                }
            });
        });
    };
    return Author;
}());
exports.Author = Author;
