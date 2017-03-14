"use strict";
var mongoose = require('mongoose');
var _schemaCategory = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    active: {
        type: Number,
        "default": 1
    }
});
var CategoryModel = mongoose.model('categorys', _schemaCategory);
var Category = (function () {
    function Category() {
    }
    Category.getAllCategory = function () {
        return new Promise(function (resolve, reject) {
            CategoryModel.find(function (err, items) {
                if (err)
                    reject(err);
                resolve(items);
            });
        });
    };
    return Category;
}());
exports.Category = Category;
