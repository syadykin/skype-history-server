/*jshint browser:true */
/*globals module */

module.exports = function() {
  'use strict';

  return function(month) {
    return [
      '',
      'January',
      'Febriary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'Decemmber'
    ][month];
  };
};
