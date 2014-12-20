module.exports = ['$modal', function($modal) {
  return {
    restirict: 'A',
    scope: {
      chat: '=chatroomMessages'
    },
    link: function($scope, $elem) {
      $elem.on('click', function(e) {
        e.preventDefault();
        $modal.open({
          templateUrl: 't/messages_popup.html',
          controller: 'MessagesPopupCtrl',
          size: 'lg',
          resolve: {
            chat: function () {
              return $scope.chat;
            }
          }
        });
      });
    }
  };
}];
