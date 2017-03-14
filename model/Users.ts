var mongoose = require('mongoose');

interface IUser extends mongoose.Document { 
    username: string;
    password: string;
    name: string;
    email: string;
    access: number;
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema : mongoose.Schema = new mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    access : {
        type: Number,
        default: 0
    }
});

var UserModel = mongoose.model<IUser>('users', _schema);

export class Users{


    static findUserLogin(user: any) : Promise<Users>{
        return new Promise<Users> ((resolve, reject) => {
            var arFilter;
            if (user.access == 1)
                arFilter = {username: user.username, password: user.password, access: user.access}
            else arFilter = {username: user.username, password: user.password}
            UserModel.findOne(arFilter, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    }

    static getAllUser() : Promise<Users>{
        return new Promise<Users> ((resolve, reject) => {
            UserModel.find((err, users) => {
                if (err) reject(err);
                resolve(users);
            })
        });
    }
}