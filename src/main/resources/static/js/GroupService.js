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
    angular.module('springDataRestDemo')
        .service('GroupService', ['$q', '$http', '$log', 'UserService', 'groupCache', function ($q, $http, $log, UserService, groupCache) {

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
                loadGroup: function(groupRef) {
                    $log.debug('loadGroup:' + groupRef);
                    var deferred = $q.defer();
                    var group = groupCache.get(groupRef);
                    if (group != undefined) {
                        deferred.resolve(group);
                    } else {
                        $http.get(groupRef).then(function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                            groupCache.put(groupRef, response.data);
                            deferred.resolve(response.data);
                        }, function (response) {
                            $log.warn('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                            deferred.reject(response);
                        });
                    }
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
                            groupCache.put(response.data._links.self.href, response.data);
                            deferred.resolve(response.data);
                        },
                        function (response) {
                            $log.warn('response received:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
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
                            groupCache.put(response.data._links.self.href, response.data);
                            deferred.resolve(response.data);
                        },
                        function (response) {
                            $log.warn('response received:' + response.status + ':' + response.statusText);
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },
                deleteGroup:function(group) {
                    var deleteDeferred = $q.defer();
                    $http.post('/api/group-member/search/deleteByMemberOfgroup_GroupName', {groupName: group.groupName}).then(
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText);
                            deleteDeferred.resolve(response);
                        },
                        function (response) {
                            $log.debug('response received:' + response.status + ':' + response.statusText);
                            deleteDeferred.reject(response);
                        }
                    );
                    var deferred = $q.defer();
                    deleteDeferred.promise.then(function () {
                        $log.debug('deleting :' + group._links.self.href);
                        $http.delete(group._links.self.href, {}).then(
                            function (response) {
                                $log.debug('response received:' + response.status + ':' + response.statusText);
                                groupCache.remove(group._links.self.href);
                                deferred.resolve(response);
                            }, function (response) {
                                $log.debug('response received:' + response.status + ':' + response.statusText);
                                deferred.reject(response);
                            });
                    }, function(response) {
                        deferred.reject(response);
                    });
                    return deferred.promise;
                }
            };
        }]);
})();