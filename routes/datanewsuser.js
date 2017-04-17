"use strict";
var express = require('express');
var router = express.Router();
//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/
var DataNewsUser_1 = require("../model/DataNewsUser");
router.get('/datauserid/:id', function (req, res, next) {
    DataNewsUser_1.DataNewsUser.getDataNewsUserById(req.params.id).then(function (msg) {
        res.json(msg);
    });
});
router.get('/datanewsid/:id', function (req, res, next) {
    DataNewsUser_1.DataNewsUser.getDataNewsById(req.params.id).then(function (msg) {
        res.json(msg);
    });
});
router.post('/adddatausernews', function (req, res, next) {
    var data = req.body;
    DataNewsUser_1.DataNewsUser.addDataNewsUser(data).then(function (msg) {
        res.json(msg);
    });
});
module.exports = router;
