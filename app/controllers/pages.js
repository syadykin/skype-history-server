var locomotive = require('locomotive'),
    Controller = locomotive.Controller,
    async = require('async'),
    m = require('mongoose'),
    callOn = require('../../lib/utils').callOn,

    User = m.models.User;

var pagesController = new Controller();

pagesController.main = function() {
    var self = this;
    this.title = 'Locomotive';
    this.render();
};

module.exports = pagesController;
