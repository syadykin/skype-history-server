var locomotive = require('locomotive'),
    error = require('http-errors'),
    Controller = locomotive.Controller,
    async = require('async'),
    m = require('mongoose'),

    extend = require('util')._extend,
    Chatroom = m.models.Chatroom,
    Message = m.models.Message,
    ctrl = new Controller();

ctrl.rooms = function() {
  var that = this;
  Chatroom.find(function(err, rooms) {
    that.rooms = rooms;
    that.render();
  });
};

ctrl.room = function() {
  var that = this,
      displayname = this.param('displayname');
      year = that.year = (that.param('year') || new Date().getFullYear()).toString();
  async.waterfall([
    function getRoom(cb) {
      Chatroom.findOne({displayname: displayname}, cb);
    },
    function(room, cb) {
      if (!room) return cb(error(404));

      async.parallel({
        years: function(cb) {
          Message.aggregate(
            {$project: {id: 1, chatname: 1, year: { $substr: ["$date", 0, 4] }}},
            {$match: {chatname: room.chatname}},
            {$group: {_id: '$year'}},
            function(err, years) {
              cb(err, (years || []).map(function(r) { return r._id; }));
            }
          );
        },
        days: function(cb) {
          Message.aggregate(
            {$project: {chatname: 1, year: { $substr: ["$date", 0, 4] }, date: { $substr: ["$date", 5, 5] }}},
            {$match: {year: year, chatname: room.chatname}},
            {$group: {_id: '$date', count: {$sum: 1}}},
            function(err, days) {
              cb(err, (days || []).map(function(r) { return {day: r._id, count: r.count}; }));
            }
          );
        }
      }, function(err, res) {
        cb(err, room, res.years, res.days);
      });
    }
  ], function(err, room, years, days) {
    if (err) return that.error(err);

    that.room = room;
    that.years = years;
    that.days = {};
    that.date = new Date();
    that.date.setFullYear(+year);

    days.forEach(function(d) {
      var date = d.day.split('-'),
          month = date.shift(),
          day = date.shift();

      if (!that.days[month]) that.days[month] = {};
      that.days[month][day] = d.count;
    });

    that.render();
  });
};

ctrl.roomYear = function() {
  this.invoke('messages#room');
};

ctrl.messages = function() {
  var that = this,
      displayname = this.param('displayname'),
      year = this.year = +this.param('year'),
      month = this.month = +this.param('month'),
      day = this.day = +this.param('day'),
      date = new Date(year, month - 1, day + 1).toJSON().substring(0, 10);

  async.waterfall([
    function(cb) {
      Chatroom.findOne({displayname: displayname}, function(err, room) {
        if (err || !room) return cb(err || error(404));
        cb(null, room);
      });
    },
    function(room, cb) {
      Message.find({chatname: room.chatname, date: date})
        .sort({id: 1}).exec(function(err, messages) {
          if (err) return cb(err);
          cb(null, room, messages);
        });
    }
  ], function(err, room, messages) {
    that.room = room;
    that.messages = messages;
    that.render();
  });
};

module.exports = ctrl;
