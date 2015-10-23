/*jshint browser:true */
/*globals module */

module.exports = ['$scope', '$rootScope', '$stateParams', '$state', 'Search',
    function($scope, $rootScope, $stateParams, $state, Search) {
  'use strict';

  $rootScope.rooms.$promise.then(function() {
    Search.query($stateParams, function(data) {
      var dict = {};
      $rootScope.rooms.forEach(function(r) {
        r.chatname.forEach(function(name) {
          dict[name] = r.displayname;
        });
      });

      $scope.query = $stateParams.query;
      $scope.words = data.query;
      $scope.hits = data.hits;
      $scope.results = {};

      data.matches.forEach(function(m) {
        if (!$scope.results[dict[m.room]]) {
          $scope.results[dict[m.room]] = [];
        }
        var date = m.date.split('-');

        m.link = $state.href('showMessages', {
          displayname: dict[m.room],
          year: date[0],
          month: date[1],
          day: date[2],
          line: m.id
        });

        $scope.results[dict[m.room]].push(m);
      });
    });
  });
}];
