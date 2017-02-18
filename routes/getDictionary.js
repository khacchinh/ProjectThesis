var express = require('express');
var router = express.Router();

var fs = require('fs');
var Stream = require('stream');
var zlib = require('zlib');

var path = require('path');

router.get('/getDictionary', function(request ,response){
    var convertStream = new Stream.PassThrough();
    fs.readFile(path.join(__dirname, '..', '/asset/vndict_v4.json'), function (err, data) {
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

module.exports = router;