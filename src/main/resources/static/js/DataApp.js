(function () {
    'use strict';
    angular.module('springDataRestDemo', ['ngMessages', 'ngMaterial', 'ui.gravatar', 'md.data.table']);
    angular.module('springDataRestDemo').factory('userCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('user-cache');
    }]);

})();