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
var author = require("./routes/author");
var datanewsuser = require("./routes/datanewsuser");
//send dictionary to client
var getDictionary = require("./routes/getDictionary");
//import class crawler
var crawlernewsclass_1 = require("./crawler/crawlernewsclass");
//import class similar cosine
var processsimilarnew_1 = require("./crawler/processsimilarnew");
var processnews_1 = require("./crawler/processnews");
//mongo db
var mongoose = require("mongoose");
var crawlerData = require("./routes/crawlerData");
var NewsItem_1 = require("./model/NewsItem");
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
app.use('/api/', author);
app.use('/api/', datanewsuser);
//call function send dictionary
app.use('/', getDictionary);
//use clawer
app.use('/', crawlerData);
//
var is_loop_process = true;
function doProcessNews() {
    NewsItem_1.NewItem.getNewsAfterDay(4).then(function (msg) {
        if (msg != "empty") {
            processnews_1.ProcessNews.arOldNews = msg;
        }
        console.log('Crawler dữ liệu tin tức');
        new crawlernewsclass_1.CrawlerNewsClass().getCrawlerData().then(function (msg) {
            processnews_1.ProcessNews.getContent().then(function (msg) {
                processnews_1.ProcessNews.exportFile();
                console.log('- tách từ.....');
                var child = require('child_process').spawn('java', ['-jar', 'WordSegment.jar']);
                child.stdout.on('data', function (data) {
                    if (data.toString().trim() == "ok") {
                        new processsimilarnew_1.ProcessSimilarNew();
                        console.log("- done!!");
                        if (is_loop_process) {
                            setInterval(doProcessNews, 1000 * 60 * 15);
                            is_loop_process = false;
                        }
                    }
                });
                child.stderr.on("data", function (data) {
                    console.log(data.toString());
                });
            });
        });
    });
}
//call class crawler
//doProcessNews();
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
/*
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test_db_news', function(err){
    if (err)
        console.log("Can\'t connect to db!!");
    else{
        console.log("Connect to db:  mongodb://localhost/test_db_news");
        app.listen(app.get('port'), function(){
            console.log('Server started on port ' + app.get('port'));
        });
    }
});
*/
