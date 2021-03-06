/*jshint browser:true */
/*globals module */

module.exports = ['$scope', '$state', 'room', 'chats',
    function($scope, $state, room, chats) {
  'use strict';

  $scope.room = room;
  $scope.chats = chats;

  $scope.save = function() {
    $scope.room.$save(function() {
      $state.go('manageRooms');
    }, function(errors) {
      $scope.errors = errors.data;
    });
  };

  $scope.remove = function() {
    $scope.room.$remove(function() {
      $state.go('manageRooms');
    }, function(errors) {
      $scope.errors = errors.data;
    });
  };
}];
