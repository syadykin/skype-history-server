module.exports = ['$scope', function($scope) {
  $scope.$on('flash', function(e, type, message) {
    $scope.type = type;
    $scope.message = message;
  });

  $scope.dismiss = function() {
    delete $scope.type;
    delete $scope.message;
  };
}];
