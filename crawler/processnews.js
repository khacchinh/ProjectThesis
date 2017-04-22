"use strict";
var fs = require("fs");
var path = require("path");
var Crawler = require("crawler");
var Collections = require("typescript-collections");
var ProcessNews = (function () {
    function ProcessNews() {
        this.count = 0;
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
                            $("a").not(".tag_item").remove();
                            $("em").remove();
                            $(".fck_detail").children("div").remove();
                            $(".fck_detail").children().last().remove();
                            $(".fck_detail").children('.Normal[style*="text-align:right;"]').remove();
                            var tags_1 = "";
                            $(".tag_item").each(function (i, element) {
                                var data = $(this);
                                tags_1 += data.attr('title') + ",";
                            });
                            var content = $(".fck_detail").text();
                            var date = $(".block_timer_share").children().first().text();
                            element.date_public = ProcessNews.getDate(date, element.author, element.category);
                            element.content = content.toString().trim();
                            element.tags = tags_1;
                            ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                        }
                        else if (element.author == "dantri") {
                            var tags = $(".news-tags-item").text();
                            $("#divNewsContent").children().last().remove();
                            $("#divNewsContent").children('p[style*="text-align: right;"]').remove();
                            $("#divNewsContent").children('div').remove();
                            var content = $("#divNewsContent").text();
                            var date = $(".box26").children("span").text();
                            element.content = content.toString().trim();
                            element.date_public = ProcessNews.getDate(date, element.author, element.category);
                            element.tags = tags;
                            ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                        }
                        else if (element.author == "thanhnien") {
                            $("table").remove();
                            $("#abody").children('div').children('article').remove();
                            $("#abody").children().last().remove();
                            $("#abody").children('p[style*="text-align: right;"]').remove();
                            $("time").children("span").remove();
                            $(".tags").children().first().remove();
                            var content = $("#abody").text();
                            var date = $("time").text();
                            var tags_2 = '';
                            $(".tags").children().each(function (i, element) {
                                var data = $(this);
                                tags_2 += data.text().trim() + ",";
                            });
                            element.content = content.toString().trim();
                            element.date_public = ProcessNews.getDate(date, element.author, element.category);
                            element.tags = tags_2;
                            ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                        }
                        else if (element.author == "vietnamnet news") {
                            $("div.inner-article").remove();
                            $("#ArticleContent div").remove();
                            $("#ArticleContent p iframe").remove();
                            $("table").remove();
                            $("#ArticleContent").children().first().remove();
                            $("#ArticleContent").children().last().remove();
                            $(".tagBoxContent").children().children().first().remove();
                            var date = $(".ArticleDateTime").children("span").text();
                            var content = $("#ArticleContent").text();
                            var tags_3 = "";
                            $(".tagBoxContent").children().children().each(function (i, element) {
                                var data = $(this);
                                tags_3 += data.text().trim() + ",";
                            });
                            element.tags = tags_3;
                            element.content = content.toString().trim();
                            element.date_public = ProcessNews.getDate(date, element.author, element.category);
                            ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                        }
                        else if (element.author == "zing") {
                            $(".the-article-body table").remove();
                            $(".the-article-body").children("div").remove();
                            $(".the-article-body").children("figure").remove();
                            $(".the-article-body").children("script").remove();
                            var content = $(".the-article-body").text();
                            var date = $('.the-article-publish').text();
                            var tags_4 = "";
                            $(".the-article-tags").children().each(function (i, element) {
                                var data = $(this);
                                tags_4 += data.text().trim() + ",";
                            });
                            element.tags = tags_4;
                            element.content = content;
                            element.date_public = ProcessNews.getDate(date, element.author, element.category);
                            ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                        }
                        else if (element.author == "tintuc") {
                            $("figure").remove();
                            $("table").remove();
                            $("#articleContent div").remove();
                            $("#articleContent p[style*='text-align: center;']").remove();
                            $(".article-tags").children().children().first().remove();
                            var content = $("#articleContent").text();
                            var date = $(".publish-date").children().text();
                            var tags_5 = "";
                            $(".article-tags").children().children().each(function (i, element) {
                                var data = $(this);
                                tags_5 += data.text().trim() + ",";
                            });
                            element.content = content;
                            element.date_public = ProcessNews.getDate(date, element.author, element.category);
                            ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
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
    ProcessNews.exportFile = function () {
        console.log('Tiền xử lý: ');
        console.log('- loại bỏ dấu câu');
        console.log(ProcessNews.tempArrNews.length);
        var dataTitle = '';
        ProcessNews.tempArrNews.forEach(function (element, index) {
            element.content = element.content + '';
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
    ProcessNews.getDate = function (date, author, category) {
        var key = author + "-" + category;
        date = date.trim().replace(/\xA0/g, ' ');
        var arrTime = date.split(" ");
        var dateneed;
        if (date == "")
            dateneed = null;
        else {
            switch (author) {
                case "vnexpress":
                case "dantri":
                    dateneed = arrTime[2].split("/").reverse().join("-") + " " + arrTime[4] + ":00";
                    break;
                case "thanhnien":
                    dateneed = arrTime[3].split("/").reverse().join("-") + " " + ProcessNews.convertTime12to24(arrTime[0] + " " + arrTime[1]);
                    break;
                case "vietnamnet news":
                    dateneed = arrTime[0].split("/").reverse().join("-") + " " + arrTime[2];
                    break;
                case "zing":
                    dateneed = arrTime[1].split("/").reverse().join("-") + " " + arrTime[0];
                    break;
                case "tintuc":
                    if (arrTime.length <= 2)
                        dateneed = null;
                    else
                        dateneed = arrTime[2].split("/").join("-") + "  " + arrTime[0] + ":00";
                    break;
            }
        }
        if (dateneed == null)
            return dateneed;
        dateneed = new Date(dateneed);
        if (ProcessNews.saveFlagTime.getValue(key)) {
            if (ProcessNews.saveFlagTime.getValue(key).getTime() > dateneed.getTime())
                return null;
        }
        return dateneed;
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
    ProcessNews.saveFlagNewsItem = function (author, category, title, date) {
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
ProcessNews.saveFlagTime = new Collections.Dictionary();
exports.ProcessNews = ProcessNews;
