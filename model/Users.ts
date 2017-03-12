var mongoose = require('mongoose');

interface IUser extends mongoose.Document { 
    username: string;
    password: string;
    name: string;
    email: string;
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
});

var UserModel = mongoose.model<IUser>('users', _schema);

export class Users{


    static findUserLogin(user: any) : Promise<Users>{
        return new Promise<Users> ((resolve, reject) => {
            UserModel.findOne({username: user.username, password: user.password}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    }
}