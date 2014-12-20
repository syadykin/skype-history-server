/*jslint node:true*/
'use strict';

var Mongoose = require('mongoose'),
    Locomotive = require('locomotive'),
    error = require('http-errors'),

    Controller = Locomotive.Controller,
    Message = Mongoose.models.Message,
    Ctrl = new Controller();

Ctrl.render = function(err, data) {
  var that = this;

  this.respond({
    json: function() {
      if (err) {
        err = {
          code: err.status,
          message: err.message
        };
        that.res.status(err.code);
      }
      that.res.json(err || data || {});
    }
  });
};

Ctrl.before('*', function(cb) {
  return this.res.locals.user ? cb() : this.render(error(403));
});

Ctrl.index = function() {
  Message.find({chatname: this.params('chat_id')}).limit(100)
    .exec(this.render.bind(this));
};

module.exports = Ctrl;
