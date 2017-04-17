var mongoose = require('mongoose');

interface IAuthor extends mongoose.Document{
    codename : string;
    name: string;
    url: string;
    active: number;
}

var _schemaAuthor : mongoose.Schema = new mongoose.Schema({
    codename: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    url : {
        type: String
    },
    active: {
        type: Number,
        default: 1
    }
});

var AuthorModel = mongoose.model<IAuthor>('authors', _schemaAuthor);

export class Author{
    
    static getAllAuthor() : Promise<Author>{
        return new Promise<Author>((resolve, reject) => {
            AuthorModel.find((err, items) => {
                if (err) reject(err);
                resolve(items);
            })
        });
    }

    static getAllAuthorActive() : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            AuthorModel.find({active: 1}, 'codename', (err, items) => {
                if (err) reject(err);
                resolve(items);
            })
        });
    }

    static deActiveAuthor(id : string) : Promise<Author>{
        return new Promise<Author>((resolve, reject) => {
            AuthorModel.findById(id, function(err, upauthor){
                if (err) reject(err) 
                else{
                    upauthor.active = 0;
                    upauthor.save(function(err, user){
                        if (err) reject(err);
                        resolve(user);
                    });
                }

            });
        })
    }

    static onActiveAuthor(id : string) : Promise<Author>{
        return new Promise<Author>((resolve, reject) => {
            AuthorModel.findById(id, function(err, upauthor){
                if (err) reject(err) 
                else{
                    upauthor.active = 1;
                    upauthor.save(function(err, user){
                        if (err) reject(err);
                        resolve(user);
                    });
                }

            });
        })
    }
}