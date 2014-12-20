var angular = require('angular');

require('angular-resource');
require('angular-sanitize');
require('ui-bootstrap');
require('ui-router');
require('checklist-model');
require('./resources/resource');

angular.module('app', [
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ui.router',
  'checklist-model',
  'app.resource'
])

.config(require('./routes'))

.factory('User', require('./resources/user'))
.factory('Room', require('./resources/room'))
.factory('Message', require('./resources/message'))
.factory('Search', require('./resources/search'))
.factory('ManageChat', require('./resources/manage/chat'))
.factory('ManageChatMessage', require('./resources/manage/chat_message'))
.factory('ManageRoom', require('./resources/manage/room'))

.controller('FlashCtrl', require('./controllers/flash'))
.controller('NavCtrl', require('./controllers/nav'))
.controller('RoomsCtrl', require('./controllers/rooms'))
.controller('UsersCtrl', require('./controllers/users'))
.controller('MessagesCtrl', require('./controllers/messages'))
.controller('SearchCtrl', require('./controllers/search'))
.controller('ManageRoomsCtrl', require('./controllers/manage/rooms'))
.controller('ManageRoomsEditCtrl', require('./controllers/manage/rooms_edit'))
.controller('MessagesPopupCtrl', require('./controllers/messages_popup'))

.directive('dayGrid', require('./directives/day_grid'))
.directive('chatroomMessages', require('./directives/chatroom_messages'))

.filter('monthName', require('./filters/month_name'))
.filter('beautify', require('./filters/beautify'))
.filter('highlight', require('./filters/highlight'))

.run(['$rootScope', 'User', 'Room',
    function($rootScope, User, Room) {
  $rootScope.user = User.get();
  $rootScope.rooms = Room.all();
}]);
