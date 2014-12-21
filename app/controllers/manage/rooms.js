/*jslint node:true*/
'use strict';

var Mongoose = require('mongoose'),
    Locomotive = require('locomotive'),
    extend = require('extend'),
    error = require('http-errors'),
    async = require('async'),
    _ = require('underscore'),

    Controller = Locomotive.Controller,
    Chatroom = Mongoose.models.Chatroom,
    Ctrl = new Controller();

function errorsToObject(eo) {
  var err = {};
  _.each(eo.errors, function(e, k) {
    if (err[k] === undefined) err[k] = [];
    err[k].push(e.message);
  });
  return error(412, {body: err});
}

Ctrl.render = function(err, data) {
  var that = this;

  if (err && err.constructor.name === 'ValidationError') {
    err = errorsToObject(err);
  }

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
  Chatroom.find().sort('displayname').exec(this.render.bind(this));
};

Ctrl.create = function() {
  var room = new Chatroom(this.req.body);
  room.save(this.render.bind(this));
};

Ctrl.show = function() {
  Chatroom.findById(this.params('id'), this.render.bind(this));
};

Ctrl.update = function() {
  var that = this;
  async.waterfall([
    Chatroom.findById.bind(Chatroom, this.params('id')),
    function(room, cb) {
      if (!room) return cb(error(404));
      extend(room, that.req.body);
      room.save(cb);
    }
  ], this.render.bind(this));
};

Ctrl.destroy = function() {
  Chatroom.remove({_id: this.params('id')}, this.render.bind(this));
};

module.exports = Ctrl;
