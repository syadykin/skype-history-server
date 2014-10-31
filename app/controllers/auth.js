var locomotive = require('locomotive'),
    Controller = locomotive.Controller,
    User = require('../models/user'),
    ctrl = new Controller();

ctrl.login = function() {
    this.render();
};

ctrl.logout = function() {
    this.req.logOut();
    this.res.redirect('/');
};

ctrl.signup = function() {
    if (this.req.method === 'GET') {
        this.render();
    } else {
        var controller = this;
        User.registerUser(this.param('email'), this.param('password'), function(err, user) {
            if (err) {
                controller.error(err);
            } else {
                controller.redirect('/');
            }
        });
    }
};

module.exports = ctrl;
