module.exports = function routes() {
    this.match('users', 'api#users', { via: ['get', 'post'] });

    this.match('t/:path', 'pages#t');

    this.match('search/:query/:room', 'api#search');
    this.match('search/:query', 'api#search');

    this.match('rooms/:room/:year/:month/:day', 'api#messages');
    this.match('rooms/:room', 'api#room');
    this.match('rooms', 'api#rooms');

    this.root('pages#root', { as: 'root' });
};
