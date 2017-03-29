"use strict";
var fs = require("fs");
var path = require("path");
var Crawler = require("crawler");
var Collections = require("typescript-collections");
var ProcessNews = (function () {
    function ProcessNews() {
    }
    ProcessNews.prototype.importNew = function (news) {
        if (news.title + '' == "undefined" || news.img + '' == "undefined" || news.url + '' == "undefined" || news.sumary + '' == "undefined" || news.category + '' == "undefined")
            return;
        if (this.checkExistNews(news.title))
            return;
        news.category = news.category.trim().toLowerCase();
        news.author = news.author.trim().toLowerCase();
        ProcessNews.tempArrNews.push(news);
    };
    ProcessNews.prototype.checkExistNews = function (title) {
        var is_title = false;
        ProcessNews.arOldNews.forEach(function (element) {
            if (element.title.toString().trim().toLowerCase() == title.toString().trim().toLowerCase()) {
                is_title = true;
                return true;
            }
        });
        return is_title;
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
                            var date = $(".block_timer_share").children().first().text();
                            element.date_public = ProcessNews.getDate(date, element.author);
                            element.content = content.toString().trim();
                            ProcessNews.saveFalgNewsItem(element.author, element.category, element.title, element.date_public);
                        }
                        else if (element.author == "vccorp.vn") {
                            $("#divNewsContent").children('div').remove();
                            $("#divNewsContent").children().last().remove();
                            $("#divNewsContent").children('p[style*="text-align: right;"]').remove();
                            var content = $("#divNewsContent").text() + '';
                            element.content = content.toString().trim();
                            var date = $(".box26").children("span").text();
                            element.date_public = ProcessNews.getDate(date, element.author);
                            ProcessNews.saveFalgNewsItem(element.author, element.category, element.title, element.date_public);
                        }
                        else if (element.author == "thanhnien") {
                            $("table").remove();
                            $("#abody").children('div').children('article').remove();
                            $("#abody").children().last().remove();
                            var content = $("#abody").text() + '';
                            element.content = content.toString().trim();
                            $("time").children("span").remove();
                            var date = $("time").text();
                            element.date_public = ProcessNews.getDate(date, element.author);
                            ProcessNews.saveFalgNewsItem(element.author, element.category, element.title, element.date_public);
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
                            var date = $(".ArticleDateTime").children("span").text();
                            element.date_public = ProcessNews.getDate(date, element.author);
                            ProcessNews.saveFalgNewsItem(element.author, element.category, element.title, element.date_public);
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
        console.log('- loại bỏ dấu câu');
        console.log(ProcessNews.tempArrNews.length);
        var dataTitle = '';
        ProcessNews.tempArrNews.forEach(function (element, index) {
            if (element.content.trim().length != 0 && element.date_public != null) {
                ProcessNews.arrNews.push(element);
                dataTitle += element.content.replace(/[\n\t\r]/g, " ") + "\n";
            }
        });
        ProcessNews.tempArrNews.length = 0; //clear all element array
        fs.writeFileSync(path.join(__dirname + '/tokenizer/data/input.txt'), dataTitle);
    };
    ProcessNews.prototype.clearPunctuation = function (txt) {
        return txt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”]/g, "");
    };
    ProcessNews.getDate = function (date, author) {
        date = date.trim().replace(/\xA0/g, ' ');
        if (date == "")
            return null;
        var arrTime = date.split(" ");
        var dateneed = '';
        switch (author) {
            case "vnexpress":
            case "vccorp.vn":
                dateneed = arrTime[2].split("/").reverse().join("-") + " " + arrTime[4] + ":00";
                break;
            case "thanhnien":
                dateneed = arrTime[3].split("/").reverse().join("-") + " " + ProcessNews.convertTime12to24(arrTime[0] + " " + arrTime[1]);
                break;
            case "vietnamnet news":
                dateneed = arrTime[0].split("/").reverse().join("-") + " " + arrTime[2];
                break;
        }
        //date.trim().split(" ")[2].split("/").reverse().join("-") + " " + date.trim().split(" ")[4] + ":00"
        //dan tri  : Thứ Bảy, 25/03/2017 - 21:12
        //vnexpress: Thứ bảy, 25/3/2017 | 23:10 GMT+7
        //thanhnien: 06:27 AM - 25/03/2017 
        //vietnamnet: 25/03/2017  15:40 GMT+7
        return new Date(dateneed);
    };
    ProcessNews.convertTime12to24 = function (time12h) {
        var _a = time12h.split(' '), time = _a[0], modifier = _a[1];
        var _b = time.split(':'), hours = _b[0], minutes = _b[1];
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return hours + ':' + minutes;
    };
    ProcessNews.saveFalgNewsItem = function (author, category, title, date) {
        var key = author + "-" + category;
        if (date != null) {
            if (ProcessNews.arFlagTime.getValue(key)) {
                var flagDate = ProcessNews.arFlagTime.getValue(key).getTime() < date.getTime() ? date : ProcessNews.arFlagTime.getValue(key);
                if (flagDate == date) {
                    ProcessNews.arFlagTitle.setValue(key, title);
                    ProcessNews.arFlagTime.setValue(key, date);
                }
            }
            else {
                ProcessNews.arFlagTime.setValue(key, date);
                ProcessNews.arFlagTitle.setValue(key, title);
            }
        }
    };
    return ProcessNews;
}());
ProcessNews.tempArrNews = new Array();
ProcessNews.arrNews = new Array();
ProcessNews.arOldNews = new Array();
ProcessNews.arFlagTime = new Collections.Dictionary();
ProcessNews.arFlagTitle = new Collections.Dictionary();
exports.ProcessNews = ProcessNews;
