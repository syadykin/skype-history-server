/*jshint browser:true */
/*globals module */

module.exports = [function() {
  'use strict';

  return {
    restirict: 'E',
    scope: {
      date: '=gridDate',
      exists: '=gridExists',
      select: '=gridSelect',
      current: '=gridCurrent'
    },
    templateUrl: 't/day-grid.html',
    replace: true,
    link: function($scope) {
      $scope.$watch('date', function() {
        var today = new Date(),
            date = new Date(+$scope.date),
            month = date.getMonth(),
            // day of the week starting from Monday for first day of the month
            day = ((new Date(date.getFullYear(), month, 1)).getDay() + 6) % 7,
            days = (new Date(date.getFullYear(), month + 1, 0)).getDate(),
            prevDays = (new Date(date.getFullYear(), month, 0)).getDate(),
            weeks = Math.ceil((days + day) / 7), // weeks in month
            current = today.getFullYear() === date.getFullYear() &&
                      today.getMonth() === date.getMonth(),
            exists = $scope.exists || {},
            keys = Object.keys(exists).map(function(k) { return parseInt(k, 10); }),
            w, d, c = [];

       day = 1 - day;

        for (w = 0; w < weeks; w++) {
          c[w] = [];
          for (d = 0; d < 7; d++) {
            c[w][d] = {
              c: current && today.getDate() === day,
              d: day < 1 ? prevDays + day : (day > days ? day - days : day),
              l: keys.indexOf(day) !== -1,
              o: day < 1 || day > days || +date.setDate(day) > today,
              t: exists[day] || '',
              s: day === +$scope.current
            };
            day++;
          }
        }
        $scope.cal = c;
      }, true);
    }
  };
}];
