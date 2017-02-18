var express = require('express');
var router = express.Router();

//setup db
/*
var mongojs = require('mongojs');
var db = mongojs('mongodb://khacchinhdev:123@ds151068.mlab.com:51068/mymean2_khacchinhdev', ['tasks']);
*/

var Tasks = require('../model/Tasks');

//get all tasks
router.get('/tasks', function(req, res, next){
    Tasks.find(function(err, tasks){
        if (err){
            res.send(err);
        }
        res.json(tasks);
    });
});

//get single tasks
router.get('/task/:id', function(req, res, next){
    Tasks.findOne({_id: req.params.id},function(err, task){
        if (err){
            res.send(err);
        }
        res.json(task);
    });
});


//save task
router.post('/task', function(req, res, next){
    var task = req.body;
    if (!task.title || !(task.isDone + '')){
        res.status(400);
        res.json({
            "error" : "Bad Data"
        });
    } else {
        var newTask = Tasks({
            title: task.title,
            isDone: task.isDone
        });
        newTask.save(function(err, task){
            if (err){
                res.send(err);
            }
            res.json(task);
        });
    }
});


//delete task
router.delete('/task/:id', function(req, res, next){
    Tasks.remove({_id: req.params.id},function(err, task){
        if (err){
            res.send(err);
        }
        res.json(task);
    });
});

//update tasks
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    Tasks.findById(req.params.id, function(err, uptask){
        if (err){
            res.status(400);
            res.json({
                "error" : "Bad Data"
            });
        } else{
            uptask.title = task.title;
            if (task.isDone) uptask.isDone = task.isDone;
            uptask.save(function(err, task){
                if (err){
                    res.send(err);
                }
                res.json(task);
            });
        }

    });
});


module.exports = router;