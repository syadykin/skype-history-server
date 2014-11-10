module.exports = ['$resource', function($resource) {
  return $resource('search/:query/:displayname', {}, {
    query: {method: 'get'}
  });
}];
