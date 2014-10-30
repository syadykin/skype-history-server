var passport = require('../lib/passport');

module.exports = function routes() {
    this.root('pages#main');

    this.match('login', 'auth#login', { as: 'signin' });
    this.match('login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }), { via: 'post' });
    this.match('logout', 'auth#logout', { as: 'signout' });
    this.match('signup', 'auth#signup', { via: ['get', 'post'], as: 'signup' });

};
