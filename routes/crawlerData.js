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
                var title_link = $("title").text();
                /*
                $("#left_calculator").each(function() {
                    //if ($(this).attr('title').length > 50)
                    title_link += $(this).html();
                });
                */
                response.send(title_link);
            }
            done();
        }
    });
    c.queue(["http://vnexpress.vn", "https://www.google.com.vn"]);
});

module.exports = router;
