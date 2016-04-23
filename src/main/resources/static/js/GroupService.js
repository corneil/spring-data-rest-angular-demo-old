function loadGroupOwner(group, UserService, $q, $log) {
    var deferred = $q.defer();
    var promise = UserService.loadUser(group._links._groupOwner.href);
    promise.then(function (user) {
        $log.debug('GroupService.loadAllGroups.groupOwner.loaded:' + group.groupName + ':' + user.userId);
        group._groupOwner = user;
        group.groupOwner = user._links.self.href;
        deferred.resolve(group);
    }, function (response) {
        $log.error('loadGroupOwner:failure:response:' + JSON.stringify(response, null, 2));
        group._groupOwner = undefined;
        deferred.reject(response);
    });
    return deferred.promise;
}
(function () {
    'use strict';
    angular.module('springDataRestDemo')
        .service('GroupService', ['$q', '$resource', '$log', 'UserService', 'groupCache', function ($q, $resource, $log, UserService, groupCache) {
            var Groups = $resource('/api/groups', {}, {
                list: {method: 'GET'},
                create: {method: 'POST'}
            });
            function deleteGroupMember(groupMemberRef) {
                $log.debug('deleteGroupMember:' + groupMemberRef);
                return $resource(groupMemberRef).delete().$promise;
            }
            function deleteMembersForGroup(group) {
                var deferred = $q.defer();
                var promises = [];
                var GroupMembers = $resource('/api/group-member/search/findByMemberOfgroup_GroupName?groupName=:groupName', {groupName: '@groupName'});
                GroupMembers.get({groupName: group.groupName}).$promise.then(
                    function (groups) {
                        $log.debug('deleteMembersForGroup:find:' + JSON.stringify(groups,null,2));
                        for (var i in groups._embedded.groupMembers) {
                            var groupMember = groups._embedded.groupMembers[i];
                            promises.push(deleteGroupMember(groups._embedded.groupMembers[i]._links.self.href));
                        }
                        $q.all(promises).then(function (data) {
                            deferred.resolve(data);
                        }, function (response) {
                            $log.error('deleteMembersForGroup:failure:response:' + JSON.stringify(response, null, 2));
                            deferred.reject(response);
                        });
                    }, function (response) {
                        $log.error('deleteMembersForGroup:failure:response:' + JSON.stringify(response, null, 2));
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            return {
                loadAllGroups: function () {
                    var deferred = $q.defer();
                    $log.debug('calling /api/groups');
                    Groups.list().$promise.then(
                        function (groups) {
                            var groups = groups._embedded.groups;
                            var promises = [];
                            for (var g in groups) {
                                promises.push(loadGroupOwner(groups[g], UserService, $q, $log));
                            }
                            $q.all(promises).then(function () {
                                deferred.resolve(groups);
                            }, function (response) {
                                $log.error('loadAllGroups:failure:response:' + JSON.stringify(response, null, 2));
                                deferred.reject(response);
                            });
                        },
                        function (response) {
                            $log.error('loadAllGroups:failure:response:' + JSON.stringify(response, null, 2));
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },
                loadGroup: function (groupRef) {
                    $log.debug('loadGroup:' + groupRef);
                    var deferred = $q.defer();
                    var Group = $resource(groupRef, {}, {get: {method: 'GET', cache: groupCache}});
                    Group.get().$promise.then(
                        function (group) {
                            loadGroupOwner(group, UserService, $q, $log).then(
                                function (g) {
                                    deferred.resolve(g);
                                }, function (response) {
                                    deferred.reject(response);
                                });
                        }, function (response) {
                            $log.error('loadGroup:failure:response:' + JSON.stringify(response, null, 2));
                            deferred.reject(response);
                        }
                    );
                    return deferred.promise;
                },
                createGroup: function (group) {
                    var deferred = $q.defer();
                    $log.debug('creating:' + JSON.stringify(group));
                    $log.debug('calling /api/groups');
                    var savedOwner = group._groupOwner;
                    Groups.create(group).$promise.then(
                        function (group) {
                            group._groupOwner = savedOwner;
                            group.groupOwner = savedOwner._links.self.href;
                            deferred.resolve(group);
                        },
                        function (response) {
                            $log.error('createGroup:failure:response:' + JSON.stringify(response, null, 2));
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },
                saveGroup: function (group) {
                    var deferred = $q.defer();
                    $log.debug('saving:' + JSON.stringify(group, null, 2));
                    var Group = $resource(group._links.self.href, {}, {save: {method: 'PUT'}});
                    Group.save(group).$promise.then(
                        function (saved) {
                            groupCache.remove(saved._links.self.href);
                            deferred.resolve(saved);
                        },
                        function (response) {
                            $log.error('saveGroup:failure:response:' + JSON.stringify(response, null, 2));
                            deferred.reject(response);
                        });
                    return deferred.promise;
                },
                deleteGroup: function (group) {
                    var deferred = $q.defer();
                    deleteMembersForGroup(group).then(function () {
                        $log.debug('deleting :' + group._links.self.href);
                        var Group = $resource(group._links.self.href);
                        Group.delete().$promise.then(
                            function (response) {
                                groupCache.remove(group._links.self.href);
                                deferred.resolve(response);
                            }, function (response) {
                                $log.error('deleteGroup:failure:response:' + JSON.stringify(response, null, 2));
                                deferred.reject(response);
                            });
                    }, function (response) {
                        $log.error('deleteGroup:failure:response:' + JSON.stringify(response, null, 2));
                        deferred.reject(response);
                    });
                    return deferred.promise;
                }
            };
        }]);
})();