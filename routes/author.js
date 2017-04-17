"use strict";
var express = require('express');
var router = express.Router();
//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/
var Author_1 = require("../model/Author");
//get all Author
router.get('/author', function (req, res, next) {
    Author_1.Author.getAllAuthor().then(function (msg) {
        res.json(msg);
    });
});
//deactive author
router.put('/authordeactive/:id', function (req, res, next) {
    Author_1.Author.deActiveAuthor(req.params.id).then(function (msg) {
        res.json(msg);
    });
});
//onactive author
router.put('/authoronactive/:id', function (req, res, next) {
    Author_1.Author.onActiveAuthor(req.params.id).then(function (msg) {
        res.json(msg);
    });
});
module.exports = router;
