/*jshint browser:true */
/*globals module */

module.exports = ['Resource', function($resource) {
  'use strict';

  return $resource('manage/chats/:chat_id/messages/:id');
}];
