"use strict";
var fs = require("fs");
var processnews_1 = require("./processnews");
var NewsItem_1 = require("../model/NewsItem");
var path = require("path");
var ProcessSimilarNew = (function () {
    //end count
    function ProcessSimilarNew() {
        this.thoigioinews = new Array();
        this.kinhdoanhnews = new Array();
        this.thethaonews = new Array();
        this.congnghenews = new Array();
        this.suckhoenews = new Array();
        this.phapluatnews = new Array();
        this.thoisunews = new Array();
        this.arrstopword = new Array();
        this.variable_new_similar = "";
        //count author
        this.cvnexpress = 0;
        this.cdantri = 0;
        this.cthanhnien = 0;
        this.cvietnamnet = 0;
        this.czing = 0;
        this.ctintuc = 0;
        this.variable_new_similar += "=================================" + "\n";
        this.variable_new_similar += new Date() + "\n";
        this.variable_new_similar += "=================================" + "\n";
        this.funcMainCacularSimilar();
    }
    //.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”"…\n\r\t]/g," ")
    ProcessSimilarNew.prototype.funcMainCacularSimilar = function () {
        //load stop word
        console.log('- load stop word');
        var stopword = fs.readFileSync(__dirname + '/tokenizer/data/stopword.txt');
        this.arrstopword = stopword.toString().split(/\r?\n/);
        //load content segment
        console.log('- load content segment');
        var dataContent = fs.readFileSync(__dirname + '/tokenizer/data/output.txt');
        var arrDataContent = dataContent.toString().split("\n");
        //process
        console.log('- remove stop word and process remove similar new');
        console.log('- processing remove similar new');
        for (var i = 0; i < processnews_1.ProcessNews.arrNews.length; i++) {
            var str_segment = arrDataContent[i].replace(/[.,\/#!$%\^&\*;:{}=\-`~()'?‘’“”"…]/g, " ");
            str_segment = str_segment.replace(/\s+/g, ' ').toLowerCase();
            processnews_1.ProcessNews.arrNews[i].content = str_segment.trim();
            this.funcDivideNews(processnews_1.ProcessNews.arrNews[i]);
            if (i == processnews_1.ProcessNews.arrNews.length - 1) {
                processnews_1.ProcessNews.arrNews.length = 0;
                processnews_1.ProcessNews.arOldNews.length = 0;
                processnews_1.ProcessNews.saveFlagTime = processnews_1.ProcessNews.arFlagTime;
                //save flag into file
                console.log('- save flag title in to file');
                console.log('- save flag time in to file');
                var flagTitle = "";
                var flagTime = "";
                processnews_1.ProcessNews.arFlagTitle.forEach(function (key, value) {
                    value = value.replace(/[./]/g, "");
                    flagTitle += key + "/" + value.trim() + ".";
                });
                processnews_1.ProcessNews.arFlagTime.forEach(function (key, value) {
                    flagTime += key + "/" + value + ".";
                });
                fs.writeFileSync(path.join(__dirname + '/tokenizer/data/flagTitle.txt'), flagTitle);
                fs.writeFileSync(path.join(__dirname + '/tokenizer/data/flagTime.txt'), flagTime);
                console.log('- write log similar news');
                fs.appendFileSync(path.join(__dirname + '/tokenizer/data/log_news_similar.txt'), this.variable_new_similar);
            }
        }
    };
    ProcessSimilarNew.prototype.funcDivideNews = function (news) {
        //count
        switch (news.author) {
            case 'vnexpress':
                this.cvnexpress += 1;
                break;
            case 'dantri':
                this.cdantri += 1;
                break;
            case 'thanhnien':
                this.cthanhnien += 1;
                break;
            case 'vietnamnet news':
                this.cvietnamnet += 1;
                break;
            case 'zing':
                this.czing += 1;
                break;
            case 'tintuc':
                this.ctintuc += 1;
                break;
        }
        //end count
        if (news.category == 'thế giới' || news.category == 'tin the gioi') {
            news.category = 'thế giới';
            this.funcImportNewByCategory(news, this.thoigioinews);
        }
        else if (news.category == 'kinh doanh' || news.category == 'tài chính' || news.category == 'kinh tế') {
            news.category = 'kinh doanh';
            this.funcImportNewByCategory(news, this.kinhdoanhnews);
        }
        else if (news.category == 'thể thao' || news.category == 'bóng đá' || news.category == 'the thao') {
            news.category = 'thể thao';
            this.funcImportNewByCategory(news, this.thethaonews);
        }
        else if (news.category == 'số hóa' || news.category == 'công nghệ' || news.category == 'dân trí' || news.category == 'tin cong nghe') {
            news.category = 'công nghệ';
            this.funcImportNewByCategory(news, this.congnghenews);
        }
        else if (news.category == "sức khỏe" || news.category == "suc khoe" || news.category == 'sống khỏe' || news.category == "sức khoẻ") {
            news.category = 'sức khỏe';
            this.funcImportNewByCategory(news, this.suckhoenews);
        }
        else if (news.category == 'pháp luật' || news.category == 'hình sự' || news.category == 'phap luat') {
            news.category = 'pháp luật';
            this.funcImportNewByCategory(news, this.phapluatnews);
        }
        else if (news.category == 'thời sự' || news.category == 'tin nhanh' || news.category == 'chính trị') {
            news.category = 'thời sự';
            this.funcImportNewByCategory(news, this.thoisunews);
        }
    };
    /*
    *
    * author: KhacChinhDev
    *
    */
    ProcessSimilarNew.prototype.funcImportNewByCategory = function (news, arrNew) {
        var _this = this;
        var count_same_author = 0;
        var similar = 0;
        if (arrNew.length == 0) {
            //check database if similar
            if (processnews_1.ProcessNews.arOldNews.length > 0) {
                for (var i = 0; i < processnews_1.ProcessNews.arOldNews.length; i++) {
                    if (processnews_1.ProcessNews.arOldNews[i].category === news.category) {
                        processnews_1.ProcessNews.arOldNews[i].arr_content_segment = this.funcArrayNonStopWord(processnews_1.ProcessNews.arOldNews[i].content);
                        similar = this.funcProcessCacularSimilar(news.content, processnews_1.ProcessNews.arOldNews[i].arr_content_segment);
                        if (similar > 0.7) {
                            this.printResult(news, processnews_1.ProcessNews.arOldNews[i], similar);
                            return;
                        }
                    }
                }
            }
            news.arr_content_segment = this.funcArrayNonStopWord(news.content);
            arrNew.push(news);
            this.funcSaveNew(news);
            return;
        }
        else {
            arrNew.forEach(function (old_news) {
                // call function cacular similar cosinse here
                similar = _this.funcProcessCacularSimilar(news.content, old_news.arr_content_segment);
                //
                if (similar > 0.7) {
                    //delete new of news is reduplicate
                    _this.printResult(news, old_news, similar);
                    return;
                }
                count_same_author++;
            });
            if (count_same_author == arrNew.length) {
                //check database if similar
                if (processnews_1.ProcessNews.arOldNews.length > 0) {
                    for (var i = 0; i < processnews_1.ProcessNews.arOldNews.length; i++) {
                        if (processnews_1.ProcessNews.arOldNews[i].category === news.category) {
                            processnews_1.ProcessNews.arOldNews[i].arr_content_segment = this.funcArrayNonStopWord(processnews_1.ProcessNews.arOldNews[i].content);
                            similar = this.funcProcessCacularSimilar(news.content, processnews_1.ProcessNews.arOldNews[i].arr_content_segment);
                            if (similar > 0.7) {
                                this.printResult(news, processnews_1.ProcessNews.arOldNews[i], similar);
                                return;
                            }
                        }
                    }
                }
                /*
                *
                * save to db
                */
                news.arr_content_segment = this.funcArrayNonStopWord(news.content);
                arrNew.push(news);
                this.funcSaveNew(news);
            }
        }
    };
    /*
    * save new to db
    * author: KhacChinhDev
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
    ProcessSimilarNew.prototype.funcProcessCacularSimilar = function (content_segment_new, arr_content_segment_old) {
        var _this = this;
        var arr_content_segment_new = this.funcArrayNonStopWord(content_segment_new);
        // array union between item new and item ola
        var arr_union_unique = arr_content_segment_new.concat(arr_content_segment_old);
        arr_union_unique = arr_union_unique.filter(function (element, index) { return arr_union_unique.indexOf(element) === index; });
        //create vector of item new
        var arr_vector_tfidf_item_new = Array();
        var arr_vector_orderword_item_new = Array();
        var arr_vector_tfidf_item_old = Array();
        var arr_vector_orderword_item_old = Array();
        arr_union_unique.forEach(function (element) {
            //new
            //tf-idf new
            var tf_idf_word_new = _this.funcTfWord(arr_content_segment_new, element) *
                _this.funcIdfWord(arr_content_segment_new, arr_content_segment_old, element);
            arr_vector_tfidf_item_new.push(tf_idf_word_new);
            //order word old
            var order_word_new = arr_content_segment_new.indexOf(element) >= 0 ? arr_content_segment_new.indexOf(element) + 1 : 0;
            arr_vector_orderword_item_new.push(order_word_new);
            //old
            //tf-idf new
            var tf_idf_word_old = _this.funcTfWord(arr_content_segment_old, element) *
                _this.funcIdfWord(arr_content_segment_new, arr_content_segment_old, element);
            arr_vector_tfidf_item_old.push(tf_idf_word_old);
            //order word old
            var order_word_old = arr_content_segment_old.indexOf(element) >= 0 ? arr_content_segment_old.indexOf(element) + 1 : 0;
            arr_vector_orderword_item_old.push(order_word_old);
        });
        //value cosine
        var value_cosine = this.funcCosineSimilar(arr_vector_tfidf_item_new, arr_vector_tfidf_item_old);
        //value orderword
        var value_orderword = this.funcOrderWord(arr_vector_orderword_item_new, arr_vector_orderword_item_old);
        /*
        if (value_cosine > 0.5) {
            console.log(arr_content_segment_new.join(" "));
            console.log(arr_vector_tfidf_item_new.join("/"));
            console.log("\n");
            console.log(arr_content_segment_old.join(" "));
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
    // print result 
    ProcessSimilarNew.prototype.printResult = function (news, old, similar) {
        console.log("Tên báo: " + news.author);
        this.variable_new_similar += "Tên báo: " + news.author + "\n";
        console.log("Thể loại: " + news.category);
        this.variable_new_similar += "Thể loại: " + news.category + "\n";
        console.log("Tiêu đề: " + news.title);
        this.variable_new_similar += "Tiêu đề: " + news.title + "\n";
        this.variable_new_similar += "URL: " + news.url + "\n";
        this.variable_new_similar += "Date public: " + news.date_public.toLocaleDateString() + "\n";
        this.variable_new_similar += "Content: " + news.content + "\n";
        console.log("---------------");
        this.variable_new_similar += "---------------" + "\n";
        console.log("Tên báo: " + old.author);
        this.variable_new_similar += "Tên báo: " + old.author + "\n";
        console.log("Thể loại: " + old.category);
        this.variable_new_similar += "Thể loại: " + old.category + "\n";
        console.log("Tiêu đề: " + old.title);
        this.variable_new_similar += "Tiêu đề: " + old.title + "\n";
        this.variable_new_similar += "URL: " + old.url + "\n";
        this.variable_new_similar += "Date public: " + old.date_public.toLocaleDateString() + "\n";
        this.variable_new_similar += "Content: " + old.content + "\n";
        console.log("----");
        this.variable_new_similar += "----" + "\n";
        console.log("Cosine value: " + similar);
        this.variable_new_similar += "Cosine value: " + similar + "\n";
        console.log("\n\n");
        this.variable_new_similar += "\n\n";
    };
    return ProcessSimilarNew;
}());
exports.ProcessSimilarNew = ProcessSimilarNew;
