"use strict";
var Crawler = require("crawler");
var News_1 = require("./News");
var processnews_1 = require("./processnews");
//var bmm = new BMMWordSegment();
var CrawlerNewsClass = (function () {
    function CrawlerNewsClass() {
        //this.getCralweData();
        //NewItem.getNearestNew("vnexpress", "thế giới");
    }
    CrawlerNewsClass.prototype.getCrawlerData = function () {
        var p = new Promise(function (resolve, reject) {
            var title = '';
            var count = 0;
            var processNews = new processnews_1.ProcessNews();
            var c = new Crawler({
                maxConnections: 27,
                callback: function (error, res, done) {
                    count++;
                    if (error) {
                        console.log(error);
                        reject(false);
                    }
                    else {
                        var $ = res.$;
                        //crawler news VnExpress
                        if ($('meta[name=author]').attr("content") == 'VnExpress') {
                            var news = new News_1.News();
                            var author = $('meta[name=author]').attr("content").toString();
                            var category = $('.timer_header').text().trim();
                            news.author = author;
                            news.category = category;
                            //new hot
                            news.title = $(".box_hot_news").children("h1").text().trim();
                            news.url = $(".box_hot_news").children("h1").children("a").attr('href');
                            news.img = $(".box_hot_news").children().first().children().children().attr('src');
                            news.type_img = true;
                            news.sumary = $(".box_hot_news").children("h4").text().trim();
                            processNews.importNew(news);
                            $(".list_news ").children().each(function (i, element) {
                                var data = $(this);
                                news = new News_1.News();
                                news.author = author;
                                news.category = category;
                                news.title = data.children().children().first().text().trim();
                                news.url = data.children().children('.thumb').children().attr('href');
                                news.img = data.children().children('.thumb').children().children().attr('src');
                                news.sumary = data.children().children('.news_lead').text().trim();
                                processNews.importNew(news);
                            });
                        }
                        else if ($('meta[name=author]').attr("content") == 'VCCorp.vn') {
                            var news = new News_1.News();
                            var author = $('meta[name=author]').attr("content");
                            var categorys = $('meta[name=keywords]').attr("content");
                            news.author = author;
                            var category = categorys.toString().split(",")[0];
                            news.category = category;
                            //new hot
                            news.title = $('.fl.wid470').children().children().first().attr('title');
                            news.url = 'http://dantri.com.vn/' + $('.fl.wid470').children().children().first().attr('href');
                            news.img = $('.fl.wid470').children().children().first().children().attr('src');
                            $('.fl.wid470').children().children(".mr1").children("div").children("a").empty();
                            news.sumary = $('.fl.wid470').children().children(".mr1").children("div").text().trim();
                            processNews.importNew(news);
                            $("#listcheckepl").children().each(function (i, element) {
                                var data = $(this);
                                var temp = data.children().first().attr('title') + '';
                                if (temp != 'undefined') {
                                    news = new News_1.News();
                                    news.author = author;
                                    news.category = category;
                                    news.title = temp;
                                    news.url = 'http://dantri.com.vn/' + data.children().first().attr('href');
                                    news.img = data.children().first().children().attr('src');
                                    data.children().last().children("div").children("a").empty();
                                    news.sumary = data.children().last().children("div").text().trim();
                                    processNews.importNew(news);
                                }
                            });
                        }
                        else if ($('meta[name=author]').attr("content") == 'VietNamNet News') {
                            var news = new News_1.News();
                            var author = $('meta[name=author]').attr("content");
                            var category = $('.CateTitle.left').text();
                            news.author = author;
                            news.category = category;
                            //new hot
                            news.title = $('.TopArticle').children().first().children().attr('title');
                            news.url = 'http://vietnamnet.vn' + $('.TopArticle').children().first().children().attr('href');
                            news.img = $('.TopArticle').children().first().children().children().attr('src');
                            news.sumary = $('.TopArticle').children().last().text().trim();
                            processNews.importNew(news);
                            //new hot
                            $('.ListHeight.m-t-10').children().each(function (i, element) {
                                var data = $(this);
                                news = new News_1.News();
                                news.author = author;
                                news.category = category;
                                news.title = data.children().first().attr('title');
                                news.url = 'http://vietnamnet.vn' + data.children().first().attr('href');
                                news.img = data.children().first().children().attr('src');
                                news.sumary = data.children().first().attr('title');
                                processNews.importNew(news);
                            });
                            $('.ListArticle').children().each(function (i, element) {
                                var data = $(this);
                                news = new News_1.News();
                                news.author = author;
                                news.category = category;
                                news.title = data.children().first().attr('title');
                                news.url = 'http://vietnamnet.vn' + data.children().first().attr('href');
                                news.img = data.children().first().children().attr('src');
                                news.sumary = data.children().last().text().trim();
                                processNews.importNew(news);
                            });
                        }
                        else {
                            var news = new News_1.News();
                            var author = "ThanhNien";
                            var category = $('.drt-cate').text();
                            news.author = author;
                            news.category = category;
                            //new hot
                            news.title = $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('title');
                            news.url = 'http://thanhnien.vn' + $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('href');
                            news.img = $('.subcate-highlight-ctn.clearfix').children().children().first().children().children().attr('src');
                            news.sumary = $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('title');
                            processNews.importNew(news);
                            ;
                            //new hot
                            $('.subcate-highlight.clearfix').children('article').each(function (i, element) {
                                var data = $(this);
                                news = new News_1.News();
                                news.author = author;
                                news.category = category;
                                news.title = data.children().first().children().attr('title');
                                news.url = 'http://thanhnien.vn' + data.children().first().children().attr('href');
                                news.img = data.children().first().children().children().attr('src');
                                news.sumary = data.children().last().text().trim();
                                processNews.importNew(news);
                            });
                            $('.cate-list').children().each(function (i, element) {
                                var data = $(this);
                                news = new News_1.News();
                                news.author = author;
                                news.category = category;
                                news.title = data.children("figure").children().attr('title');
                                news.url = 'http://thanhnien.vn' + data.children("figure").children().attr('href');
                                news.img = data.children("figure").children().children().attr('src');
                                news.sumary = data.children().last().text().trim();
                                processNews.importNew(news);
                            });
                        }
                    }
                    if (count == 27) {
                        resolve(true);
                    }
                }
            });
            c.queue([
                //thế giới
                'http://vnexpress.net/tin-tuc/the-gioi',
                'http://dantri.com.vn/the-gioi.htm',
                'http://vietnamnet.vn/vn/the-gioi/',
                'http://thanhnien.vn/the-gioi/',
                //kinh doanh
                'http://kinhdoanh.vnexpress.net/',
                'http://dantri.com.vn/kinh-doanh.htm',
                'http://vietnamnet.vn/vn/kinh-doanh/',
                'http://thanhnien.vn/kinh-doanh/',
                //thể thao
                'http://thethao.vnexpress.net/',
                'http://dantri.com.vn/the-thao.htm',
                'http://vietnamnet.vn/vn/the-thao/',
                'http://thethao.thanhnien.vn/',
                //công nghệ
                'http://sohoa.vnexpress.net/',
                'http://dantri.com.vn/suc-manh-so.htm',
                'http://vietnamnet.vn/vn/cong-nghe/',
                'http://thanhnien.vn/cong-nghe/',
                //sức khỏe
                'http://suckhoe.vnexpress.net/',
                'http://dantri.com.vn/suc-khoe.htm',
                'http://vietnamnet.vn/vn/suc-khoe/',
                'http://thanhnien.vn/suc-khoe/',
                //pháp luật
                'http://vnexpress.net/tin-tuc/phap-luat',
                'http://dantri.com.vn/phap-luat.htm',
                'http://vietnamnet.vn/vn/phap-luat/',
                //thời sự
                'http://vnexpress.net/tin-tuc/thoi-su',
                'http://dantri.com.vn/su-kien.htm',
                'http://vietnamnet.vn/vn/thoi-su/',
                'http://thanhnien.vn/thoi-su/'
            ]);
        });
        return p;
    };
    return CrawlerNewsClass;
}());
exports.CrawlerNewsClass = CrawlerNewsClass;
