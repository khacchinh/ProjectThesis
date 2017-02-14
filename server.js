var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var fs = require('fs');
var Stream = require('stream');
var zlib = require('zlib');

var compression = require("compression");

var index = require('./routes/index');
var tasks = require('./routes/tasks');

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

app.get('/getDictionary', function(request, response) {
    var convertStream = new Stream.PassThrough();
    fs.readFile( __dirname + '/asset/vndict_v4.json', function (err, data) {
        if (err)
            throw err;
        convertStream.write(data);
        convertStream.end();
        var acceptEncoding = request.headers['accept-encoding'];
        if (!acceptEncoding) {
            acceptEncoding = '';
        }
        if (acceptEncoding.match(/\bdeflate\b/)) {
            response.writeHead(200, { 'Content-Encoding': 'deflate' });
            convertStream.pipe(zlib.createDeflate()).pipe(response);
        }
        else if (acceptEncoding.match(/\bgzip\b/)) {
            response.writeHead(200, { 'Content-Encoding': 'gzip' });
            convertStream.pipe(zlib.createGzip()).pipe(response);
        }
        else {
            response.writeHead(200, {});
            convertStream.pipe(response);
        }
    });
});

app.listen(port, function(){
    console.log('Server started on port ' + port);
});