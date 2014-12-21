/*jshint browser:true */
/*globals module */

module.exports = ['$scope', '$rootScope', 'messages',
    function($scope, $rootScope, messages) {
  'use strict';

  $scope.current = new Date();
  $rootScope.room.$promise.then(function() {
    if ($rootScope.room.day) {
      $scope.current.setFullYear($rootScope.room.year);
      $scope.current.setMonth($rootScope.room.month - 1);
      $scope.current.setDate($rootScope.room.day);
    }
  });
  $scope.messages = messages;
}];
