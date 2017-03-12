"use strict";
var mongoose = require("mongoose");
var Crawler = require("crawler");
/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
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
    comment: {
        userID: {
            type: String
        },
        content: {
            type: String
        }
    },
    created: {
        type: Date,
        "default": Date.now
    }
});
//paginate
//_schema.plugin(mongoosePaginate);
var NewItemModel = mongoose.model('newitems', _schema);
var NewItem = (function () {
    function NewItem() {
    }
    /**
    * static function to save new
    * @param passport.Profile
    * @returns {Promise<NewItems>}
    */
    NewItem.saveNewItem = function (news) {
        return new Promise(function (resolve, reject) {
            var news_item = new NewItemModel;
            news_item.author = news.author;
            news_item.category = news.category;
            news_item.title = news.title;
            news_item.url = news.url;
            news_item.img = news.img;
            news_item.type_img = news.type_img;
            news_item.comment.userID = "KhacChinhDev";
            news_item.comment.content = "This is demo comment";
            news_item.sumary = news.sumary;
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
        return new Promise(function (resolve, reject) {
            NewItemModel.find({ category: category_name }, function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    ;
    /*
        static getAllNewItembyCategoryWithPanigate(category_name: String, page_number : number, limit_number: number) : Promise<NewItem>{
            return new Promise<INewItem> ((resolve, reject) => {
                NewItemModel.paginate({category: category_name}, {page: 1, limit:10}, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                })
            });
        };
    */
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
                        if (result.author == 'vnexpress') {
                            var $ = res.$;
                            result.content = $(".fck_detail").html();
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
    return NewItem;
}());
exports.NewItem = NewItem;
