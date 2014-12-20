module.exports = {
  requiresDowntime: false,

  up: function(db, cb) {
    db.db.collection('chatrooms', function(err, collection) {
      if (err) throw err;
      collection.indexes(function(err, indexes) {
        if (err) throw err;

        var name = indexes
          .filter(function(i) { return i.unique && i.key.chatname === 1; })
          .map(function(i) { return i.name; })
          .shift();
        if (!name) throw new Error("Index not found");

        collection.dropIndex(name, function(err) {
          if (err) throw err;
          cb();
        });
      });
    });
  },

  down: function(db, cb) {
    db.db.collection('chatrooms', function(err, collection) {
      if (err) throw err;
      collection.ensureIndex({chatname: 1}, {unique: true, background: true},
        function(err) {
          if (err) throw err;
          cb();
        });
    });
  }
};

