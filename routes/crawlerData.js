var express = require('express');
var router = express.Router();

var Crawler = require('crawler');
var url = require('url');

router.get('/getClawer', function(req, response, next){
    var c  = new Crawler({
        maxConnections: 10,
        callback : (error, res, done) =>{
            if (error)
                console.log(error);
            else {
                var $ = res.$;
                response.send($('#left_calculator').children().first().html());
            }
            done();
        }
    });
    c.queue('http://vnexpress.net/tin-tuc/the-gioi/tu-lieu/chi-phi-phuc-vu-dai-gia-dinh-tong-thong-trump-gay-lo-ngai-3543194.html');
});

module.exports = router;
