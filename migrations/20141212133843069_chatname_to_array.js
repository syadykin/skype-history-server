/*jslint node:true */
'use strict';
var async = require('async');

module.exports = {
  requiresDowntime: false,

  up: function(db, cb) {
    db.db.collection('chatrooms', function(err, collection) {
      if (err) throw err;
      collection.find({'$where': '!Array.isArray(this.chatname)'},
          {'chatname': 1}).toArray(function(err, data) {
        if (err) throw err;

        async.eachLimit(data, 4, function(obj, cb) {
          collection.update({_id: obj._id},
            {'$set': {'chatname': [obj.chatname]}}, {w: 1}, cb);
        }, cb);
      });
    });
  },

  down: function(db, cb) {

    db.db.collection('chatrooms', function(err, collection) {
      if (err) throw err;
      collection.find({'$where': 'Array.isArray(this.chatname)'},
          {'chatname': 1}).toArray(function(err, data) {
        if (err) throw err;

        async.eachLimit(data, 4, function(obj, cb) {
          collection.update({_id: obj._id},
            {'$set': {'chatname': obj.chatname.shift()}}, {w: 1}, cb);
        }, cb);
      });
    });
  }
};

