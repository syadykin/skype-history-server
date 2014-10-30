var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id:               { type: Number, index: { unique: true }},
    chatname:         { type: String },
    author:           { type: String },
    from_dispname:    { type: String },
    guid:             { type: String, index: { unique: true }},
    timestamp:        { type: Number },
    type:             { type: Number },
    body_xml:         { type: String },
    chatmsg_type:     { type: Number },
    edited_timestamp: { type: Number }
});

module.exports = mongoose.model('Message', schema);
