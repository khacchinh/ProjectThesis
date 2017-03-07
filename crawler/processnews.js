"use strict";
var fs = require("fs");
var path = require("path");
var ProcessNews = (function () {
    function ProcessNews() {
        /*
        ProcessNews.arrNews.push(this.thoigioinews);
        ProcessNews.arrNews.push(this.kinhdoanhnews);
        ProcessNews.arrNews.push(this.thethaonews);
        ProcessNews.arrNews.push(this.congnghenews);
        ProcessNews.arrNews.push(this.suckhoenews);
        ProcessNews.arrNews.push(this.phapluatnews);
        ProcessNews.arrNews.push(this.thoisunews);
        */
    }
    ProcessNews.prototype.importNew = function (news) {
        if (news.title + '' == "undefined" || news.img + '' == "undefined" || news.url + '' == "undefined" || news.sumary + '' == "undefined" || news.category + '' == "undefined")
            return;
        /*
        if (news.category.toLowerCase() == 'thế giới'){
            this.importNewByCategory(news, this.thoigioinews);
        }
        else if (news.category.toLowerCase() == 'kinh doanh' || news.category.toLowerCase() == 'tài chính'){
            this.importNewByCategory(news, this.kinhdoanhnews);
        }
        else if (news.category.toLowerCase() == 'thể thao' || news.category.toLowerCase() == 'bóng đá'){
            this.importNewByCategory(news, this.thethaonews);
        }
        else if (news.category.toLowerCase() == 'số hóa' || news.category.toLowerCase() == 'công nghệ' || news.category.toLowerCase() == 'dân trí'){
            this.importNewByCategory(news, this.congnghenews);
        }
        else if (news.category.toLowerCase() == 'sức khỏe'){
            this.importNewByCategory(news, this.suckhoenews);
        }
        else if (news.category.toLowerCase() == 'pháp luật' || news.category.toLowerCase() == 'hình sự'){
            this.importNewByCategory(news, this.phapluatnews);
        }
        else if (news.category.toLowerCase() == 'thời sự' || news.category.toLowerCase() == 'tin nhanh'){
            this.importNewByCategory(news, this.thoisunews);
        }
        */
        news.category = news.category.trim().toLowerCase();
        news.author = news.author.trim().toLowerCase();
        ProcessNews.arrNews.push(news);
    };
    ProcessNews.prototype.importNewByCategory = function (news, arrNew) {
        arrNew.push(news);
    };
    ProcessNews.prototype.exportFile = function () {
        console.log(ProcessNews.arrNews.length);
        console.log('Tiền xử lý: ');
        var dataTitle = '';
        console.log('- loại bỏ dấu câu');
        ProcessNews.arrNews.forEach(function (element) {
            dataTitle += element.title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”"…\n\r]/g, " ") + "\n";
        });
        fs.writeFileSync(path.join(__dirname + '/tokenizer/data/input.txt'), dataTitle);
        /*
        console.log("The gioi: " + this.thoigioinews.length);
        console.log("Kinh doanh: " + this.kinhdoanhnews.length);
        console.log("The thao: " + this.thethaonews.length);
        console.log("Cong nghe: " + this.congnghenews.length);
        console.log("Suc khỏe: " + this.suckhoenews.length);
        console.log("Phap luat: " + this.phapluatnews.length);
        console.log("Thoi su: " + this.thoisunews.length);
        */
    };
    ProcessNews.prototype.clearPunctuation = function (txt) {
        return txt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”]/g, "");
    };
    return ProcessNews;
}());
/*
private thoigioinews = new Array<News>();
private kinhdoanhnews = new Array<News>();
private thethaonews = new Array<News>();
private congnghenews = new Array<News>();
private suckhoenews = new Array<News>();
private phapluatnews = new Array<News>();
private thoisunews = new Array<News>();
*/
ProcessNews.arrNews = new Array();
exports.ProcessNews = ProcessNews;
