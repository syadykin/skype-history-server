/*jslint node:true */
'use strict';

var mongoose = require('mongoose'),
    schema = new mongoose.Schema({
      chatname:    { type: [String] },
      displayname: { type: String, unique: true, index: { unique: true }, default: '' }
    }),
    model = mongoose.model('Chatroom', schema);

schema.plugin(require('mongoose-unique-validator'));

schema.pre('validate', function(next) {
  if (typeof this.displayname === 'string') {
    this.displayname = this.displayname.replace(/^\d+/, '').replace(/\d+$/, '');
  }
  next();
});

schema.path('displayname').validate(function(value) {
  return typeof value === 'string' && value.length !== 0;
}, 'Must not be empty');

module.exports = model;
