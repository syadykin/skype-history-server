module.exports = ['$scope', 'ManageChatMessage', 'chat',
    function($scope, ManageChatMessage, chat) {
  $scope.chat = chat;
  $scope.messages = ManageChatMessage.query({chat_id: chat});
}];
