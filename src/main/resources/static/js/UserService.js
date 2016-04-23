(function () {
    'use strict';
    angular.module('springDataRestDemo').service('UserService', ['$q', '$resource', '$log', 'userCache', function ($q, $resource, $log, userCache) {
        var Users = $resource('/api/users', {}, {
            create: {method: 'POST'},
            list: {method: 'GET'}
        });

        function deleteGroupMembersForUser($q, $resource, user, $log) {
            var deleteDeferred = $q.defer();
            var MemberSearch = $resource('/api/group-member/search/findByMember_UserId?userId=:userId', {userId: '@userId'});
            MemberSearch.get({userId: user.userId}).$promise.then(
                function (groupMembers) {
                    var deletePromises = [];
                    for (var i in groupMembers._embedded.groupMembers) {
                        var groupMember = groupMembers._embedded.groupMembers[i];
                        $log.debug('Deleting:' + groupMember._links.self.href);
                        var GroupMember = $resource(groupMember._links.self.href);
                        deletePromises.push(GroupMember.delete().$promise);
                    }
                    if (deletePromises.length != 0) {
                        $q.all(deletePromises).then(function (data) {
                            deleteDeferred.resolve(data);
                        }, function (response) {
                            $log.error('deleteGroupMembersForUser:failed:' + JSON.stringify(response,null,2));
                            deleteDeferred.reject(response);
                        });
                    } else {
                        deleteDeferred.resolve(response);
                    }
                },
                function (response) {
                    $log.error('deleteGroupMembersForUser:failed:' + JSON.stringify(response,null,2));
                    deleteDeferred.reject(response);
                }
            );
            return deleteDeferred.promise;
        }

        return {
            loadAllUsers: function () {
                var deferred = $q.defer();
                $log.debug('calling /api/users');
                Users.list().$promise.then(
                    function (users) {
                        deferred.resolve(users._embedded.users);
                    },
                    function (response) {
                        $log.error('loadAllUsers:failed:' + JSON.stringify(response,null,2));
                        deferred.reject(response);
                    });
                return deferred.promise;
            },
            loadUser: function (userRef) {
                $log.debug('locating:' + userRef);
                var User = $resource(userRef, {}, {get: {method: 'GET', cache: userCache}});
                return User.get().$promise;
            },
            deleteUser: function (user) {
                var deletePromise = deleteGroupMembersForUser($q, $resource, user, $log);
                var deferred = $q.defer();
                deletePromise.then(function () {
                    $log.debug('deleting :' + user._links.self.href);
                    var User = $resource(user._links.self.href);
                    User.delete().$promise.then(function (response) {
                        userCache.remove(user._links.self.href);
                        deferred.resolve(response);
                    }, function (response) {
                        $log.error('deleteUser:failed:' + JSON.stringify(response,null,2));
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
                Users.create(user).$promise.then(
                    function (user) {
                        userCache.put(user._links.self.href, user);
                        deferred.resolve(user);
                    },
                    function (response) {
                        $log.error('createUser:failed:' + JSON.stringify(response,null,2));
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            },
            saveUser: function (user) {
                var deferred = $q.defer();
                $log.debug('PUT -> ' + ':' + user._links.self.href);
                var User = $resource(user._links.self.href, {}, {save: {method: 'PUT'}});
                User.save(user).$promise.then(
                    function (response) {
                        userCache.put(response.data._links.self.href, response.data);
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        $log.error('saveUser:failed:' + JSON.stringify(response,null,2));
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
        };
    }]);
})();