import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

//use compression
import * as compression from 'compression';


import * as fs  from 'fs';

//import routes for app
import * as index from './routes/index';
import * as tasks from './routes/tasks';
import * as news from './routes/news';
import * as users from './routes/users';
import * as category from './routes/category';
import * as author from './routes/author';
import * as datanewsuser from './routes/datanewsuser';

//send dictionary to client
import * as getDictionary from './routes/getDictionary';

//import class crawler
import { CrawlerNewsClass  } from './crawler/crawlernewsclass';
//import class similar cosine
import { ProcessSimilarNew } from './crawler/processsimilarnew';

import { ProcessNews } from './crawler/processnews';

//mongo db
import * as mongoose from 'mongoose';

import * as crawlerData from './routes/crawlerData';

import { NewItem }  from './model/NewsItem';



var app : express.Application = express();
app.use(compression());

//set port
app.set('port', (process.env.PORT || 3000 ));

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
function doProcessNews(){
    NewItem.getNewsAfterDay(3).then(
        (msg) => {
            if (msg != "empty"){
                ProcessNews.arOldNews = msg;
            }
            console.log('Crawler dữ liệu tin tức')
            new CrawlerNewsClass().getCrawlerData().then(
                function(msg: boolean){
                    
                    ProcessNews.getContent().then(
                        (msg) => {
                            ProcessNews.exportFile();
                            console.log('- tách từ.....');
                            var child = require('child_process').spawn(
                                'java', ['-jar', 'WordSegment.jar']
                            );
                            child.stdout.on('data', function(data) {
                                if (data.toString().trim() == "ok"){
                                    new ProcessSimilarNew();
                                    console.log("- done!!");
                                    if (is_loop_process){
                                        setInterval(doProcessNews, 1000*60*15);
                                        is_loop_process = false;
                                    }

                                }
                            });

                            child.stderr.on("data", function (data) {
                                console.log(data.toString());
                            });
                        }
                    )
                }
            )
        }
    )
}

//call class crawler
//doProcessNews();

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



