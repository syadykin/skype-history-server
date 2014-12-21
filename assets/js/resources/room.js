/*jshint browser:true */
/*globals module */

module.exports = ['Resource', function($resource) {
  'use strict';

  return $resource('rooms/:displayname', {}, {
    all: {method: 'get', isArray: true},
    room: {method: 'get'}
  });
}];
