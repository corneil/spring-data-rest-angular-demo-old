function loadGroupOwner(group, UserService, $log) {
    var promise = UserService.loadUser(group._links.groupOwner.href);
    promise.then(function (user) {
        $log.debug('GroupServer.loadAllGroups.groupOwner.loaded:' + group.groupName + ':' + user.userId);
        group._groupOwner = user;
        group.groupOwner = user._links.self.href;
    }, function (response) {
        $log.debug('error:response:' + JSON.stringify(response));
        group._groupOwner = undefined;
    });
    return promise;
}
(function () {
    'use strict';
    angular.module('springDataRestDemo').factory('userCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('user-cache');
    }]);
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
                        $log.warn('response received:' + response.status + ':' + response.statusText);
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
    angular.module('springDataRestDemo')
        .service('GroupService', ['$q', '$http', '$log', 'UserService', function ($q, $http, $log, UserService) {

            return {
                loadAllGroups: function () {
                    var deferred = $q.defer();
                    $log.debug('calling /api/groups');
                    $http.get('/api/groups').then(
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                            var groups = response.data._embedded.groups;
                            var promises = [];
                            for (var g in groups) {
                                promises.push(loadGroupOwner(groups[g], UserService, $log));
                            }
                            $q.all(promises).then(function (data) {
                                $log.debug('all.then:' + JSON.stringify(data));
                                deferred.resolve(groups);
                            }, function (response) {
                                deferred.reject(response);
                            });
                        },
                        function (response) {
                            $log.warn('response received:' + response.status + ':' + response.statusText);
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },
                createGroup: function (group) {
                    var deferred = $q.defer();
                    $log.debug('creating:' + JSON.stringify(group));
                    $log.debug('calling /api/groups');
                    $http.post('/api/groups', group).then(
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                            response.data._groupOwner = savedOwner;
                            response,data.groupOwner = savedOwner._links.self.href;
                            deferred.resolve(response.data);
                        },
                        function (response) {
                            $log.warn('response received:' + response.status + ':' + response.statusText);
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },
                saveGroup: function (group) {
                    var deferred = $q.defer();
                    $log.debug('saving:' + JSON.stringify(group));
                    $log.debug('PUT -> ' + ':' + group._links.self.href);
                    $http.put(group._links.self.href, group).then(
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