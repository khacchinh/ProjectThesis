"use strict";
var fs = require("fs");
var processnews_1 = require("./processnews");
var NewsItem_1 = require("../model/NewsItem");
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
    //.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”"…\n\r\t]/g," ")
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
            var str_segment = arrDataTitle[i].replace(/[.,\/#!$%\^&\*;:{}=\-`~()'?‘’“”"…]/g, " ");
            str_segment = str_segment.replace(/  +/g, ' ');
            this.funcDivideNews(processnews_1.ProcessNews.arrNews[i], str_segment);
            if (i == processnews_1.ProcessNews.arrNews.length - 1) {
                processnews_1.ProcessNews.arrNews.length = 0;
                processnews_1.ProcessNews.tempArrNews.length = 0;
                processnews_1.ProcessNews.arOldNews.length = 0;
            }
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
                    //                    // call function cacular similar cosinse here
                    similar = _this.funcProcessCacularSimilar(title_segment, old_news.arr_title_segment);
                    //
                    if (similar > 0.45) {
                        //delete new of news is reduplicate
                        console.log("Tên báo: " + news.author);
                        console.log("Thể loại: " + news.category);
                        console.log("Tiêu đề: " + news.title);
                        console.log("---------------");
                        console.log("Tên báo: " + old_news.author);
                        console.log("Thể loại: " + old_news.category);
                        console.log("Tiêu đề: " + old_news.title);
                        console.log("----");
                        console.log("Cosine value: " + similar);
                        console.log("\n\n");
                        return;
                    }
                    count_same_author++;
                }
            });
            if (count_same_author == arrNew.length) {
                news.arr_title_segment = this.funcArrayNonStopWord(title_segment);
                //check database if similar
                if (processnews_1.ProcessNews.arOldNews.length > 0) {
                    for (var i = 0; i < processnews_1.ProcessNews.arOldNews.length; i++) {
                        if (processnews_1.ProcessNews.arOldNews[i].author != news.author && processnews_1.ProcessNews.arOldNews[i].category == news.category) {
                            processnews_1.ProcessNews.arOldNews[i].arr_title_segment = this.funcArrayNonStopWord(processnews_1.ProcessNews.arOldNews[i].content);
                            similar = this.funcProcessCacularSimilar(title_segment, processnews_1.ProcessNews.arOldNews[i].arr_title_segment);
                            if (similar > 0.45)
                                return;
                        }
                    }
                }
                /*
                *
                * save to db
                */
                console.log(news.title + "\n\n");
                arrNew.push(news);
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
        NewsItem_1.NewItem.saveNewItem(news).then(function (msg) {
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
        var arr_vector_tfidf_item_new = Array();
        var arr_vector_orderword_item_new = Array();
        arr_union_unique.forEach(function (element) {
            //tf-idf
            var tf_idf_word_new = _this.funcTfWord(arr_title_segment_new, element) *
                _this.funcIdfWord(arr_title_segment_new, arr_title_segment_old, element);
            arr_vector_tfidf_item_new.push(tf_idf_word_new);
            //order word
            var order_word_new = arr_title_segment_new.indexOf(element) >= 0 ? arr_title_segment_new.indexOf(element) + 1 : 0;
            arr_vector_orderword_item_new.push(order_word_new);
        });
        //create vector of item old
        var arr_vector_tfidf_item_old = Array();
        var arr_vector_orderword_item_old = Array();
        arr_union_unique.forEach(function (element) {
            //tf-idf
            var tf_idf_word_old = _this.funcTfWord(arr_title_segment_old, element) *
                _this.funcIdfWord(arr_title_segment_new, arr_title_segment_old, element);
            arr_vector_tfidf_item_old.push(tf_idf_word_old);
            //order word
            var order_word_old = arr_title_segment_old.indexOf(element) >= 0 ? arr_title_segment_old.indexOf(element) + 1 : 0;
            arr_vector_orderword_item_old.push(order_word_old);
        });
        //value cosine
        var value_cosine = this.funcCosineSimilar(arr_vector_tfidf_item_new, arr_vector_tfidf_item_old);
        //value orderword
        var value_orderword = this.funcOrderWord(arr_vector_orderword_item_new, arr_vector_orderword_item_old);
        /*
        if (value_cosine > 0.5) {
            console.log(arr_title_segment_new.join(" "));
            console.log(arr_vector_tfidf_item_new.join("/"));
            console.log("\n");
            console.log(arr_title_segment_old.join(" "));
            console.log(arr_vector_tfidf_item_old.join("/"));
            console.log("\n");
            console.log(arr_union_unique.join(" "));
            console.log(value_cosine);
            console.log("\n-------------------------------------");
            
        }
        //
        */
        return value_cosine * 0.8 + value_orderword * 0.2;
    };
    /*
    * cacular order word
    * author: KhacChinhDev
    * return value of order word
    */
    ProcessSimilarNew.prototype.funcOrderWord = function (vector_new, vector_old) {
        var value_numerator = 0, value_denominator = 0;
        for (var i = 0; i < vector_new.length; i++) {
            value_numerator += Math.pow((vector_new[i] - vector_old[i]), 2);
            value_denominator += Math.pow((vector_new[i] + vector_old[i]), 2);
        }
        value_numerator = Math.sqrt(value_numerator);
        value_denominator = Math.sqrt(value_denominator);
        return 1 - (value_numerator / value_denominator);
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
