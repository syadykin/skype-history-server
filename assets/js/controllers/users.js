module.exports = ['$scope', '$rootScope', '$state', 'User',
    function($scope, $rootScope, $state, User) {

  $scope.user = new User();

  if ($state.current.name === 'login' && $rootScope.user.email ||
      $state.current.name === 'logout' && !$rootScope.user.email) {
    $state.go('index');
  }

  if ($state.current.name === 'logout') {
    User.logout(function() {
      $rootScope.user = {};
      $rootScope.$broadcast('flash', 'success', 'Logged out');
      $state.go('index');
    });
  }

  $scope.login = function() {
    User.login($scope.user,
      function(user) {
        $rootScope.user = user;
        $rootScope.$broadcast('flash', 'success', 'Logged in successfuly');
        $state.go('index');
      },
      function(err) {
        $rootScope.$broadcast('flash', 'error', err.data.message);
      }
    );
  };
}];
