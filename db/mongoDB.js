'use strict';

const mongo = require('mongodb').MongoClient;
const Q = require('q');

let MongoDB = function(conString){
  this._url = conString;
  this._db = null;
};

MongoDB.prototype.connectAsync = function() {
  return Q.Promise((resolve, reject) => {
    mongo.connect(this._url, (err, db) => {
      if(err) {
        reject(err);
      } else {
        this._db = db;
        resolve();
      }
    });
  });
};

MongoDB.prototype.collection = function(cll) {
  return {
    insertOneAsync: (d) => {
      return Q.promise((resolve, reject) => {
        this._db.collection(cll).insertOne(d, (err, result) => {
          err ? reject(err) : resolve(result);
        });
      });
    },
    findOneAsync: (d) => {
      return Q.promise((resolve, reject) => {
        this._db.collection(cll).findOne(d, (err, result) => {
          err ? reject(err) : resolve(result);
        });
      });
    },
    findAsync: (d) => {
      return Q.promise((resolve, reject) => {
        this._db.collection(cll).find(d, (err, result) => {
          err ? reject(err) : resolve(result.toArray());
        });
      });
    },
    updateAsync: (f, d) => {
      return Q.promise((resolve, reject) => {
        this._db.collection(cll).update(f, d, (err, result) => {
          err ? reject(err) : resolve(result);
        });
      })
    }
  };
};

module.exports = MongoDB;
