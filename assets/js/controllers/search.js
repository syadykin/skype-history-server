/*jshint browser:true */
/*globals module */

module.exports = ['$scope', '$rootScope', '$stateParams', '$state', 'Search',
    function($scope, $rootScope, $stateParams, $state, Search) {
  'use strict';

  $rootScope.rooms.$promise.then(function() {
    Search.query($stateParams, function(data) {
      var dict = {};
      $rootScope.rooms.forEach(function(r) { dict[r.chatname] = r.displayname; });

      $scope.query = $stateParams.query;
      $scope.words = data.query;
      $scope.hits = data.hits;
      $scope.results = {};

      data.matches.forEach(function(m) {
        if (!$scope.results[dict[m.room]]) {
          $scope.results[dict[m.room]] = [];
        }
        $scope.results[dict[m.room]].push(m);
      });
    });
  });

  $scope.go = function(room, date) {
    date = date.split('-');
    $state.go('showMessages', {
      displayname: room,
      year: date[0],
      month: date[1],
      day: date[2]
    });
  };
}];
