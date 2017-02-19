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

                    //new hot
                    title += $(".box_hot_news").children("h1").text().trim() + "\n";
                    title += $(".box_hot_news").children("h1").children("a").attr('href') + "\n";
                    title += $(".box_hot_news").children().first().children().children().attr('src') + "\n";
                    title += $(".box_hot_news").children("h4").text().trim() + "\n\n";

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

                    //new hot
                    title += $('.fl.wid470').children().children().first().attr('title') + "\n";
                    title += 'http://dantri.com.vn/' + $('.fl.wid470').children().children().first().attr('href') + "\n";
                    title += $('.fl.wid470').children().children().first().children().attr('src') + "\n";
                    $('.fl.wid470').children().children(".mr1").children("div").children("a").empty();
                    title += $('.fl.wid470').children().children(".mr1").children("div").text().trim() + "\n\n";

                    $("#listcheckepl").children().each(function(i, element){
                        var data = $(this);
                        var temp = data.children().first().attr('title') + '';
                        if (temp != 'undefined'){
                            title += temp + "\n";
                            title += 'http://dantri.com.vn/' + data.children().first().attr('href') + "\n";
                            title += data.children().first().children().attr('src') + "\n";
                            data.children().last().children("div").children("a").empty();
                            title += data.children().last().children("div").text().trim() + "\n\n";
                        }
                    });
                    title += "\n\n\n\n";
                }
                //crawler news VietNamNet
                else if ($('meta[name=author]').attr("content") == 'VietNamNet News'){
                    title += $('meta[name=author]').attr("content") + "\n";
                    title += $('.CateTitle.left').text() + "\n";

                    //new hot
                    title += $('.TopArticle').children().first().children().attr('title') + "\n";
                    title += 'http://vietnamnet.vn' +$('.TopArticle').children().first().children().attr('href') + "\n";
                    title += $('.TopArticle').children().first().children().children().attr('src') + "\n";
                    title += $('.TopArticle').children().last().text().trim() + "\n\n";
                    //new hot
                    $('.ListHeight.m-t-10').children().each(function(i, element){
                         var data = $(this);
                         title += data.children().first().attr('title') + "\n";
                         title += 'http://vietnamnet.vn' + data.children().first().attr('href') + "\n";
                         title += data.children().first().children().attr('src') + "\n";
                         title += data.children().first().attr('title') + "\n\n";
                     });

                    $('.ListArticle').children().each(function(i, element){
                        var data = $(this);
                        title += data.children().first().attr('title') + "\n";
                        title += 'http://vietnamnet.vn' + data.children().first().attr('href') + "\n";
                        title += data.children().first().children().attr('src') + "\n";
                        title += data.children().last().text().trim() + "\n\n";
                    });
                    title += "\n\n\n\n";
                }
                //crawler news ThanhNien
                else {
                    title += "ThanhNien" + "\n";
                    title += $('.drt-cate').text() + "\n";

                    //new hot
                    title += $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('title') + "\n";
                    title += 'http://thanhnien.vn' + $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('href') + "\n";
                    title += $('.subcate-highlight-ctn.clearfix').children().children().first().children().children().attr('src') + "\n";
                    title += $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('title') + "\n\n";

                    //new hot
                    $('.subcate-highlight.clearfix').children('article').each(function(i, element){
                        var data = $(this);
                        title += data.children().first().children().attr('title') + "\n";
                        title += 'http://thanhnien.vn' +data.children().first().children().attr('href') + "\n";
                        title += data.children().first().children().children().attr('src') + "\n";
                        title += data.children().last().text().trim() + "\n\n";
                    });

                    $('.cate-list').children().each(function(i, element){
                        var data = $(this);
                        title += data.children("figure").children().attr('title') + "\n";
                        title += 'http://thanhnien.vn' +data.children("figure").children().attr('href') + "\n";
                        title += data.children("figure").children().children().attr('src') + "\n";
                        title += data.children().last().text().trim() + "\n\n";
                    });
                    title += "\n\n\n\n";
                }
            }
             if (count == 6){
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
        'http://thanhnien.vn/the-gioi/',
        'http://thanhnien.vn/kinh-doanh/',
        'http://dantri.com.vn/phap-luat.htm'
    ]);
};

module.exports = TestCrawler;