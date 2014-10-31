var passport = require('../lib/passport');

module.exports = function routes() {

    this.match('login', 'auth#login', { as: 'signin' });
    this.match('login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }), { via: 'post' });
    this.match('logout', 'auth#logout', { as: 'signout' });

    this.match('room/:displayname/:year/:month/:day', 'messages#messages', { as: 'messages' });
    this.match('room/:displayname/:year', 'messages#roomYear', { as: 'roomYear' });
    this.match('room/:displayname', 'messages#room', { as: 'room' });

    this.root('messages#rooms', { as: 'rooms' });
};
