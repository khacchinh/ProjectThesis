var express = require('express');
var router = express.Router();

//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/

import { Author } from '../model/Author';

//get all Author
router.get('/author', (req, res, next) => {
    Author.getAllAuthor().then(
        (msg) => {
            res.json(msg);
        }
    )
});

//deactive author
router.put('/authordeactive/:id', function(req, res, next){
    Author.deActiveAuthor(req.params.id).then(
        (msg) => {
            res.json(msg);
        }
    )      
});

//onactive author
router.put('/authoronactive/:id', function(req, res, next){
    Author.onActiveAuthor(req.params.id).then(
        (msg) => {
            res.json(msg);
        }
    )      
});


module.exports = router;