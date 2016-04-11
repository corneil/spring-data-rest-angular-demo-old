(function () {
    'use strict';
    angular.module('springDataRestDemo').service('UserService', ['$q', '$http', '$log', 'userCache', function ($q, $http, $log, userCache) {

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
            loadUser: function (userRef) {
                $log.debug('locating:' + userRef);
                var deferred = $q.defer();
                var user = userCache.get(userRef);
                if (user != undefined) {
                    deferred.resolve(user);
                } else {
                    $log.debug('loading:' + userRef);
                    $http.get(userRef).then(function (response) {
                        user = response.data;
                        userCache.put(userRef, user);
                        deferred.resolve(user);
                    }, function (response) {
                        deferred.reject(response);
                    });
                }
                return deferred.promise;
            },
            deleteUser: function (user) {
                var deferred = $q.defer();
                $log.debug('deleting :' + user._links.self.href);
                $http.delete(user._links.self.href).then(
                    function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        userCache.removeAll();
                        deferred.resolve(response);
                    }, function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        deferred.reject(response);
                    });
                return deferred.promise;
            },
            createUser: function (user) {
                var deferred = $q.defer();
                $log.debug('calling /api/users');
                $http.post('/api/users', user).then(
                    function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                        userCache.removeAll();
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        $log.warn('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                        deferred.reject(response);
                    });
                return deferred.promise;
            },
            saveUser: function (user) {
                var deferred = $q.defer();
                $log.debug('PUT -> ' + ':' + user._links.self.href);
                $http.put(user._links.self.href, user).then(
                    function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                        deferred.resolve(response.data);
                        userCache.removeAll();
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