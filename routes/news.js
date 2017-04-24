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
//get new hot
router.get('/news_hot', function (req, res, next) {
    NewsItem_1.NewItem.getHotNew().then(function (msg) {
        res.json(msg);
    });
});
//get new popular
router.get('/news_popular', function (req, res, next) {
    NewsItem_1.NewItem.getPopularNews().then(function (msg) {
        res.json(msg);
    });
});
//get new comment
router.get('/news_comment', function (req, res, next) {
    NewsItem_1.NewItem.getCommentNews().then(function (msg) {
        res.json(msg);
    });
});
//search
router.get('/news_search', function (req, res, next) {
    NewsItem_1.NewItem.getAllNewItemBySearch(req.param('search_title')).then(function (msg) {
        res.json(msg);
    });
});
//search
router.post('/news_search_params', function (req, res, next) {
    var params = req.body;
    NewsItem_1.NewItem.getAllNewItemBySearchParams(params).then(function (msg) {
        res.json(msg);
    });
});
//get all tasks
router.get('/new_item', function (req, res, next) {
    NewsItem_1.NewItem.getSingleItembyID(req.param('id')).then(function (msg) {
        res.json(msg);
    });
});
//delete news
router["delete"]('/news_delete/:id', function (req, res, next) {
    NewsItem_1.NewItem.delNewsById(req.params.id).then(function (msg) {
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
router.post('/new_relative', function (req, res, next) {
    var data = req.body;
    NewsItem_1.NewItem.getNewsRelative(data).then(function (msg) {
        res.json(msg);
    });
});
module.exports = router;
