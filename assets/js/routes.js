/*jshint browser:true */
/*globals module */

module.exports = ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
  'use strict';

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 't/index.html',
      controller: 'RoomsCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 't/login.html',
      controller: 'UsersCtrl'
    })
    .state('logout', {
      url: '/logout',
      template: '',
      controller: 'UsersCtrl'
    })
    .state('search', {
      url: '/search/:query/:displayname',
      templateUrl: 't/search.html',
      controller: 'SearchCtrl'
    })
    .state('showMessages', {
      url: '/room/:displayname/:year/:month/:day',
      templateUrl: 't/messages.html',
      controller: 'MessagesCtrl',
      resolve: {
        messages: ['$rootScope', '$stateParams', 'Message', 'Room',
          function($rootScope, $stateParams, Message, Room) {
            if (!$rootScope.room) {
              $rootScope.room = Room.room(
                {displayname: $stateParams.displayname, year: $stateParams.year},
                function() {
                  $rootScope.room.year = +$stateParams.year;
                  $rootScope.room.month = +$stateParams.month;
                  $rootScope.room.day = +$stateParams.day;
                }
              );
            }
            return Message.query($stateParams);
          }]
      }
    })
    .state('manageRooms', {
      url: '/manage/rooms',
      templateUrl: 't/manage_rooms.html',
      controller: 'ManageRoomsCtrl',
      resolve: {
        rooms: ['ManageRoom', function(ManageRoom) {
          return ManageRoom.query();
        }],
        chats: ['ManageChat', function(ManageChat) {
          return ManageChat.query();
        }]
      }
    })
    .state('manageRoomsCreate', {
      url: '/manage/rooms/create',
      templateUrl: 't/manage_rooms_edit.html',
      controller: 'ManageRoomsEditCtrl',
      resolve: {
        room: ['ManageRoom', function(ManageRoom) {
          return new ManageRoom();
        }],
        chats: ['ManageChat', function(ManageChat) {
          return ManageChat.query();
        }]
      }
    })
    .state('manageRoomsEdit', {
      url: '/manage/rooms/edit/:id',
      templateUrl: 't/manage_rooms_edit.html',
      controller: 'ManageRoomsEditCtrl',
      resolve: {
        room: ['ManageRoom', '$stateParams', function(ManageRoom, $stateParams) {
          return ManageRoom.get({id: $stateParams.id});
        }],
        chats: ['ManageChat', function(ManageChat) {
          return ManageChat.query();
        }]
      }
    });
}];
