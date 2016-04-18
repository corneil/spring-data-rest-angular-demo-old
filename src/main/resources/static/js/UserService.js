(function () {
    'use strict';
    angular.module('springDataRestDemo').service('UserService', ['$q', '$http', '$log', 'userCache', function ($q, $http, $log, userCache) {
        function deleteGroupMembersForUser($q, $http, user, $log) {
            var deleteDeferred = $q.defer();
            $http.get('api/group-member/search/findByMember_UserId?userId='+user.userId).then(
                function (response) {
                    $log.debug('response received:' + response.status + ':' + response.statusText);
                    var deletePromises = [];
                    for (var i in response.data._embedded.groupMembers) {
                        var groupMember = response.data._embedded.groupMembers[i];
                        $log.debug('Deleting:' + groupMember._links.self.href);
                        deletePromises.push($http.delete(groupMember._links.self.href,{}));
                    }
                    if (deletePromises.length != 0) {
                        $q.all(deletePromises).then(function (data) {
                            deleteDeferred.resolve(data);
                        }, function (data) {
                            deleteDeferred.reject(data);
                        });
                    } else {
                        deleteDeferred.resolve(response);
                    }
                },
                function (response) {
                    $log.debug('response received:' + response.status + ':' + response.statusText);
                    deleteDeferred.reject(response);
                }
            );
            return deleteDeferred.promise;
        }

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
                var deletePromise = deleteGroupMembersForUser($q, $http, user, $log);
                var deferred = $q.defer();
                deletePromise.then(function () {
                    $log.debug('deleting :' + user._links.self.href);
                    $http.delete(user._links.self.href,{}).then(
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText);
                            userCache.remove(user._links.self.href);
                            deferred.resolve(response);
                        }, function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText);
                            // TODO sanitise message to indicate reason
                            deferred.reject(response);
                        });
                }, function (response) {
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
                        userCache.put(response.data._links.self.href, response.data);
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
                        userCache.put(response.data._links.self.href, response.data);
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