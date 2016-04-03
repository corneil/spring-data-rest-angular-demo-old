(function () {
    'use strict';
    angular.module('springDataRestDemo')
        .service('UserService', ['$q', '$http', '$log', function ($q, $http, $log) {
            return {
                loadAllUsers: function () {
                    var deferred = $q.defer();
                    $log.debug('calling /api/users');
                    $http.get('/api/users').then(
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                            deferred.resolve(response.data._embedded.users);
                        },
                        function (response) {
                            $log.warn('response received:' + response.status + ':' + response.statusText);
                            deferred.reject(response);
                        });
                    return deferred.promise;
                }
            };
        }]);
})();