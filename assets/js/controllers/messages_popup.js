/*jshint browser:true */
/*globals module */

module.exports = ['$scope', 'ManageChatMessage', 'chat',
    function($scope, ManageChatMessage, chat) {
  'use strict';

  $scope.chat = chat;
  $scope.messages = ManageChatMessage.query({chat_id: chat});
}];
