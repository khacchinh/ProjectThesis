var mongoose = require("mongoose");
import * as Crawler from 'crawler';
//var mongoosePaginate = require('mongoose-paginate');

import { News } from '../crawler/News';

interface INewItem extends mongoose.Document { 
    author:string;
    category:string;
    title:string;
    url:string;
    img:string;
    type_img: boolean;
    sumary:string;
    content: string;
    comment: Object;
    active: number;
    created: Date;
    date_public: Date;
    view_count: number;
    tags : string;
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schemaComment : mongoose.Schema = new mongoose.Schema({
    content : {
        type: String,
        require: true
    },
    userid : {
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'Users'
        type: String,
        require: true
    },
    commentdate : {
        type: Date,
        default: Date.now
    }
});



var _schema : mongoose.Schema = new mongoose.Schema({
    author:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    title:{
        type: String,
        require: true
    },
    url:{
        type: String,
        require: true
    },
    img:{
        type: String,
        require: true
    },
    type_img: {
        type : Boolean,
        default: false
    },
    sumary:{
        type: String,
        require: true
    },
    content:{
        type: String
    },
    comment:[_schemaComment],
    active : {
        type: Number,
        default: 1
    },
    created:{
        type: Date,
        default: Date.now
    },
    date_public:{
        type: Date
    },
    view_count : {
        type : Number,
        default: 0
    },
    tags : {
        type : String
    }
});
//paginate
//_schema.plugin(mongoosePaginate);

var NewItemModel = mongoose.model<INewItem>('newitems', _schema);

import { Author } from '../model/Author';

export class NewItem{

    /**
    * static function to save new
    * @param passport.Profile
    * @returns {Promise<NewItems>}
    */

    static saveNewItem(news : News) : Promise<NewItem>{
        if (news.date_public + '' === "Invalid Date")
            news.date_public = new Date();
        return new Promise<INewItem>((resolve, reject) => {
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
            news_item.save((err, newitem) =>{
                if (err) reject(err)
                resolve(newitem);
            })
        });
    }
    static getAllNewItem() : Promise<NewItem>{
        return new Promise<INewItem> ((resolve, reject) => {
            NewItemModel.find((err, newitems) =>{
                if (err) reject(err);
                resolve(newitems);
            })
        });
    }

