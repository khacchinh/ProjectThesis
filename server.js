"use strict";
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
//use compression
var compression = require("compression");
//import routes for app
var index = require("./routes/index");
var tasks = require("./routes/tasks");
var news = require("./routes/news");
var users = require("./routes/users");
var category = require("./routes/category");
//send dictionary to client
var getDictionary = require("./routes/getDictionary");
//mongo db
var mongoose = require("mongoose");
var crawlerData = require("./routes/crawlerData");
var app = express();
app.use(compression());
//set port
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set Static folder
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'asset')));
//set routes
app.use('/', index);
app.use('/api/', tasks);
app.use('/api/', news);
app.use('/api/', users);
app.use('/api/', category);
//call function send dictionary
app.use('/', getDictionary);
//use clawer
app.use('/', crawlerData);
//call class crawler
/*
console.log('Crawler dữ liệu tin tức')
new CrawlerNewsClass().getCrawlerData().then(
    function(msg: boolean){
        console.log('- tách từ dùng vntokenier')
        
        var child = require('child_process').spawn(
            'java', ['-jar', 'WordSegment.jar']
        );
        child.stdout.on('data', function(data) {
            if (data.toString().trim() == "ok"){
            
                new ProcessSimilarNew();
            }
        });

        child.stderr.on("data", function (data) {
            console.log(data.toString());
        });
        
        /*
        var child = require('child_process').spawn(
            'java', ['-jar', 'uetsegmenter.jar', '-r', 'seg', '-m', 'demo', '-i', 'crawler/tokenizer/data/input.txt', '-o','crawler/tokenizer/data/output.txt' ]
        );
        child.stdout.on('data', function(data) {
            console.log(data.toString());
            if (data.toString().length > 30){
                new ProcessSimilarNew();
            }
        });

        child.stderr.on("data", function (data) {
            console.log(data.toString());
        });
        
        //run server test crawler

        app.listen(app.get('port'), function(){
            console.log('Server started on port ' + app.get('port'));
        });
        
        
    }
)

*/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/my_database', function (err) {
    if (err)
        console.log("Can\'t connect to db!!");
    else {
        console.log("Connect to db:  mongodb://localhost/my_database");
        app.listen(app.get('port'), function () {
            console.log('Server started on port ' + app.get('port'));
        });
    }
});
