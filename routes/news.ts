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

//get all tasks
router.get('/new_item', function(req, res, next){
    NewItem.getSingleItembyID(req.param('id')).then(
        (msg) =>{
            res.json(msg);
        }
    )
});


module.exports = router;