import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

//use compression
import * as compression from 'compression';

//import routes for app
import * as index from './routes/index';
import * as tasks from './routes/tasks';

//send dictionary to client
import * as getDictionary from './routes/getDictionary';

//import class crawler
import * as TestCrawler  from './crawler/testcrawler';
import { CrawlerNewsClass  } from './crawler/CrawlerNewsClass';

//mongo db
import * as mongoose from 'mongoose';

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

//call class crawler
new CrawlerNewsClass();

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
