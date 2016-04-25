(function () {
    'use strict';
    angular.module('springDataRestDemo').service('MemberService', ['$q', '$resource', '$log', 'UserService', 'GroupService',
        function ($q, $resource, $log, UserService, GroupService) {
            var GroupMembers = $resource('/api/group-member', {}, {
                create: {method: 'POST'},
                list: {method: 'GET'}
            });

            function makeGroup(group, groupMap) {
                var groupInfo = {
                    groupName: group.groupName,
                    description: group.description,
                    href: group._links.self.href,
                    _group: group,
                    members: [],
                    _removed: []
                };
                groupMap[group.groupName] = groupInfo;
                return groupInfo;
            }

            function loadGroup(groupMap, member) {
                var deferred = $q.defer();
                GroupService.loadGroup(member._links._memberOfgroup.href).then(function (group) {
                    var groupInfo = {};
                    if (!(group.groupName in groupMap)) {
                        groupInfo = makeGroup(group, groupMap);
                    } else {
                        groupInfo = groupMap[group.groupName];
                    }
                    var deferredMember = makeDeferredMember(member);
                    groupInfo.members.push(deferredMember);
                    deferred.resolve(deferredMember);
                }, function (response) {
                    $log.error('loadGroupMembers:group:response:' + JSON.stringify(response, null, 2));
                    deferred.reject(response);
                });
                return deferred.promise;
            }

            function loadAndAddUser(groupMember) {
                var deferred = $q.defer();
                UserService.loadUser(groupMember._member._links._member.href).then(function (user) {
                    updateMember(user, groupMember);
                    deferred.resolve(groupMember);
                },
                function (response) {
                    $log.error('loadGroupMembers:user:response:' + JSON.stringify(response, null, 2));
                    deferred.reject(response);
                });
                return deferred;
            }

            function loadGroupMembers(group) {
                var promises = [];
                for (var i in group.members) {
                    var groupMember = group.members[i];
                    if (groupMember.href == undefined || groupMember.href == null) {
                        promises.push(loadAndAddUser(groupMember));
                    }
                }
                var resultDeferred = $q.defer();
                if (promises.length > 0) {
                    $q.all(promises).then(function () {
                        resultDeferred.resolve(group);
                    }, function (response) {
                        resultDeferred.reject(response);
                    });
                } else {
                    if (group.members.length == 0) {
                        $log.debug("loadGroupMembers:no promised. empty group");
                    } else {
                        $log.debug("loadGroupMembers:no promised. already loaded");
                    }
                    resultDeferred.resolve({});
                }
                return resultDeferred.promise;
            }

            function updateMember(user, member) {
                member.userId = user.userId;
                member.fullName = user.fullName;
                member.emailAddress = user.emailAddress;
                member.href = user._links.self.href;
            }

            function loadAllMembers() {
                var deferred = $q.defer();
                var groupMap = {};
                GroupService.loadAllGroups().then(function (groups) {
                    for (var i in groups) {
                        makeGroup(groups[i], groupMap);
                    }
                    GroupMembers.list().$promise.then(function (groupMembers) {
                        var members = groupMembers._embedded.groupMembers;
                        var promises = [];
                        for (var m in members) {
                            promises.push(loadGroup(groupMap, members[m]));
                        }
                        $q.all(promises).then(function () {
                            var groups = [];
                            var keys = Object.keys(groupMap);
                            for (var k in keys) {
                                var group = groupMap[keys[k]];
                                groups.push(group);
                            }
                            deferred.resolve(groups);
                        }, function (response) {
                            $log.error('combineMembers:failed:' + JSON.stringify(response, null, 2));
                            deferred.reject(response);
                        });
                    }, function (response) {
                        $log.error('loadAllMembers:failed:' + JSON.stringify(response, null, 2));
                        deferred.reject(response);
                    });
                });
                return deferred.promise;
            }

            function makeMember(user, member) {
                return {
                    _member: member,
                    enabled: member == null || member == undefined ? false : member.enabled,
                    userId: user.userId,
                    fullName: user.fullName,
                    emailAddress: user.emailAddress,
                    href: user._links.self.href
                };
            }

            function makeDeferredMember(member) {
                return {
                    _member: member,
                    enabled: member == null || member == undefined ? false : member.enabled,
                };
            }
            function addMember(group, member, user) {
                var deferredMember = makeDeferredMember(member);
                group.members.push(deferredMember);
                if(user != undefined) {
                    updateMember(user, deferredMember);
                }
            }
            return {
                loadAllMembers: loadAllMembers,
                makeMember: makeMember,
                addMember: addMember,
                deleteMember: function (member) {
                    var deferred = $q.defer();
                    var GroupMember = $resource(member._links.self.href);
                    GroupMember.delete().$promise.then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        $log.error('deleteMember:failed:' + JSON.stringify(response, null, 2));
                        deferred.reject(response);
                    });
                    return deferred.promise;
                },
                saveEnabledMember: function (member) {
                    var deferred = $q.defer();
                    var GroupMember = $resource(member._links.self.href, {}, {update: {method: 'PATCH'}});
                    GroupMember.update({enabled:member.enabled}).$promise.then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        $log.error('saveMember:failed:' + JSON.stringify(response, null, 2));
                        deferred.reject(response);
                    });
                    return deferred.promise;
                },
                createMember: function (member) {
                    var deferred = $q.defer();
                    GroupMembers.create(member).$promise.then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        $log.error('createMember:failed:' + JSON.stringify(response, null, 2));
                        deferred.reject(response);
                    });
                    return deferred.promise;
                },
                loadGroupMembers: loadGroupMembers
            }
        }]);
})();