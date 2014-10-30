var express = require('express'),
    poweredBy = require('connect-powered-by'),
    passport = require('../../lib/passport'),
    flash = require('connect-flash'),
    override = require('method-override'),
    mongoose = require('mongoose'),
    SessionStore = require('session-mongoose')(express);

module.exports = function() {
    if ('development' == this.env) {
        this.use(express.logger());
    }
    this.use(poweredBy('Locomotive'));
    this.use(express.favicon());
    this.use(express.static(__dirname + '/../../public'));
    this.use(override());
    this.use(express.cookieParser());
    this.use(express.bodyParser());
    this.use(express.session({
        store: new SessionStore({
            sweeper: false,
            connection: mongoose.connection
            // db: mongoose.connection.db
        }),
        secret: '$I7oxp<N/]laIrknQA3Ajf1<Y4vH]bfGK9DFQ?A?Chbe2.69.X'
    }));
    this.use(passport.initialize());
    this.use(passport.session());
    this.use(flash());
    this.use(function(req, res, next) {
        res.locals.user = req.user;
        res.locals.flash = req.flash();
        next();
    });
    this.use(this.router);
    this.use(express.errorHandler());
};
