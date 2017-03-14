"use strict";
var express = require('express');
var router = express.Router();
//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/
var NewsItem_1 = require("../model/NewsItem");
//get all tasks
router.get('/news', function (req, res, next) {
    NewsItem_1.NewItem.getAllNewItembyCategory(req.param('category')).then(function (msg) {
        res.json(msg);
    });
});
//get all tasks
router.get('/new_item', function (req, res, next) {
    NewsItem_1.NewItem.getSingleItembyID(req.param('id')).then(function (msg) {
        res.json(msg);
    });
});
router.put('/new_item/:id', function (req, res, next) {
    var id = req.params.id;
    var comments = req.body;
    NewsItem_1.NewItem.saveComentForNewItem(id, comments).then(function (msg) {
        res.json(msg);
    });
});
module.exports = router;
