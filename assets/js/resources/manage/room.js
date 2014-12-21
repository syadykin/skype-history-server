/*jshint browser:true */
/*globals module */

module.exports = ['Resource', function($resource) {
  'use strict';

  return $resource('manage/rooms/:id', {id: '@_id'});
}];
