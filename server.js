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
var CrawlerNewsClass_1 = require("./crawler/CrawlerNewsClass");
//mongo db
var mongoose = require("mongoose");
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
//call class crawler
new CrawlerNewsClass_1.CrawlerNewsClass();
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
