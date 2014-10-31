var locomotive = require('locomotive'),
    Controller = locomotive.Controller,
    m = require('mongoose'),

    User = m.models.User,
    ctrl = new Controller();

ctrl.main = function() {
    var self = this;
    this.title = 'Locomotive';
    this.render();
};

module.exports = ctrl;
