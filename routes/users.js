"use strict";
var express = require('express');
var router = express.Router();
//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/
var Users_1 = require("../model/Users");
//login
router.post('/authen', function (req, res, next) {
    var user = req.body;
    Users_1.Users.findUserLogin(user).then(function (msg) {
        res.json(msg);
    });
});
//get all user api/users
router.get('/accounts', function (req, res, next) {
    Users_1.Users.getAllUser().then(function (msg) {
        res.json(msg);
    });
});
module.exports = router;
