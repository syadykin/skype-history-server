/*jshint browser:true */
/*globals module */

module.exports = [function() {
  'use strict';

  return function(msg, query) {
    query
      .sort(function(a, b) {
        return a.length > b.length;
      })
      .forEach(function(q) {
        msg = msg.replace(new RegExp('(' + q + '[\\wа-я]*)', 'gi'), '<b>$1</b>');
      });
    return msg;
  };
}];
