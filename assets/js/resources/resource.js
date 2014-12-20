/*jslint browser:true */
/*globals angular */

(function() {
  'use strict';

  angular.module('app.resource', ['ngResource'])
    .factory('Resource', ['$resource', function($resource) {
      return function(url, params, methods) {
        var defaults = {
              update: { method: 'put', isArray: false },
              create: { method: 'post' }
            },
            resource = $resource(url, params, angular.extend(defaults, methods));

        resource.prototype.$save = function() {
          if (!this._id) {
            return this.$create.apply(this, arguments);
          } else {
            return this.$update.apply(this, arguments);
          }
        };

        return resource;
      };
    }]);
}());
