module.exports = function routes() {
  this.match('users', 'api#users', {via: ['get', 'post']});

  // manage
  this.namespace('manage', function() {
    this.resources('rooms', {except: ['new', 'edit']});
    this.resources('chats', {only: ['index']}, function() {
      this.resources('messages', {only: ['index']});
    });
  });

  // angular templates
  this.match('t/:path', 'pages#t');

  // search
  this.match('search/:query/:room', 'api#search');
  this.match('search/:query', 'api#search');

  // rooms and messages api
  this.match('rooms/:room/:year/:month/:day', 'api#messages');
  this.match('rooms/:room', 'api#room');
  this.match('rooms', 'api#rooms');

  this.root('pages#root', {as: 'root'});
};
