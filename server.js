"use strict";
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
//use compression
var compression = require("compression");
//import routes for app
var index = require("./routes/index");
var tasks = require("./routes/tasks");
//send dictionary to client
var getDictionary = require("./routes/getDictionary");
//import class crawler
var crawlernewsclass_1 = require("./crawler/crawlernewsclass");
//import class similar cosine
var processsimilarnew_1 = require("./crawler/processsimilarnew");
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
//call function send dictionary
app.use('/', getDictionary);
//use clawer
app.use('/', crawlerData);
//call class crawler
console.log('Crawler dữ liệu tin tức');
new crawlernewsclass_1.CrawlerNewsClass().getCrawlerData().then(function (msg) {
    console.log('- tách từ dùng vntokenier');
    var child = require('child_process').spawn('java', ['-jar', 'WordSegment.jar']);
    child.stdout.on('data', function (data) {
        if (data.toString().trim() == "ok") {
            /*
            * cacular cosine here
            */
            new processsimilarnew_1.ProcessSimilarNew();
        }
    });
    child.stderr.on("data", function (data) {
        console.log(data.toString());
    });
});
//run server test crawler
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});
/*
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/my_database', function(err){
    if (err)
        console.log("Can\'t connect to db!!");
    else{
        console.log("Connect to db:  mongodb://localhost/my_database");
        app.listen(app.get('port'), function(){
            console.log('Server started on port ' + app.get('port'));
        });
    }
});
*/
