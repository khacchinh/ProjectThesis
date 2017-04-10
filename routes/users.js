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
//get single user
router.get('/accounts/:id', function (req, res, next) {
    Users_1.Users.getUserById(req.params.id).then(function (msg) {
        res.json(msg);
    });
});
//get single user
router.get('/accounts_exist/:username', function (req, res, next) {
    Users_1.Users.checkExistUser(req.params.username).then(function (msg) {
        res.json(msg);
    });
});
//update user
router.put('/accounts/:id', function (req, res, next) {
    var user = req.body;
    Users_1.Users.updateUser(req.params.id, user).then(function (msg) {
        res.json(msg);
    });
});
//update user
router.post('/account', function (req, res, next) {
    var user = req.body;
    Users_1.Users.addUser(user).then(function (msg) {
        res.json(msg);
    });
});
//deactive user
router.put('/accountdeactive/:id', function (req, res, next) {
    Users_1.Users.deActiveUser(req.params.id).then(function (msg) {
        res.json(msg);
    });
});
module.exports = router;
