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
    }
});
//paginate
//_schema.plugin(mongoosePaginate);

var NewItemModel = mongoose.model<INewItem>('newitems', _schema);

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

    static getAllNewItembyCategory(category_name: String) : Promise<NewItem>{
        return new Promise<INewItem> ((resolve, reject) => {
            NewItemModel.find({category: category_name}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    };
    
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
    static getSingleItembyID(id: string) : Promise<NewItem> {
        return new Promise<INewItem>((resolve, reject) => {
            NewItemModel.findOne({_id: id}, (err, result) => {
                if (err) reject(err);
                var c = new Crawler({
                    maxConnections: 1,
                    callback: (error, res, done) => {
                        if (error) reject(error);

                        if (result.author == 'vnexpress'){
                            var $ = res.$;
                            result.content = $(".fck_detail").html();
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
}
