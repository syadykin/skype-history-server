/*jslint node:true */
'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id:               { type: Number, index: { unique: true }},
    chatname:         { type: String },
    author:           { type: String },
    from_dispname:    { type: String },
    guid:             { type: String, index: { unique: true }},
    timestamp:        { type: Number },
    date:             { type: String },
    time:             { type: String },
    type:             { type: Number },
    body_xml:         { type: String },
    chatmsg_type:     { type: Number },
    edited_timestamp: { type: Number }
});

module.exports = mongoose.model('Message', schema);
