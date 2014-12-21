/*jshint browser:true */
/*globals module */

module.exports = ['Resource', function($resource) {
  'use strict';

  return $resource('users', {}, {
    login: {method: 'post', params: {action: 'login'}},
    logout: {method: 'post', params: {action: 'logout'}},
    register: {method: 'post'},
    get: {method: 'get'}
  });
}];
