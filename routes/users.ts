var express = require('express');
var router = express.Router();

//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/

import { Users } from '../model/Users';

//login
router.post('/authen', function(req, res, next){
    var user = req.body;
    Users.findUserLogin(user).then(
        (msg) =>{
            res.json(msg);
        }
    )
});

//get all user api/users
router.get('/accounts', (req, res, next) => {
    Users.getAllUser().then(
        (msg) => {
            res.json(msg);
        }
    )
});

//get single user
router.get('/accounts/:id', function(req, res, next){
    Users.getUserById(req.params.id).then(
        (msg) => {
            res.json(msg);
        }
    )
});

//update user
router.put('/accounts/:id', function(req, res, next){
    var user = req.body;
    Users.updateUser(req.params.id, user).then(
        (msg) => {
            res.json(msg);
        }
    )      
});

//update user
router.post('/account', function(req, res, next){
    var user = req.body;
    Users.addUser(user).then(
        (msg) => {
            res.json(msg);
        }
    )      
});

//deactive user
router.put('/accountdeactive/:id', function(req, res, next){
    Users.deActiveUser(req.params.id).then(
        (msg) => {
            res.json(msg);
        }
    )      
});



module.exports = router;