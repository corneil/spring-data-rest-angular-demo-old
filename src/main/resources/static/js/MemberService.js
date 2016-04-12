(function () {
    'use strict';
    angular.module('springDataRestDemo').service('MemberService', ['$q', '$http', '$log', 'UserService', 'GroupService', function ($q, $http, $log, UserService, GroupService) {
        function loadGroupMembers(groupMap, member, UserService, GroupService, $log, $q) {
            var deferred = $q.defer();
            var groupPromise = GroupService.loadGroup(member._links.memberOfgroup.href);
            groupPromise.then(function (group) {
                var groupInfo = {};
                if (!(group.groupName in groupMap)) {
                    groupInfo = {
                        groupName: group.groupName,
                        description: group.description,
                        href: group._links.self.href,
                        _group: group,
                        members: [],
                        _removed: []
                    };
                    groupMap[group.groupName] = groupInfo;
                    $log.debug('creating:' + JSON.stringify(groupInfo, null, 2));
                } else {
                    groupInfo = groupMap[group.groupName];
                    $log.debug('found:' + JSON.stringify(groupInfo, null, 2));
                }
                var userPromise = UserService.loadUser(member._links.member.href);
                userPromise.then(
                    function (user) {
                        groupInfo.members.push(makeMember(user, member));
                        deferred.resolve(groupInfo);
                    }, function (response) {
                        $log.warn('loadGroupMembers:user:response:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                        deferred.reject(response);
                    });
            }, function (response) {
                $log.warn('loadGroupMembers:group:response:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                deferred.reject(response);
            });
            return deferred.promise;
        }

        function loadAllMembers() {
            var deferred = $q.defer();
            $log.debug('calling /api/group-member');
            $http.get('/api/group-member').then(
                function (response) {
                    deferred.resolve(response.data._embedded.groupMembers);
                }, function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function makeMember(user, member) {
            return {
                _member: member,
                enabled: member == null || member == undefined ? true : member.enabled,
                userId: user.userId,
                fullName: user.fullName,
                emailAddress: user.emailAddress,
                href: user._links.self.href
            };
        }

        return {
            loadAllMembers: loadAllMembers,
            makeMember: makeMember,
            deleteMember: function (member) {
                var deferred = $q.defer();
                $log.debug('deleting :' + member._links.self.href);
                $http.delete(member._links.self.href).then(
                    function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        deferred.resolve(response);
                    }, function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        deferred.reject(response);
                    });
                return deferred.promise;
            },
            saveMember: function (member) {
                var deferred = $q.defer();
                $log.debug('saving:' + JSON.stringify(member, null, 2));
                $http.put(member._links.self.href, member).then(
                    function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        deferred.resolve(response);
                    }, function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        deferred.reject(response);
                    });
                return deferred.promise;
            },
            createMember: function (member) {
                var deferred = $q.defer();
                $log.debug('creating:' + JSON.stringify(member, null, 2));
                $http.post('/api/group-member', member).then(
                    function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        deferred.resolve(response);
                    }, function (response) {
                        $log.debug('response received:' + response.status + ':' + response.statusText);
                        deferred.reject(response);
                    });
                return deferred.promise;
            },
            combineMembers: function () {
                var deferred = $q.defer();
                var memberPromise = loadAllMembers();
                memberPromise.then(function (members) {
                    var groupMap = {};
                    var promises = [];
                    for (var m in members) {
                        var member = members[m];
                        if (member.enabled) {
                            promises.push(loadGroupMembers(groupMap, member, UserService, GroupService, $log, $q));
                        } else {
                            $log.debug("skipping member:" + JSON.stringify(member));
                        }
                    }
                    $q.all(promises).then(function (data) {
                        $log.debug('all.then:' + JSON.stringify(data));
                        var groups = [];
                        var keys = Object.keys(groupMap);
                        for (var k in keys) {
                            var group = groupMap[keys[k]];
                            $log.debug('groupInfo:' + k + ':' + JSON.stringify(group));
                            groups.push(group);
                        }
                        deferred.resolve(groups);
                    }, function (response) {
                        deferred.reject(response);
                    });
                }, function (response) {
                    $log.warn('loadAllGroups:response received:' + response.status + ':' + response.statusText);
                    deferred.reject(response);
                });
                return deferred.promise;
            }
        };
    }]);
})();