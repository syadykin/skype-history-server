var Controller = require('locomotive').Controller,
    fs = require('fs'),
    PagesCtrl = new Controller();

PagesCtrl.t = function() {
  var that = this,
      path = this.param('path');
  fs.readFile('assets/templates/' + path, function(err, content) {
    if (err) {
      that.__res.status(404).send('Not Found');
    } else {
      that.__res.set('Content-Type', 'text/ng-template').send(content);
    }
  });
};

PagesCtrl.root = function() {
  this.render();
};

module.exports = PagesCtrl;
