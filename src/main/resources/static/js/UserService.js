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
                },
                createUser: function(user) {
                    var deferred = $q.defer();
                    $log.debug('calling /api/users');
                    $http.post('/api/users', user).then(
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                            deferred.resolve(response.data);
                        },
                        function (response) {
                            $log.warn('response received:' + response.status + ':' + response.statusText);
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },
                saveUser: function(user) {
                    var deferred = $q.defer();
                    $log.debug('PUT -> ' + ':' + user._links.self.href);
                    $http.put(user._links.self.href, user).then(
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                            deferred.resolve(response.data);
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