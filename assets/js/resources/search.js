/*jshint browser:true */
/*globals module */

module.exports = ['Resource', function($resource) {
  'use strict';

  return $resource('search/:query/:displayname', {}, {
    query: {method: 'get'}
  });
}];