    static getAllNewItembyCategory(category_name: String = "") : Promise<NewItem>{
        return new Promise<INewItem> ((resolve, reject) => {
            Author.getAllAuthorActive().then( msg => {
                var data  = [];
                var i = 0;
                msg.forEach(element => {
                  data.push(element.codename);
                });
                if (category_name.trim() == "")
                    NewItemModel.find({author : data}, null, {sort: '-date_public'}, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    })
                else
                    NewItemModel.find({category: category_name, author : data}, null, {sort: '-date_public'}, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    })
            })
        });
    };

    static getAllNewItemBySearch(search_title: string) : Promise<NewItem>{
        return new Promise<INewItem> ((resolve, reject) => {
            NewItemModel.find({title: new RegExp(search_title, "i")}, null, {sort: '-date_public'}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    };

    static getAllNewItemBySearchParams(params: any) : Promise<NewItem>{
        params.title = new RegExp(params.title, "i");
        return new Promise<INewItem> ((resolve, reject) => {
            NewItemModel.find(params, null, {sort: '-date_public'}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    };

    static getPopularNews() : Promise<any>{
        return new Promise<any> ((resolve, reject) => {
            NewItemModel.find({}, null, {sort: '-view_count', limit: 10}, (err, result) => {
                    if (err) reject(err);
                    resolve(result)
                })
        })
    }

    static getCommentNews() : Promise<any>{
        return new Promise<any> ((resolve, reject) => {
            NewItemModel.find({}, null, {sort: '-comment', limit: 10}, (err, result) => {
                    if (err) reject(err);
                    resolve(result)
            })
        })
    }

    static delNewsById(id : string) : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            NewItemModel.remove({_id: id},function(err, news){
                if (err) reject(err)
                resolve(news);
            });
        })
    }

    static getHotNew() : Promise<any> {
        var data = {
            "thegioi" : "",
            "kinhdoanh" : "",
            "congnghe" : "",
            "suckhoe" : "",
            "phapluat" : "",
            "thethao" : "",
        };
        var cate_condition = ["thế giới", "kinh doanh", "công nghệ", "sức khỏe", "pháp luật", "thể thao"];
        var count = 0;
        return new Promise<any> ((resolve, reject) => {
            Author.getAllAuthorActive().then( msg => {
                var ar_author  = [];
                var i = 0;
                msg.forEach(element => {
                  ar_author.push(element.codename);
                });
                cate_condition.forEach(element => {
                    NewItemModel.find({category: element, author: ar_author}, null, {sort: '-date_public', limit: 5}, (err, result) => {
                        if (err) reject(err);
                        switch (result[0].category){
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
                    })
                });
            })
        })
    }

    static getSingleItembyID(id: string) : Promise<NewItem> {
        return new Promise<INewItem>((resolve, reject) => {
            NewItemModel.findOne({_id: id}, (err, result) => {
                if (err) reject(err);
                var c = new Crawler({
                    maxConnections: 1,
                    callback: (error, res, done) => {
                        if (error) reject(error);
                        result.view_count++;
                        result.save((err, item)=>{});
                        if (result.author == 'vnexpress'){
                            var $ = res.$;
                            result.content = $(".fck_detail").html();
                            resolve(result);
                        }
                        else if (result.author == 'dantri'){
                            var $ = res.$;
                            $("#divNewsContent div.news-tag").remove();
                            result.content = $("#divNewsContent").html();
                            resolve(result);
                        }
                        else if (result.author == 'thanhnien'){
                            var $ = res.$;
                            result.content = $("#abody").html();
                            resolve(result);
                        }
                        else if (result.author == 'vietnamnet news'){
                            var $ = res.$;
                            result.content = $("#ArticleContent").html();
                            resolve(result);
                        }
                        else if (result.author == 'zing'){
                            var $ = res.$;
                            result.content = $(".the-article-body").html();
                            resolve(result);
                        }
                        else if (result.author == 'tintuc'){
                            var $ = res.$;
                            $("#articleContent .picked-relate").remove();
                            $("#articleContent div#ads_end_content").remove();
                            $("#articleContent figure").removeClass("caption");
                            result.content = $("#articleContent").html();
                            resolve(result);
                        }
                    }
                });
                c.queue([
                    result.url
                ]);
            })
        })
    }

    static saveComentForNewItem(id: string, comments : any) : Promise<NewItem> {
        return new Promise<INewItem> ((resolve, reject) => {
            NewItemModel.findById(id, (err, upnewitem) => {
                if (err) reject(err);
                upnewitem.comment.push(comments);
                upnewitem.save((err, newitem) => {
                    if (err) reject(err);
                    resolve(newitem);
                })
            })
        })
    }

    static getNearestNew(author_name: string, category_name: string) : any{
        NewItemModel.find({author: author_name, category : category_name}).sort('-date_public').limit(1).exec((err, item) => {
            if (err) return "null";
            if (item.length > 0){
                console.log(item[0].title);
                return item[0].title;
            }
            else return "null";
        });
    }

    static getNewsAfterDay(duration: number) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            var date = new Date();
            date.setDate(date.getDate() - duration);

            NewItemModel.find({date_public : {$gte: date}}, (err, news) => {
                if (err) reject(err);
                if (news.length > 0)
                    resolve(news);
                else resolve("empty");
            })
        });
    }   

    static getNewsRelative(category_name: String, tags : String) : Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            var date = new Date();
            date.setDate(date.getDate() - 7);

            NewItemModel.find({cateogry : category_name, date_public : {$gte: date}},'title tags', (err, news) => {
                if (err) reject(err);
                if (news.length > 0){
                    console.log(news);
                }
                else resolve("empty");
            })
        })
    }
    
}
