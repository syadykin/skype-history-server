/*jshint browser:true */
/*globals module */

module.exports = ['Resource', function($resource) {
  'use strict';

  return $resource('rooms/:displayname/:year/:month/:day');
}];
