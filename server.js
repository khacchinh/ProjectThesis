var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var compression = require("compression");

var index = require('./routes/index');
var tasks = require('./routes/tasks');


//clawer
var crawlerData = require('./routes/crawlerData');

//dictionary
var getDictionary = require('./routes/getDictionary');

//mongo db
var mongoose = require('mongoose');

//import class crawler
var TestCrawler = require('./crawler/testcrawler.js');

var app = express();

var port = process.env.port || 3000;

/*
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
*/

app.use(compression());
// Set Static folder
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'asset')));

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use('/', index);
app.use('/api/', tasks);

//use clawer
app.use('/', crawlerData);

app.use('/', getDictionary);


//call class crawler
new TestCrawler();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/my_database', function(err){
    if (err) 
        console.log("Can\'t connect to db!!");
    else{
        console.log("Connect to db:  mongodb://localhost/my_database");
        app.listen(port, function(){
            console.log('Server started on port ' + port);
        });
    }
});
