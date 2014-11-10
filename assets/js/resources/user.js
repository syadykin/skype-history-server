module.exports = ['$resource', function($resource) {
  return $resource('users', {}, {
    login: {method: 'post', params: {action: 'login'}},
    logout: {method: 'post', params: {action: 'logout'}},
    register: {method: 'post'},
    get: {method: 'get'}
  });
}];
