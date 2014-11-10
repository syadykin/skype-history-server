module.exports = ['$resource', function($resource) {
  return $resource('rooms/:displayname', {}, {
    all: {method: 'get', isArray: true},
    room: {method: 'get'}
  });
}];
