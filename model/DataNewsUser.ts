var mongoose = require('mongoose');

interface IDataUser extends mongoose.Document{
    user : string,
    news : string,
    types : string
}

var _schemaDataNewsUser : mongoose.Schema = new mongoose.Schema({
   user : {
       type : mongoose.Schema.Types.ObjectId,
       ref : "users"
   },
   news : {
       type : mongoose.Schema.Types.ObjectId,
       ref : "newitems"
   },
   types : {
       type : String
   }
});

var DataNewsUserModel = mongoose.model<IDataUser>('savenews', _schemaDataNewsUser);

export class DataNewsUser{
    
    static addDataNewsUser(data : any) : Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            var saveNewsModel = DataNewsUserModel({
                user : data.user,
                news : data.news,
                types : data.types
            });
            saveNewsModel.save(function(err, user){
            if (err) reject(false)
                resolve(true);
            });
        })
    }

    static getDataNewsUserById(user_id : string) : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            DataNewsUserModel.find({
                user : user_id
            })
            .exec(function(err, data){
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    static getDataNewsById(news_id : string) : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            DataNewsUserModel.find({
                news : news_id
            })
            .exec(function(err, data){
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    static getDataNewsUserByIdDetail(user_id : string) : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            DataNewsUserModel.find({
                user : user_id
            })
            .populate('news')
            .exec(function(err, data){
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    static removeDataUser(data : any) : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            DataNewsUserModel.remove(data,function(err, result){
                if (err) reject(false)
                resolve(true);
            });
        })
    }
}