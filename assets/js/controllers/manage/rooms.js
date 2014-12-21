/*jshint browser:true */
/*globals module */

module.exports = ['$scope', 'chats', 'rooms', function($scope, chats, rooms) {
  'use strict';

  $scope.rooms = rooms;
  $scope.chats = chats;
}];
