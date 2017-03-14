"use strict";
var express = require('express');
var router = express.Router();
//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/
var Category_1 = require("../model/Category");
//get all category
router.get('/categorys', function (req, res, next) {
    Category_1.Category.getAllCategory().then(function (msg) {
        res.json(msg);
    });
});
module.exports = router;
