var Mongoose = require('mongoose'),
    Locomotive = require('locomotive'),
    error = require('http-errors'),
    async = require('async'),
    extend = require('extend'),
    sphinx = require('sphinxapi'),

    passport = require('../../lib/passport'),

    Controller = Locomotive.Controller,
    User = Mongoose.models.User,
    Chatroom = Mongoose.models.Chatroom,
    Message = Mongoose.models.Message,
    ApiCtrl = new Controller(),

    normalize = function(obj) {
      obj = obj || {};
      delete obj._id;
      delete obj.__v;
      delete obj.hash;
      return obj;
    };


ApiCtrl.render = function(err, data) {
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

ApiCtrl.rooms = function() {
  var that = this;
  Chatroom.find(function(err, rooms) {
    that.render(err, rooms);
  });
};

ApiCtrl.room = function() {
  var that = this,
      room = this.param('room');

  async.waterfall([
    Chatroom.findOne.bind(Chatroom, {displayname: room}),
    function(room, cb) {
      if (!room) return cb(error(404, "Room not found"));
      room = room.toObject();
      Message.aggregate(
        {$project: {id: 1, chatname: 1, year: { $substr: ["$date", 0, 4] }}},
        {$match: {chatname: room.chatname}},
        {$group: {_id: '$year'}},
        {$sort: {_id: -1}},
        function(err, years) {
          room.years = err ? [] : (years || [])
            .map(function(r) { return r._id; })
            .filter(function(r) { return !!r; });
          room.year = room.years[0];
          cb(err, room);
        }
      );
    },
    function(room, cb) {
      if (!room.year) return cb(room);
      Message.aggregate(
        {$project: {chatname: 1, year: { $substr: ["$date", 0, 4] },
          date: { $substr: ["$date", 5, 5] }}},
        {$match: {year: room.year, chatname: room.chatname}},
        {$group: {_id: '$date', count: {$sum: 1}}},
        function(err, days) {
          if (err) return cb(err);
          days = (days || [])
            .map(function(r) { return {day: r._id, count: r.count}; });
          room.months = {};
          days.forEach(function(d) {
            var date = d.day.split('-'),
                month = +date.shift(),
                day = +date.shift();

            if (!room.months[month]) room.months[month] = {};
            room.months[month][day] = d.count;
          });
          that.render(null, room);
        }
      );
    }
  ], this.render.bind(this));
};

ApiCtrl.messages = function() {
  var that = this,
      room = this.param('room'),
      date = new Date(+this.param('year'),
                      +this.param('month') - 1,
                      +this.param('day') + 1);

  async.waterfall([
    function(cb) {
      Chatroom.findOne({displayname: room}, function(err, room) {
        if (err || !room) return cb(err || error(404, "Room not found"));
        cb(null, room);
      });
    },
    function(room, cb) {
      Message.find({chatname: room.chatname, date: date.toJSON().substring(0, 10)})
        .sort({id: 1}).exec(function(err, messages) {
          if (err) return cb(err);
          cb(null, messages);
        });
    }
  ], this.render.bind(this));
};

ApiCtrl.users = function() {
  var that = this,
      email = this.params('email'),
      password = this.params('password'),
      action = this.params('action') || 'create';

  if (this.req.method === 'GET') {
    console.log();
    this.render(null, normalize(this.res.locals.user && this.res.locals.user.toObject()));
  } else if (this.req.method === 'POST') {
    switch(action) {
      case 'login':
        passport.authenticate('local', function(err, user, info) {
          if (err) return that.render(err);
          if (!user) return that.render(error(404, "User or password is incorrect"));
          that.req.logIn(user, function(err) {
            if (err) return that.render(err);
            that.render(null, normalize(user.toObject()));
          });
        })(this.req, this.res);
        break;

      case 'logout':
        this.req.logOut();
        this.render();
        break;

      case 'create':
        User.findOne(function(err, user) {
          // allow register only first user
          if (user && !that.res.locals.user)
            return that.render(error(403, "You're not authenticated"));

          if (!email || !password)
            return that.render(error(412, "Credentials not provided"));

          User.registerUser(email, password, function(err, user) {
            that.render(err, normalize(user && user.toObject()));
          });
        });
        break;

      default:
        that.render(error(404, "Not found"));
    }
  }
};

ApiCtrl.search = function() {
  var that = this,
      room = this.params('room'),
      query = this.params('query'),
      filter = room ? {displayname: room} : {},
      limit = Math.min(500, +this.params('limit') || 100);

  if (!query) return error(412, "No query given");

  async.waterfall([
    Chatroom.find.bind(Chatroom, filter),
    function(rooms, cb) {
      if (room && rooms.length !== 1) return cb(error(404, 'Room not found'));
      var cl = new sphinx(that.app.get('sphinx host'), that.app.get('sphinx port'));
      cl.Query(query, cb);
    },
    function(result, cb) {
      cb(null, {
        query: result.words.map(function(w) { return w.word; }),
        hits: result.total_found,
        matches: result.matches.map(function(m) {
          return extend(m.attrs, {score: m.weight});
        })
      });
    }
  ], this.render.bind(this));
};

module.exports = ApiCtrl;
