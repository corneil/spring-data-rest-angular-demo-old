(function () {
    'use strict';
    angular.module('springDataRestDemo').controller('MemberController', ['MemberService', 'UserService', '$scope', '$q', '$mdSidenav', '$mdMedia', '$mdDialog', '$log',
        function (MemberService, UserService, $scope, $q, $mdSidenav, $mdMedia, $mdDialog, $log) {
            function saveNewMember(member, group, MemberService) {
                var newMember = {enabled: true, member: member.href, memberOfgroup: group.href};
                var createDeferred = $q.defer();
                MemberService.createMember(newMember).then(
                    function (response) {
                        member._member = response.data;
                        createDeferred.resolve(member);
                    }, function (response) {
                        createDeferred.reject(response);
                    }
                );
                return createDeferred.promise;
            }
            function hasMember(member, members) {
                for (var i in members) {
                    var item = members[i];
                    if (item.userId == member.userId) {
                        return true;
                    }
                }
                return false;
            }
            $scope.groups = [];
            $scope.promise = null;
            $scope.selectedGroup = null;
            $scope.selectedMember = null;
            $scope.searchMember = null;
            $scope.promise = MemberService.combineMembers();
            $scope.promise.then(function (groups) {
                $log.debug('loaded ' + groups.length + ' groups');
                for (var g in groups) {
                    var group = groups[g];
                    group.$modified = false;
                }
                $scope.groups = groups;
            }, function (response) {
                $log.error('Error response:' + response.status + ':' + response.statusText);
                // TODO add toast for error
            });
            $scope.users = [];
            $scope.userPromise = UserService.loadAllUsers();
            $scope.userPromise.then(function (users) {
                $log.debug('loaded ' + users.length + ' users');
                $scope.users = users;
            }, function (response) {
                $log.error('Error response:' + response.status + ':' + response.statusText);
                // TODO add toast for error
            });
            $scope.transformMember = function (input) {
                return MemberService.makeMember(input, null);
            };
            $scope.selectGroup = function(group) {
                $scope.selectedGroup = group;
            }
            $scope.removeMember = function (group, member) {
                $log.debug('removeMember:member=' + JSON.stringify(member, null, 2));
                $log.debug('removeMember:group=' + JSON.stringify(group, null, 2));
                member.enabled = false;
                group.$modified = true;
                group._removed.push(member);
            };
            $scope.addMember = function (group, member) {
                $log.debug('addMember:member=' + JSON.stringify(member, null, 2));
                $log.debug('addMember:group=' + JSON.stringify(group, null, 2));
                member.enabled = true;
                group.$modified = true;
                if (!hasMember(member, group.members)) {
                    group.members.push(member);
                }
                $log.debug('addMember:added:group=' + JSON.stringify(group, null, 2));
            }
            $scope.save = function (group) {
                var deferred = $q.defer();
                $log.debug('save:' + JSON.stringify(group, null, 2));
                var toDelete = [];
                var promises = [];
                for (var i in group.members) {
                    var member = group.members[i];
                    if (!member.enabled && member._member && member._member.enabled) {
                        toDelete.push(member._member);
                    }
                }
                for (var i in group._removed) {
                    var member = group._removed[i];
                    if (!member.enabled && member._member && member._member.enabled) {
                        if (toDelete.indexOf(member._member) < 0) {
                            toDelete.push(member._member);
                        }
                    }
                }
                for (var i in toDelete) {
                    var member = toDelete[i];
                    promises.push(MemberService.deleteMember(member));
                }
                for (var i in group.members) {
                    var member = group.members[i];
                    if (member.enabled && member._member && !member._member.enabled) {
                        member._member.enabled = true;
                        promises.push(MemberService.saveMember(member._member));
                    } else if (member.enabled && member._member == undefined) {
                        promises.push(saveNewMember(member, group, MemberService));
                    }
                }
                $q.all(promises).then(function (data) {
                    deferred.resolve(data);
                    group.$modified = false;
                    // TODO toast to indicate completion
                }, function (response) {
                    deferred.reject(response);
                    // TODO toast for error
                });
                return deferred.promise;
            };
            $scope.queryMemberSearch = function (input) {
                $log.debug('queryMemberSearch:' + input);
                var result = [];
                var lowerInput = input.toLowerCase();
                for (var u in $scope.users) {
                    var user = $scope.users[u];
                    if (user.userId.toLowerCase().indexOf(lowerInput) >= 0 ||
                        user.fullName.toLowerCase().indexOf(lowerInput) >= 0 ||
                        user.emailAddress.toLowerCase().indexOf(lowerInput) >= 0) {
                        result.push(user);
                    }
                }
                $log.debug('queryMemberSearch:result=' + result.length);
                return result;
            };
            $scope.openSidenav = function () {
                $mdSidenav('sideNav').open();
            };
        }]);
})();