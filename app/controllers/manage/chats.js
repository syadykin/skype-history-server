/*jslint node:true*/
'use strict';

var Mongoose = require('mongoose'),
    Locomotive = require('locomotive'),
    async = require('async'),
    extend = require('extend'),
    error = require('http-errors'),

    Controller = Locomotive.Controller,
    Chatroom = Mongoose.models.Chatroom,
    Message = Mongoose.models.Message,
    Ctrl = new Controller();

Ctrl.render = function(err, data) {
  var that = this;

  this.respond({
    json: function() {
      if (err) {
        that.res.status(err.status || 500);
        err = err.body || {
          code: err.status,
          message: err.message
        };
      }
      that.res.json(err || data || {});
    }
  });
};

Ctrl.before('*', function(cb) {
  return this.res.locals.user ? cb() : this.render(error(403));
});

Ctrl.index = function() {
  var that = this;
  async.parallel({
    all: async.apply(Message.aggregate.bind(Message),
      {$project: {chatname: 1}},
      {$group: {_id: '$chatname'}},
      {$sort: {'_id': 1}}),
    used: async.apply(Chatroom.aggregate.bind(Chatroom),
      {$project: {displayname: 1, chatname: 1}},
      {$unwind: '$chatname'},
      {$group: {_id: '$chatname',
        chatname: {$addToSet: '$chatname'},
        displayname: {$addToSet: '$displayname'}}},
      {$unwind: '$chatname'})
  }, function(err, res) {
    if (err) return that.render(err);
    that.render(null, res.all.map(function(chat) {
      var room = res.used.filter(function(used) {
        return chat._id === used._id; }).shift();
      return room || extend(chat, {chatname: chat._id, displayname: []});
    }));
  });
};

module.exports = Ctrl;
