var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    chatname:         { type: String, index: { unique: true }},
    displayname:      { type: String }
});

module.exports = mongoose.model('Chatroom', schema);
