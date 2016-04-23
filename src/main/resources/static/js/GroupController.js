(function () {
    'use strict';
    function GroupDialogController(group, newGroup, GroupService, UserService, $scope, $mdDialog, $mdToast, $log) {
        $log.info('GroupDialogController:newGroup=' + newGroup + ':group=' + JSON.stringify(group));
        $scope.users = [];
        $scope.userPromise = UserService.loadAllUsers();
        $scope.userPromise.then(function (users) {
            $log.debug('GroupController.loaded ' + users.length + ' users');
            $scope.users = users;
            for (var i in users) {
                users[i].selected = false;
            }
        }, function (response) {
            $log.error('Error response:' + response.status + ':' + response.statusText);
        });
        $scope.newGroup = newGroup;
        $scope.group = group;
        $scope.dialogTitle = $scope.newGroup ? 'Create Group' : 'Edit Group';
        $log.info('scope values init:' + $scope.newGroup + ':' + $scope.dialogTitle + ':' + ':' + $scope.group);
        $scope.cancel = function () {
            $log.info('GroupDialogController.cancel');
            $mdDialog.cancel();
        };
        $scope.save = function () {
            $log.info('GroupDialogController.save');
            var promise = $scope.newGroup ? GroupService.createGroup($scope.group) : GroupService.saveGroup($scope.group);
            promise.then(function (group) {
                $log.info('group=' + JSON.stringify(group));
                $mdToast.show(
                    $mdToast.simple()
                        .position('bottom left')
                        .parent(angular.element(document.body))
                        .textContent($scope.newGroup ? 'Group Created' : 'Group Saved')
                        .hideDelay(3000)
                );
                $mdDialog.hide(group);
            }, function (response) {
                $log.error('Error response:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                if (response.status == 409 && response.statusText == 'Conflict') {
                    $scope.groupForm.groupName.$setValidity('unique', false);
                } else {
                    var errorData = response.data;
                    $scope.errorMessages.push(errorData.message);
                }
            });
        };
    };

    angular.module('springDataRestDemo').controller('GroupController', ['GroupService', 'UserService', '$scope', '$q', '$mdMedia', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$mdToast', '$log',
        function (GroupService, UserService, $scope, $q, $mdMedia, $mdSidenav, $mdBottomSheet, $mdDialog, $mdToast, $log) {
            $scope.selected = [];
            $scope.groupSelected = 0;
            $scope.groups = [];
            $scope.selectedGroup = null;
            $scope.promise = GroupService.loadAllGroups();
            $scope.promise.then(function (groups) {
                $log.debug('loaded ' + groups.length + ' groups');
                $scope.groups = groups;
                for (var i in groups) {
                    groups[i].selected = false;
                }
            }, function (response) {
                $log.error('Error response:' + response.status + ':' + response.statusText);
            });
            $scope.openSidenav = function () {
                $mdSidenav('sideNav').open();
            };
            $scope.editGroup = function (ev) {
                $scope.selectedGroup = $scope.selected[0];
                $log.info('edit group :' + $scope.selectedGroup.groupName);
                $mdDialog.show({
                    parent: angular.element(document.body),
                    controller: GroupDialogController,
                    templateUrl: 'templates/group-dialog.html',
                    targetEvent: ev,
                    bindToController: true,
                    locals: {
                        group: $scope.selectedGroup,
                        users: $scope.users,
                        newGroup: false
                    }
                }).then(function (group) {
                    $log.info('updating group in array:' + JSON.stringify(group));
                    $scope.selectedGroup = group;
                    for (var i in $scope.groups) {
                        var item = $scope.groups[i];
                        if (item.groupId == group) {
                            $scope.groups[i] = group;
                        }
                    }
                });
            };
            $scope.addGroup = function (ev) {
                $scope.selectedGroup = {groupName: '', _groupOwner: undefined};
                $log.info('adding group');
                $mdDialog.show({
                    parent: angular.element(document.body),
                    controller: GroupDialogController,
                    templateUrl: 'templates/group-dialog.html',
                    targetEvent: ev,
                    bindToController: true,
                    locals: {
                        group: $scope.selectedGroup,
                        users: $scope.users,
                        newGroup: true
                    }
                }).then(function (group) {
                    $log.info('adding group to array:' + JSON.stringify(group));
                    $scope.selectedGroup = group;
                    $scope.groups.push(group);
                });
            };
            $scope.deleteGroups = function (ev) {
                var groupMessage = 'You have selected to delete:';
                var u;
                for (u in $scope.selected) {
                    var user = $scope.selected[u];
                    groupMessage = groupMessage + ' ' + user.groupName;
                }
                // TODO refactor so that dialog shows progress and remains open until completion.
                var confirm = $mdDialog.confirm()
                    .title('Do you want to delete groups?')
                    .textContent(groupMessage)
                    .ariaLabel('Delete Groups')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function () {
                    var promises = []
                    for (u in $scope.selected) {
                        var group = $scope.selected[u];
                        $log.debug('Deleting:' + group.groupName);
                        var promise = GroupService.deleteGroup(group);
                        promises.push(promise);
                    }
                    $q.all(promises).then(function (data) {
                        $log.info('Deletion completed:' + data);
                        var deleteCount = $scope.selected.length;
                        for (u in $scope.selected) {
                            var group = $scope.selected[u];
                            var rg = $scope.groups.indexOf(group);
                            invariant(rg >= 0, 'Expected group index in groups');
                            $scope.groups.splice(rg, 1);
                        }
                        $scope.selected = [];
                        $mdToast.show(
                            $mdToast.simple()
                                .parent(angular.element(document.body))
                                .position('bottom left')
                                .textContent('Deleted ' + deleteCount + ' Groups')
                                .hideDelay(3000)
                        );
                    }, function (data) {
                        $log.error('Deletion incompleted:' + JSON.stringify(data));
                        $mdToast.show(
                            $mdToast.simple()
                                .parent(angular.element(document.body))
                                .position('bottom left')
                                .theme('error')
                                .textContent('Deletion incompleted: ' + data.statusLine)
                                .action('Close')
                        );
                    });
                }, function () {
                    $log.debug('Cancelled deletion');
                });
            }
        }]);

})();