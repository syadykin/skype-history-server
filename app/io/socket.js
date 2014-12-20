/*jslint node:true */
'use strict';

var Message = require('../models/message');

module.exports = function() {
  // listen to the connect event
  this.sio.sockets.on('connection', function(socket) {
    console.log('connected');

    socket.on('data', function(data) {
      data.forEach(function(data) {

        // remove null fields
        Object.keys(data).forEach(function(k) {
          if (data[k] === null) delete data[k];
        });

        var date = new Date(data.timestamp * 1000).toJSON();

        data.date = date.substring(0, 10);
        data.time = date.substring(11, 19);

        Message.update({guid: data.guid}, data, {upsert: true}, function(err) {
          if (err) console.log(err);
        });
      });
    });

  });
};
