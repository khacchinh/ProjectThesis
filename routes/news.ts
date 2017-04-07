var express = require('express');
var router = express.Router();

//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/

import { NewItem } from '../model/NewsItem';

//get all tasks
router.get('/news', function(req, res, next){
    NewItem.getAllNewItembyCategory(req.param('category')).then(
        (msg) =>{
            res.json(msg);
        }
    )
});

//search
router.get('/news_search', function(req, res, next){
    NewItem.getAllNewItemBySearch(req.param('search_title')).then(
        (msg) =>{
            res.json(msg);
        }
    )
});

//get all tasks
router.get('/new_item', function(req, res, next){
    NewItem.getSingleItembyID(req.param('id')).then(
        (msg) =>{
            res.json(msg);
        }
    )
});

router.put('/new_item/:id', (req, res, next) => {
    var id = req.params.id;
    var comments = req.body;
    NewItem.saveComentForNewItem(id, comments).then(
        (msg) => {
            res.json(msg);
        }
    )
});


module.exports = router;