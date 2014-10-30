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

        Message.update({guid: data.guid}, data, {upsert: true}, function(err) {
          if (err) console.log(err);
        });
      });
    });

  });
};
