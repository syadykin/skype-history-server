/*jshint browser:true */
/*globals module */

module.exports = ['$scope', '$rootScope', '$stateParams', '$timeout',
      'smoothScroll', 'messages',
    function($scope, $rootScope, $stateParams, $timeout,
      smoothScroll, messages) {
  'use strict';

  $scope.line = $stateParams.line ? parseInt($stateParams.line, 10) : null;

  $scope.current = new Date();
  $rootScope.room.$promise.then(function() {
    if ($rootScope.room.day) {
      $scope.current.setFullYear($rootScope.room.year);
      $scope.current.setMonth($rootScope.room.month - 1);
      $scope.current.setDate($rootScope.room.day);
    }
  });

  $scope.messages = messages;
  messages.$promise.then(function() {
    // dirty hack to make sure elements are already rendered
    $timeout(function() {
      if ($scope.line !== null) {
        smoothScroll(document.getElementById('m' + $scope.line), {offset: 100});
      }
    }, 0);
  });
}];
