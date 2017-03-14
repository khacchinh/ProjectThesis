var mongoose = require('mongoose');

interface ICategory extends mongoose.Document{
    name: string;
    active: number;
}

var _schemaCategory : mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    active: {
        type: Number,
        default: 1
    }
});

var CategoryModel = mongoose.model<ICategory>('categorys', _schemaCategory);

export class Category{
    
    static getAllCategory() : Promise<Category>{
        return new Promise<Category>((resolve, reject) => {
            CategoryModel.find((err, items) => {
                if (err) reject(err);
                resolve(items);
            })
        });
    }
}