/*jshint browser:true */
/*globals module */

module.exports = ['$scope', '$rootScope', '$state', '$stateParams', 'Room',
    function($scope, $rootScope, $state, $stateParams, Room) {
  'use strict';

  $scope.current = new Date();
  $scope.menu = {
    room: false,
    year: false,
    month: false,
    day: false
  };

  $rootScope.$watch('room', function(room) {
    if (room) {
      if (room.year) $scope.current.setFullYear(+room.year);
      if (room.month) $scope.current.setMonth(+room.month - 1);
      if (room.day) $scope.current.setDate(+room.day);
    }
  }, true);

  function setMenu(name) {
    for (var n in $scope.menu) {
      $scope.menu[n] = n == name;
    }
  }

  function go(room) {
    $state.go('showMessages', {displayname: room.displayname, year: room.year, month: room.month, day: room.day});
  }

  $scope.setRoom = function(room) {
    $rootScope.room = Room.room({displayname: room.displayname}, function(room) {
      var today = new Date(), months, days;
      $scope.current = new Date(+today);

      if (today.getFullYear() === +room.year) {
        $rootScope.room.year = +room.year;
        months = Object.keys(room.months).map(function(r) { return parseInt(r, 10); });
        if (months.indexOf(today.getMonth() + 1) !== -1) {
          $rootScope.room.month = today.getMonth() + 1;
          days = Object.keys(room.months[$rootScope.room.month]).map(function(r) { return parseInt(r, 10); });
          if (days.indexOf(today.getDate()) !== -1) {
            $rootScope.room.day = today.getDate();
            go($rootScope.room);
          } else setMenu('day');
        } else setMenu('month');
      } else setMenu('year');
    });
  };

  $scope.setYear = function(y) {
    $rootScope.room = Room.room({displayname: $scope.room.displayname, year: y}, function() {
      setMenu('month');
    });
  };

  $scope.setMonth = function(m) {
    $rootScope.room.month = m;
    delete $rootScope.room.day;
    setMenu('day');
  };

  $scope.setDay = function(d) {
    $rootScope.room.day = d;
    go($rootScope.room);
  };

  $scope.range = function(b, e) {
    var range = [];
    for (; b <= e; b++) range.push(b);
    return range;
  };

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.current.name === 'search') {
      $scope.query = $stateParams.query;
    }
  });

  $scope.search = function() {
    if ($scope.query) {
      $state.go('search', {
        query: $scope.query,
        displayname: $scope.room ? $scope.room.displayname : undefined
      });
    }
  };
}];
