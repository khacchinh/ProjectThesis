"use strict";
var fs = require("fs");
var processnews_1 = require("./processnews");
var NewItem_1 = require("../model/NewItem");
var ProcessSimilarNew = (function () {
    function ProcessSimilarNew() {
        this.thoigioinews = new Array();
        this.kinhdoanhnews = new Array();
        this.thethaonews = new Array();
        this.congnghenews = new Array();
        this.suckhoenews = new Array();
        this.phapluatnews = new Array();
        this.thoisunews = new Array();
        this.arrstopword = new Array();
        this.funcMainCacularSimilar();
    }
    ProcessSimilarNew.prototype.funcMainCacularSimilar = function () {
        //load stop word
        console.log('- load stop word');
        var stopword = fs.readFileSync(__dirname + '/tokenizer/data/stopword.txt');
        this.arrstopword = stopword.toString().split(/\r?\n/);
        //load title segment
        console.log('- load title segment');
        var dataTitle = fs.readFileSync(__dirname + '/tokenizer/data/output.txt');
        var arrDataTitle = dataTitle.toString().split("\n");
        //process
        console.log('- remove stop word and save title segment');
        for (var i = 0; i < processnews_1.ProcessNews.arrNews.length; i++) {
            //console.log(arrDataTitle[i]);
            this.funcDivideNews(processnews_1.ProcessNews.arrNews[i], arrDataTitle[i]);
        }
    };
    ProcessSimilarNew.prototype.funcDivideNews = function (news, title_segment) {
        title_segment = title_segment.toLowerCase();
        if (news.category.toLowerCase() == 'thế giới') {
            this.funcImportNewByCategory(news, this.thoigioinews, title_segment);
        }
        else if (news.category.toLowerCase() == 'kinh doanh' || news.category.toLowerCase() == 'tài chính') {
            this.funcImportNewByCategory(news, this.kinhdoanhnews, title_segment);
        }
        else if (news.category.toLowerCase() == 'thể thao' || news.category.toLowerCase() == 'bóng đá') {
            this.funcImportNewByCategory(news, this.thethaonews, title_segment);
        }
        else if (news.category.toLowerCase() == 'số hóa' || news.category.toLowerCase() == 'công nghệ' || news.category.toLowerCase() == 'dân trí') {
            this.funcImportNewByCategory(news, this.congnghenews, title_segment);
        }
        else if (news.category.toLowerCase() == 'sức khỏe') {
            this.funcImportNewByCategory(news, this.suckhoenews, title_segment);
        }
        else if (news.category.toLowerCase() == 'pháp luật' || news.category.toLowerCase() == 'hình sự') {
            this.funcImportNewByCategory(news, this.phapluatnews, title_segment);
        }
        else if (news.category.toLowerCase() == 'thời sự' || news.category.toLowerCase() == 'tin nhanh') {
            this.funcImportNewByCategory(news, this.thoisunews, title_segment);
        }
    };
    /*
    *
    * author: KhacChinhDev
    *
    */
    ProcessSimilarNew.prototype.funcImportNewByCategory = function (news, arrNew, title_segment) {
        var _this = this;
        var count_same_author = 0;
        var similar = 0;
        if (arrNew.length == 0) {
            news.arr_title_segment = this.funcArrayNonStopWord(title_segment);
            arrNew.push(news);
            this.funcSaveNew(news);
            return;
        }
        else {
            arrNew.forEach(function (old_news) {
                if (news.author == old_news.author)
                    count_same_author++;
                else {
                    //
                    // call function cacular similar cosinse here
                    similar = _this.funcProcessCacularSimilar(title_segment, old_news.arr_title_segment);
                    //
                    if (similar > 0.25)
                        return;
                    count_same_author++;
                }
            });
            if (count_same_author == arrNew.length) {
                news.arr_title_segment = this.funcArrayNonStopWord(title_segment);
                arrNew.push(news);
                /*
                *
                * save to db
                */
                this.funcSaveNew(news);
            }
        }
    };
    /*
    * save new to db
    * author: KhacChinhDev
    *
    */
    ProcessSimilarNew.prototype.funcSaveNew = function (news) {
        NewItem_1.NewItem.saveNewItem(news).then(function (msg) {
            //  console.log(msg);
        });
    };
    /*
    * cacular similar between two string
    * author: KhacChinhDev
    * return similar of two string
    */
    ProcessSimilarNew.prototype.funcProcessCacularSimilar = function (title_segment_new, arr_title_segment_old) {
        var _this = this;
        var arr_title_segment_new = this.funcArrayNonStopWord(title_segment_new);
        // array union between item new and item ola
        var arr_union = arr_title_segment_new.concat(arr_title_segment_old);
        var arr_union_unique = arr_union.filter(function (element, index) { return arr_union.indexOf(element) === index; });
        //create vector of item new
        var arr_vector_item_new = Array();
        arr_union_unique.forEach(function (element) {
            var tf_idf_word_new = _this.funcTfWord(arr_title_segment_new, element) *
                _this.funcIdfWord(arr_title_segment_new, arr_title_segment_old, element);
            arr_vector_item_new.push(tf_idf_word_new);
        });
        //create vector of item old
        var arr_vector_item_old = Array();
        arr_union_unique.forEach(function (element) {
            var tf_idf_word_old = _this.funcTfWord(arr_title_segment_old, element) *
                _this.funcIdfWord(arr_title_segment_new, arr_title_segment_old, element);
            arr_vector_item_old.push(tf_idf_word_old);
        });
        var value_cosine = this.funcCosineSimilar(arr_vector_item_new, arr_vector_item_old);
        if (value_cosine > 0.3) {
            console.log(arr_title_segment_new.join(" "));
            console.log('-');
            console.log(arr_title_segment_old.join(" "));
            console.log('-');
            console.log(arr_union_unique.join(" "));
            console.log('-');
            console.log(arr_vector_item_new.join("/"));
            console.log('-');
            console.log(arr_vector_item_old.join("/"));
            console.log("Cosine: " + value_cosine);
            console.log('-----------');
        }
        //  
        return value_cosine;
    };
    /*
    * cacular cosine
    * author: KhacChinhDev
    * return value of cosine
    */
    ProcessSimilarNew.prototype.funcCosineSimilar = function (vector_new, vector_old) {
        var value_new_old = 0, value_new = 0, value_old = 0;
        for (var i = 0; i < vector_new.length; i++) {
            value_new_old += vector_new[i] * vector_old[i];
            value_new += vector_new[i] * vector_new[i];
            value_old += vector_old[i] * vector_old[i];
        }
        return value_new_old / (Math.sqrt(value_new) * Math.sqrt(value_old));
    };
    /*
    * cacular tf word
    * author: KhacChinhDev
    * return tf of word
    */
    ProcessSimilarNew.prototype.funcTfWord = function (arr, word) {
        var count = 0;
        arr.forEach(function (element) {
            if (element == word)
                count++;
        });
        return count / arr.length;
    };
    /*
    * cacular idf word
    * author: KhacChinhDev
    * return idf of word
    */
    ProcessSimilarNew.prototype.funcIdfWord = function (arr_1, arr_2, word) {
        var count = 0;
        if (arr_1.indexOf(word) > -1)
            count++;
        if (arr_2.indexOf(word) > -1)
            count++;
        return 1 + Math.log(2 / count);
    };
    /*
    * remove all stop word in string
    * author: KhacChinhDev
    * return arr without stop word
    */
    ProcessSimilarNew.prototype.funcArrayNonStopWord = function (text) {
        var _this = this;
        var arr = text.split(" ");
        var arrNonSW = arr.filter(function (el) {
            return _this.arrstopword.indexOf(el) < 0;
        });
        //load non stop word
        return arrNonSW;
    };
    return ProcessSimilarNew;
}());
exports.ProcessSimilarNew = ProcessSimilarNew;
