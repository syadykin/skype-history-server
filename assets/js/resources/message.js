module.exports = ['$resource', function($resource) {
  return $resource('rooms/:displayname/:year/:month/:day');
}];
