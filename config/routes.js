var passport = require('../lib/passport');

module.exports = function routes() {
    this.root('messages#rooms', { as: 'rooms', via: ['get']});

    this.match('login', 'auth#login', { as: 'signin' });
    this.match('login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }), { via: 'post' });
    this.match('logout', 'auth#logout', { as: 'signout' });
    this.match('signup', 'auth#signup', { via: ['get', 'post'], as: 'signup' });

    this.match(':chatname', 'messages#room', { as: 'room', via: ['get']});
    this.match(':chatname/:year', 'messages#room', { as: 'roomYear', via: ['get']});
    this.match(':chatname/:year/:month/:day', 'messages#messages', { as: 'messages', via: ['get']});
};
