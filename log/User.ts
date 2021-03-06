/// <reference path="../tsd/tsd.d.ts" />

import mongoose = require('mongoose');
import passport = require('passport');

interface IUser extends mongoose.Document {
  provider: string;
  id: string;
  authorId: string;
  displayName: string;
  emails: any;
  photos: any;
  show: boolean;
  created: Date;
  updated: Date;
}

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
var _schema: mongoose.Schema = new mongoose.Schema({
    provider: {
      type: String,
      require: true
    },
    id: {
      type: String,
      require: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author'
    },
    displayName: {
      type: String
    },
    emails: {
      type: mongoose.Schema.Types.Mixed
    },
    photos: {
      type: mongoose.Schema.Types.Mixed
    },
    show: Boolean,
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  })
  .pre('save', function(next) {
    this.updated = new Date();
    next();
  });

/**
 * Mongoose.Model
 * @type {Model<IUser>}
 * @private
 */
var _model = mongoose.model < IUser > ('User', _schema);

class User {

  /**
   * static ユーザが存在しなければ作成して返す。
   * @param passport.Profile
   * @returns {Promise<User>}
   */
  static findOrCreate(profile: passport.Profile): Promise < User > {
    return new Promise < IUser > ((resolve, reject) => {
      _model.findOne({
          provider: profile.provider,
          id: profile.id
        })
        .exec()
        .then(user => {
          if (user) {
            return resolve(new User(user));
          }
          _model.create({
              provider: profile.provider,
              id: profile.id,
              displayName: profile.displayName,
              emails: profile.emails,
              photos: profile.photos
            })
            .onResolve((err, user) => {
              err ? reject(err) : resolve(new User(user));
            });
        });
    });
  }

  /**
   * static idからUserオブジェクトを取得
   * @param id
   * @returns {Promise<User>}
   */
  static findById(id: string): Promise < User > {
    return new Promise < IUser > ((resolve, reject) => {
      _model.findById(id)
        .exec()
        .onResolve((err, user) => {
          err ? reject(err) : resolve(new User(user));
        });
    })
  }

  /**
   * インスタンス変数
   */
  private _document: IUser;

  /**
   * コンストラクタ
   * @param mongoose.Document<IUser>
   */
  constructor(document: IUser) {
    this._document = document;
  }

  get provider(): string {
    return this._document.provider;
  }

  get image(): string {
    if (Array.isArray(this._document.photos)) {
      return this._document.photos.length > 0 ? this._document.photos[0] : null;
    }
    return this._document.photos;
  }

  get show(): boolean {
    return this._document.show;
  }

  get authorId(): string {
    return this._document.authorId;
  }
}

export = User;