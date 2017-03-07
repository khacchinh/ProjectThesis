var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

import { News } from '../crawler/News';

interface INewItem extends mongoose.Document { 
    author:string;
    category:string;
    title:string;
    url:string;
    img:string;
    type_img: boolean;
    sumary:string;
    comment: Object;
    created: Date;
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
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
    comment:{
        userID: {
            type: String
        },
        content:{
            type: String
        }
    },
    created:{
        type: Date,
        default: Date.now
    }
});
//paginate
_schema.plugin(mongoosePaginate);

var NewItemModel = mongoose.model<INewItem>('newitems', _schema);

export class NewItem{

    /**
    * static function to save new
    * @param passport.Profile
    * @returns {Promise<NewItems>}
    */

    static saveNewItem(news : News) : Promise<NewItem>{
        return new Promise<INewItem>((resolve, reject) => {
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
    

    static getAllNewItembyCategory(category_name: String, page_number : number, limit_number: number) : Promise<NewItem>{
        return new Promise<INewItem> ((resolve, reject) => {
            NewItemModel.paginate({category: category_name}, {page: 1, limit:10}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    };
}
