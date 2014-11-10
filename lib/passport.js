var async = require('async'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../app/models/user');

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    function(email, password, next) {
        async.waterfall([
            async.apply(User.findOne.bind(User), { email: email }),
            function (user, next) {
                next(user ? null : new Error("Unknown user"), user);
            },
            function (user, next) {
                user.validPassword(password, function(err, isValid) {
                    next(err, user, isValid);
                });
            },
            function (user, isValid, next) {
                next(isValid ? null : new Error("Invalid password"), user);
            }
        ], function(err, user) {
            next(null, err ? false : user, { message: err ? err.message : undefined });
        });
    })
);

passport.serializeUser(function(user, next) {
    next(null, user.id);
});

passport.deserializeUser(function(id, next) {
    User.findOne({_id: id}, function(err, user) {
        next(err, user);
    });
});

module.exports = passport;
