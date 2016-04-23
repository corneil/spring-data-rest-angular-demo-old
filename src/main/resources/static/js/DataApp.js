(function () {
    'use strict';
    angular.module('springDataRestDemo', ['ngResource', 'ngMessages', 'ngMaterial', 'ui.gravatar', 'md.data.table']);
    angular.module('springDataRestDemo').factory('userCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('user-cache');
    }]);
    angular.module('springDataRestDemo').factory('groupCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('group-cache');
    }]);

})();