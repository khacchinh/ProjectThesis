var express = require('express');
var router = express.Router();

//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/

import { NewItem } from '../model/NewItem';

//get all tasks
router.get('/news', function(req, res, next){
    console.log(req.param('category'));
    console.log(req.param('page'));
    console.log(req.param('limit'));
    NewItem.getAllNewItembyCategory(req.param('category'), req.param('page'), req.param('limit')).then(
        (msg) =>{
            res.json(msg);
        }
    )
});


module.exports = router;