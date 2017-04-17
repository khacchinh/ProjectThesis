var express = require('express');
var router = express.Router();

//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/

import { DataNewsUser } from '../model/DataNewsUser';

router.get('/datauserid/:id', (req, res, next) => {
    DataNewsUser.getDataNewsUserById(req.params.id).then(msg => {
        res.json(msg);
    })
});

router.get('/datanewsid/:id', (req, res, next) => {
    DataNewsUser.getDataNewsById(req.params.id).then(msg => {
        res.json(msg);
    })
});

router.post('/adddatausernews', function(req, res, next){
    var data = req.body;
    DataNewsUser.addDataNewsUser(data).then(
        (msg) => {
            res.json(msg);
        }
    )      
});

module.exports = router;