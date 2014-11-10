var angular = require('angular');

require('angular-resource');
require('angular-sanitize');
require('ui-bootstrap');
require('ui-router');

angular.module('app', [
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ui.router'
])

.config(require('./routes'))

.factory('User', require('./resources/user'))
.factory('Room', require('./resources/room'))
.factory('Message', require('./resources/message'))
.factory('Search', require('./resources/search'))

.controller('FlashCtrl', require('./controllers/flash'))
.controller('NavCtrl', require('./controllers/nav'))
.controller('RoomsCtrl', require('./controllers/rooms'))
.controller('UsersCtrl', require('./controllers/users'))
.controller('MessagesCtrl', require('./controllers/messages'))
.controller('SearchCtrl', require('./controllers/search'))

.directive('dayGrid', require('./directives/day-grid'))

.filter('monthName', require('./filters/month_name'))
.filter('beautify', require('./filters/beautify'))
.filter('highlight', require('./filters/highlight'))

.run(['$rootScope', 'User', 'Room', function($rootScope, User, Room) {
  $rootScope.user = User.get();
  $rootScope.rooms = Room.all();
}]);
