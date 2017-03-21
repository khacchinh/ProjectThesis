"use strict";
var fs = require("fs");
var path = require("path");
var Crawler = require("crawler");
var ProcessNews = (function () {
    function ProcessNews() {
    }
    ProcessNews.prototype.importNew = function (news) {
        if (news.title + '' == "undefined" || news.img + '' == "undefined" || news.url + '' == "undefined" || news.sumary + '' == "undefined" || news.category + '' == "undefined")
            return;
        news.category = news.category.trim().toLowerCase();
        news.author = news.author.trim().toLowerCase();
        ProcessNews.tempArrNews.push(news);
    };
    ProcessNews.getContent = function () {
        var count = 0;
        var p = new Promise(function (resolve, reject) {
            ProcessNews.tempArrNews.forEach(function (element) {
                var c = new Crawler({
                    maxConnections: 1,
                    callback: function (error, res, done) {
                        if (error)
                            reject(false);
                        count++;
                        var $ = res.$;
                        if (element.author == "vnexpress") {
                            $("table").remove();
                            $(".fck_detail").children().last().remove();
                            $(".fck_detail").children('.Normal[style*="text-align:right;"]').remove();
                            var content = $(".fck_detail").text() + '';
                            element.content = content.toString().trim();
                        }
                        else if (element.author == "vccorp.vn") {
                            $("#divNewsContent").children('div').remove();
                            $("#divNewsContent").children().last().remove();
                            $("#divNewsContent").children('p[style*="text-align: right;"]').remove();
                            var content = $("#divNewsContent").text() + '';
                            element.content = content.toString().trim();
                        }
                        else if (element.author == "thanhnien") {
                            $("table").remove();
                            $("#abody").children('div').children('article').remove();
                            $("#abody").children().last().remove();
                            var content = $("#abody").text() + '';
                            element.content = content.toString().trim();
                        }
                        else if (element.author == "vietnamnet news") {
                            $("table").remove();
                            $("br").remove();
                            $("a").remove();
                            $("#ArticleContent").children('div').remove();
                            $("#ArticleContent").children().last().remove();
                            $("#ArticleContent").children().first().remove();
                            var content = $("#ArticleContent").text() + '';
                            element.content = content.toString().trim();
                        }
                        if (count == ProcessNews.tempArrNews.length)
                            resolve(true);
                    }
                });
                c.queue(element.url);
            });
        });
        return p;
    };
    //.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”"…\n\r\t]/g," ")
    ProcessNews.exportFile = function () {
        console.log('Tiền xử lý: ');
        var dataTitle = '';
        console.log('- loại bỏ dấu câu');
        ProcessNews.tempArrNews.forEach(function (element, index) {
            if (element.content || element.content != "" || element.content.length != 0) {
                ProcessNews.arrNews.push(element);
                dataTitle += element.content.replace(/[\n\t\r]/g, " ") + "\n";
            }
        });
        fs.writeFileSync(path.join(__dirname + '/tokenizer/data/input.txt'), dataTitle);
    };
    ProcessNews.prototype.clearPunctuation = function (txt) {
        return txt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”]/g, "");
    };
    return ProcessNews;
}());
ProcessNews.tempArrNews = new Array();
ProcessNews.arrNews = new Array();
exports.ProcessNews = ProcessNews;
