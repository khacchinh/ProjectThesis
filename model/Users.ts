var mongoose = require('mongoose');
import { DataNewsUser } from './DataNewsUser';

interface IUser extends mongoose.Document { 
    username: string;
    password: string;
    name: string;
    email: string;
    access: number;
    active: number;
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
    },
    active : {
        type: Number,
        default: 1
    }
});

var UserModel = mongoose.model<IUser>('users', _schema);

export class Users{
    static findUserLogin(user: any) : Promise<any>{
        return new Promise<any> ((resolve, reject) => {
            var arFilter;
            if (user.access == 1)
                arFilter = {username: user.username, password: user.password, access: user.access, active : 1}
            else arFilter = {username: user.username, password: user.password, active : 1}
            UserModel.findOne(arFilter, (err, result) => {
                if (err) reject(err);
                if (result){
                    DataNewsUser.getDataNewsUserById(result._id).then(datauser => {
                        var data = {
                            "user" : result,
                            "datauser" : datauser
                        }
                        resolve(data);
                    })
                }
                else resolve();
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

    static getUserById(id : String) : Promise<Users>{
        return new Promise<Users> ((resolve, reject) => {
            UserModel.findOne({_id : id},(err, users) => {
                if (err) reject(err);
                resolve(users);
            })
        });
    }

    static checkExistUser(username: string) : Promise<any>{
        var data;
        return new Promise<any>((resolve, reject) => {
            UserModel.findOne({username : username},(err, users) => {
                if (err) reject(err);
                if (users && users.username == username){
                    data = {
                        "isExist" : true
                    }
                } else {
                    data = {
                        "isExist" : false
                    }
                }
                resolve(data);
            })
        })
    }

    static updateUser(id: String, user: any) : Promise<Users>{
        return new Promise<Users> ((resolve, reject) => {
            UserModel.findById(id, function(err, upuser){
                if (err) reject(err) 
                else{
                    upuser.username = user.username;
                    upuser.password = user.password;
                    upuser.name = user.name;
                    upuser.email = user.email;
                    upuser.access = user.access;
                    upuser.active = user.active;
                    upuser.save(function(err, user){
                        if (err) reject(err);
                        resolve(user);
                    });
                }

            });
        })
    }

    static addUser(user : any) : Promise<Users>{
        return new Promise<Users> ((resolve, reject) => {
            var userModel = UserModel({
                username : user.username,
                password : user.password,
                name : user.name,
                email : user.email,
                access : user.access,
            });
            userModel.save(function(err, user){
            if (err) reject(err)
                resolve(user);
            });
        });
    }

    static deActiveUser(id: String) : Promise<Users>{
        return new Promise<Users> ((resolve, reject) => {
            UserModel.findById(id, function(err, upuser){
                if (err) reject(err) 
                else{
                    upuser.active = 0;
                    upuser.save(function(err, user){
                        if (err) reject(err);
                        resolve(user);
                    });
                }

            });
        })
    }
}