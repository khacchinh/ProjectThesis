import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

//use compression
import * as compression from 'compression';


import * as fs  from 'fs';

//import routes for app
import * as index from './routes/index';
import * as tasks from './routes/tasks';

//send dictionary to client
import * as getDictionary from './routes/getDictionary';

//import class crawler
import { CrawlerNewsClass  } from './crawler/crawlernewsclass';

import { ProcessReduplicateNew } from './crawler/processreduplicatenew';

//mongo db
import * as mongoose from 'mongoose';

import * as crawlerData from './routes/crawlerData';

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

//call function send dictionary
app.use('/', getDictionary);

//use clawer
app.use('/', crawlerData);

//call class crawler
new CrawlerNewsClass().getCralweData().then(
    function(msg: boolean){
        console.log(msg);
        var child = require('child_process').spawn(
            'java', ['-jar', 'WordSegment.jar']
        );
        child.stdout.on('data', function(data) {
            if (data.toString().trim() == "ok"){
                var dataTitle = fs.readFileSync(__dirname + '/crawler/tokenizer/data/output.txt');
                var arrDataTitle = dataTitle.toString().split("\n");
                for (var i = 0; i < arrDataTitle.length; i++){
                    if (arrDataTitle[i].trim() != ''){
                        console.log(ProcessReduplicateNew.thoisunews[i].author);
                        console.log(ProcessReduplicateNew.thoisunews[i].category);
                        console.log(ProcessReduplicateNew.thoisunews[i].title);
                        console.log(arrDataTitle[i]);
                        console.log(ProcessReduplicateNew.thoisunews[i].url);
                        console.log(ProcessReduplicateNew.thoisunews[i].img);
                        console.log(ProcessReduplicateNew.thoisunews[i].sumary);
                        console.log("-----");
                    }
                }
                /*
                *
                *

                */



            }
            
        });

        child.stderr.on("data", function (data) {
            console.log(data.toString());
        });
    }
)

//run server test crawler
/*
app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});
*/

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

