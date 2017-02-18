var Crawler = require('crawler');
var url = require('url');
var fs = require('fs');

var method = TestCrawler.prototype;

function TestCrawler(){
    console.log('Begin Cralwer');
    this.getCralweDataDemo();
}

method.getCralweDataDemo = function(){
    
    var title = '';
    var count = 0;

    var c = new Crawler({
        maxConnections: 10,
        callback: (error, res, done) => {
            count ++;
            if (error)
                console.log(error);
            else {
                var $ = res.$;
                //crawler news VnExpress
                if ($('meta[name=author]').attr("content") == 'VnExpress'){
                    title += $('meta[name=author]').attr("content") + "\n";
                    title += $('.timer_header').text().trim() + "\n";
                    $(".list_news ").children().each(function(i, element){
                        var data = $(this);
                        title += data.children().children().first().text().trim() + "\n"; 
                        title += data.children().children('.thumb').children().attr('href') + "\n"; 
                        title += data.children().children('.thumb').children().children().attr('src') + "\n";
                        title += data.children().children('.news_lead').text().trim() + "\n\n"; 
                    });
                    title += "\n\n\n\n";
                }
                //crawler news DanTri
                else if ($('meta[name=author]').attr("content") == 'VCCorp.vn'){
                    title += $('meta[name=author]').attr("content") + "\n";
                    title += $('meta[name=keywords]').attr("content") + "\n";
                    $("#listcheckepl").children().each(function(i, element){
                        var data = $(this);
                        var temp = data.children().first().attr('title') + '';
                        if (temp != 'undefined'){
                            title += temp + "\n";
                            title += 'http://dantri.com.vn/' + data.children().first().attr('href') + "\n";
                            title += data.children().first().children().attr('src') + "\n";
                            title += data.children().last().children("div").text().trim() + "\n\n";
                        }
                    });
                    title += "\n\n\n\n";
                }
                //crawler news VietNamNet
                else if ($('meta[name=author]').attr("content") == 'VietNamNet News'){
                    title += $('meta[name=author]').attr("content") + "\n";
                    title += $('.CateTitle.left').text() + "\n";
                    $('.ListArticle').children().each(function(i, element){
                        var data = $(this);
                        title += data.children().first().attr('title') + "\n";
                        title += 'http://vietnamnet.vn/' + data.children().first().attr('href') + "\n";
                        title += data.children().first().children().attr('src') + "\n";
                        title += data.children().last().text().trim() + "\n\n";
                    });
                    title += "\n\n\n\n";
                }
                //crawler news ThanhNien
                else {
                    title += "ThanhNien" + "\n";
                    title += $('.drt-cate').text() + "\n";
                    $('.cate-list').children().each(function(i, element){
                        var data = $(this);
                        title += data.children("figure").children().attr('title') + "\n";
                        title += data.children("figure").children().attr('href') + "\n";
                        title += data.children("figure").children().children().attr('src') + "\n";
                        title += data.children().last().text().trim() + "\n\n";
                    });
                    title += "\n\n\n\n";
                }
            }
             if (count == 4){
                fs.writeFile('output.text', title, function(err){
                    if (err) return console.log(err);
                    console.log('File successfully written! - Check your project directory for the output.text file');
                });  
            }
        }
    });
    c.queue([
        'http://vnexpress.net/tin-tuc/the-gioi', 
        'http://dantri.com.vn/the-gioi.htm',
        'http://vietnamnet.vn/vn/the-gioi/',
        'http://thanhnien.vn/the-gioi/'
    ]);
};

module.exports = TestCrawler;