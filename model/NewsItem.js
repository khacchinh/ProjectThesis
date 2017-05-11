"use strict";
var mongoose = require("mongoose");
var Crawler = require("crawler");
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schemaComment = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    userid: {
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'Users'
        type: String,
        require: true
    },
    commentdate: {
        type: Date,
        "default": Date.now
    }
});
var _schema = new mongoose.Schema({
    author: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    img: {
        type: String,
        require: true
    },
    type_img: {
        type: Boolean,
        "default": false
    },
    sumary: {
        type: String,
        require: true
    },
    content: {
        type: String
    },
    comment: [_schemaComment],
    active: {
        type: Number,
        "default": 1
    },
    created: {
        type: Date,
        "default": Date.now
    },
    date_public: {
        type: Date
    },
    view_count: {
        type: Number,
        "default": 0
    },
    tags: {
        type: String
    }
});
//paginate
//_schema.plugin(mongoosePaginate);
var NewItemModel = mongoose.model('newitems', _schema);
var Author_1 = require("../model/Author");
var NewItem = (function () {
    function NewItem() {
    }
    /**
    * static function to save new
    * @param passport.Profile
    * @returns {Promise<NewItems>}
    */
    NewItem.saveNewItem = function (news) {
        if (news.date_public + '' === "Invalid Date")
            news.date_public = new Date();
        return new Promise(function (resolve, reject) {
            var news_item = new NewItemModel;
            news_item.author = news.author;
            news_item.category = news.category;
            news_item.title = news.title;
            news_item.url = news.url;
            news_item.img = news.img;
            news_item.type_img = news.type_img;
            news_item.sumary = news.sumary;
            news_item.date_public = news.date_public;
            news_item.content = news.content;
            news_item.tags = news.tags;
            news_item.save(function (err, newitem) {
                if (err)
                    reject(err);
                resolve(newitem);
            });
        });
    };
    NewItem.getAllNewItem = function () {
        return new Promise(function (resolve, reject) {
            NewItemModel.find(function (err, newitems) {
                if (err)
                    reject(err);
                resolve(newitems);
            });
        });
    };
    NewItem.getAllNewItembyCategory = function (category_name) {
        if (category_name === void 0) { category_name = ""; }
        return new Promise(function (resolve, reject) {
            Author_1.Author.getAllAuthorActive().then(function (msg) {
                var data = [];
                var i = 0;
                msg.forEach(function (element) {
                    data.push(element.codename);
                });
                if (category_name.trim() == "")
                    NewItemModel.find({ author: data }, null, { sort: '-date_public' }, function (err, result) {
                        if (err)
                            reject(err);
                        resolve(result);
                    });
                else
                    NewItemModel.find({ category: category_name, author: data }, null, { sort: '-date_public' }, function (err, result) {
                        if (err)
                            reject(err);
                        resolve(result);
                    });
            });
        });
    };
    ;
    NewItem.getAllNewItemBySearch = function (search_title) {
        return new Promise(function (resolve, reject) {
            NewItemModel.find({ title: new RegExp(search_title, "i") }, null, { sort: '-date_public' }, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    ;
    NewItem.getAllNewItemBySearchParams = function (params) {
        params.title = new RegExp(params.title, "i");
        return new Promise(function (resolve, reject) {
            NewItemModel.find(params, null, { sort: '-date_public' }, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    ;
    NewItem.getPopularNews = function () {
        return new Promise(function (resolve, reject) {
            NewItemModel.find({}, null, { sort: '-view_count', limit: 10 }, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    NewItem.getCommentNews = function () {
        return new Promise(function (resolve, reject) {
            NewItemModel.find({}, null, { sort: '-comment', limit: 10 }, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    NewItem.delNewsById = function (id) {
        return new Promise(function (resolve, reject) {
            NewItemModel.remove({ _id: id }, function (err, news) {
                if (err)
                    reject(err);
                resolve(news);
            });
        });
    };
    NewItem.getHotNew = function () {
        var data = {
            "thegioi": "",
            "kinhdoanh": "",
            "congnghe": "",
            "suckhoe": "",
            "phapluat": "",
            "thethao": ""
        };
        var cate_condition = ["thế giới", "kinh doanh", "công nghệ", "sức khỏe", "pháp luật", "thể thao"];
        var count = 0;
        return new Promise(function (resolve, reject) {
            Author_1.Author.getAllAuthorActive().then(function (msg) {
                var ar_author = [];
                var i = 0;
                msg.forEach(function (element) {
                    ar_author.push(element.codename);
                });
                cate_condition.forEach(function (element) {
                    NewItemModel.find({ category: element, author: ar_author }, null, { sort: '-date_public', limit: 6 }, function (err, result) {
                        if (err)
                            reject(err);
                        switch (result[0].category) {
                            case "thế giới":
                                data.thegioi = result;
                                break;
                            case "kinh doanh":
                                data.kinhdoanh = result;
                                break;
                            case "công nghệ":
                                data.congnghe = result;
                                break;
                            case "sức khỏe":
                                data.suckhoe = result;
                                break;
                            case "pháp luật":
                                data.phapluat = result;
                                break;
                            case "thể thao":
                                data.thethao = result;
                                break;
                        }
                        count++;
                        if (count == 6)
                            resolve(data);
                    });
                });
            });
        });
    };
    NewItem.getSingleItembyID = function (id) {
        return new Promise(function (resolve, reject) {
            NewItemModel.findOne({ _id: id }, function (err, result) {
                if (err)
                    reject(err);
                var c = new Crawler({
                    maxConnections: 1,
                    callback: function (error, res, done) {
                        if (error)
                            reject(error);
                        result.view_count++;
                        result.save(function (err, item) { });
                        if (result.author == 'vnexpress') {
                            var $ = res.$;
                            result.content = $(".fck_detail").html();
                            resolve(result);
                        }
                        else if (result.author == 'dantri') {
                            var $ = res.$;
                            $("#divNewsContent div.news-tag").remove();
                            result.content = $("#divNewsContent").html();
                            resolve(result);
                        }
                        else if (result.author == 'thanhnien') {
                            var $ = res.$;
                            $("#abody").children('div').children('article').remove();
                            result.content = $("#abody").html();
                            resolve(result);
                        }
                        else if (result.author == 'vietnamnet news') {
                            var $ = res.$;
                            result.content = $("#ArticleContent").html();
                            resolve(result);
                        }
                        else if (result.author == 'zing') {
                            var $ = res.$;
                            $(".the-article-body").children("table.article").remove();
                            result.content = $(".the-article-body").html();
                            resolve(result);
                        }
                        else if (result.author == 'tintuc') {
                            var $ = res.$;
                            $("#articleContent .picked-relate").remove();
                            $("#articleContent div#ads_end_content").remove();
                            $("#articleContent figure").removeClass("caption");
                            result.content = $("#articleContent").html() + $("#articleWriter").html();
                            resolve(result);
                        }
                    }
                });
                c.queue([
                    result.url
                ]);
            });
        });
    };
    NewItem.saveComentForNewItem = function (id, comments) {
        return new Promise(function (resolve, reject) {
            NewItemModel.findById(id, function (err, upnewitem) {
                if (err)
                    reject(err);
                upnewitem.comment.push(comments);
                upnewitem.save(function (err, newitem) {
                    if (err)
                        reject(err);
                    resolve(newitem);
                });
            });
        });
    };
    NewItem.getNearestNew = function (author_name, category_name) {
        NewItemModel.find({ author: author_name, category: category_name }).sort('-date_public').limit(1).exec(function (err, item) {
            if (err)
                return "null";
            if (item.length > 0) {
                console.log(item[0].title);
                return item[0].title;
            }
            else
                return "null";
        });
    };
    NewItem.getNewsAfterDay = function (duration) {
        return new Promise(function (resolve, reject) {
            var date = new Date();
            date.setDate(date.getDate() - duration);
            NewItemModel.find({ date_public: { $gte: date } }, function (err, news) {
                if (err)
                    reject(err);
                if (news.length > 0)
                    resolve(news);
                else
                    resolve("empty");
            });
        });
    };
    NewItem.getNewsRelative = function (data) {
        var __this = this;
        return new Promise(function (resolve, reject) {
            if (typeof data.tags !== 'undefined') {
                var result = [];
                var date = new Date();
                date.setDate(date.getDate() - 7);
                NewItemModel.find({ category: data.category, date_public: { $gte: date } }, 'title tags', function (err, news) {
                    if (err)
                        reject(err);
                    if (news.length > 0) {
                        news.forEach(function (element) {
                            if (typeof element.tags !== 'undefined' && element.title.trim() != data.title.trim() && element._id != data._id) {
                                var ar_news_tags = data.tags.split(",");
                                var ar_element_tags = element.tags.split(",");
                                var arr_union_unique = ar_news_tags.concat(ar_element_tags);
                                arr_union_unique = arr_union_unique.filter(function (element, index) { return arr_union_unique.indexOf(element) === index; });
                                var ar_vector_news_tags = Array();
                                var ar_vector_element_tags = Array();
                                arr_union_unique.forEach(function (element_word) {
                                    if (element_word !== '') {
                                        var value = __this.funcCheckWordInArr(element_word, ar_news_tags) == true ? 1 : 0;
                                        ar_vector_news_tags.push(value);
                                        value = __this.funcCheckWordInArr(element_word, ar_element_tags) == true ? 1 : 0;
                                        ar_vector_element_tags.push(value);
                                    }
                                });
                                var cosin = __this.funcCosineSimilar(ar_vector_news_tags, ar_vector_element_tags);
                                element.cosin = cosin;
                                if (cosin > 0.1) {
                                    var item_result = {
                                        "_id": element._id,
                                        "title": element.title,
                                        "tags": element.tags,
                                        "cosin": cosin
                                    };
                                    result.push(item_result);
                                }
                            }
                        });
                        result.sort(__this.dynamicSort("-cosin"));
                        if (result.length > 5)
                            result.length = 5;
                        resolve(result);
                    }
                    else
                        resolve("empty");
                });
            }
            else
                resolve("empty");
        });
    };
    NewItem.funcCheckWordInArr = function (word, arr) {
        if (arr.indexOf(word) > -1)
            return true;
        return false;
    };
    NewItem.funcCosineSimilar = function (vector_new, vector_old) {
        var value_new_old = 0, value_new = 0, value_old = 0;
        for (var i = 0; i < vector_new.length; i++) {
            value_new_old += vector_new[i] * vector_old[i];
            value_new += vector_new[i] * vector_new[i];
            value_old += vector_old[i] * vector_old[i];
        }
        return value_new_old / (Math.sqrt(value_new) * Math.sqrt(value_old));
    };
    NewItem.dynamicSort = function (property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    };
    return NewItem;
}());
exports.NewItem = NewItem;
