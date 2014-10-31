var locomotive = require('locomotive'),
    Controller = locomotive.Controller,
    async = require('async'),
    m = require('mongoose'),

    extend = require('util')._extend,
    Chatroom = m.models.Chatroom,
    Message = m.models.Message,
    ctrl = new Controller();

ctrl.rooms = function() {
  var that = this;
  async.parallel(
    {
      active: function(cb) {
        Message.find().distinct('chatname', cb);
      },
      registered: function(cb) {
        Chatroom.find(function(err, data) {
          if (err) return cb(err);
          var map = {};
          data.forEach(function(r) { map[r.chatname] = r.displayname; });
          cb(null, map);
        });
      }
    },
    function(err, data) {
      var active = data.active,
          map = data.registered;

      that.rooms = active
        .filter(function(r) { return map[r]; })
        .map(function(r) { return { chatname: r, displayname: map[r] }; });

      that.render();
    }
  );
};

ctrl.room = function() {
  var that = this;
  async.parallel(
    {
      room: function(cb) {
        Chatroom.findOne({chatname: that.param('chatname')}, cb);
      },
      years: function(cb) {
        Message.aggregate(
          {$project: {id: 1, year: { $substr: ["$date", 0, 4] }}},
          {$group: {_id: '$year'}},
          function(err, years) {
            cb(err, (years || []).map(function(r) { return r._id; }));
          }
        );
      },
      days: function(cb) {
        var year = that.year = (that.param('year') || new Date().getFullYear()).toString();
        Message.aggregate(
          {$project: {id: 1, year: { $substr: ["$date", 0, 4] }, date: { $substr: ["$date", 5, 5] }}},
          {$match: {year: year}},
          {$group: {_id: '$date'}},
          function(err, days) {
            cb(err, (days || []).map(function(r) { return r._id; }));
          }
        );
      }
    },
    function(err, res) {
      that.room = res.room;
      that.years = res.years;
      that.days = {};
      that.date = new Date();
      that.date.setFullYear(parseInt(that.year, 10));
      res.days.forEach(function(d) {
        var date = d.split('-'),
            month = date.shift(),
            day = date.shift();

        if (!that.days[month]) that.days[month] = {};
        that.days[month][day] = true;
      });

      that.render();
    }
  );
};

ctrl.messages = function() {
  var that = this,
      chatname = this.param('chatname'),
      date = new Date(parseInt(this.param('year'), 10), parseInt(this.param('month') - 1, 10),
                parseInt(this.param('day'), 10) + 1).toJSON().substring(0, 10);
  async.parallel({
    room: function(cb) {
      Chatroom.findOne({chatname: chatname}, cb);
    },
    messages: function(cb) {
      Message.find({chatname: chatname, date: date}).sort({id: 1}).exec(cb);
    }
  }, function(err, res) {
    extend(that, res);
    that.year = that.param('year');
    that.month = that.param('month');
    that.day = that.param('day');
    that.render();
  });
};

module.exports = ctrl;
