module.exports = ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
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
    });
}];
