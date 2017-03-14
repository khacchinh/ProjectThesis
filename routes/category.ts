var express = require('express');
var router = express.Router();

//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/

import { Category } from '../model/Category';

//get all category
router.get('/categorys', (req, res, next) => {
    Category.getAllCategory().then(
        (msg) => {
            res.json(msg);
        }
    )
});


module.exports = router;