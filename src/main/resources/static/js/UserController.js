(function () {
    'use strict';
    function UserDialogController(user, newUser, UserService, $scope, $mdDialog, $mdToast, $log) {
        $log.info('UserDialogController:newUser=' + newUser + ':user=' + JSON.stringify(user));

        $scope.newUser = newUser;
        $scope.user = user;
        $scope.errorMessages = []
        $scope.dateOfBirth = !newUser && user.dateOfBirth ? moment(user.dateOfBirth, 'YYYY-MM-DD').toDate() : null;
        $scope.dialogTitle = $scope.newUser ? 'Create User' : 'Edit User';
        $log.info('scope values init:' + $scope.newUuser + ':' + $scope.dialogTitle + ':' + $scope.dateOfBirth + ':' + $scope.user);
        $scope.cancel = function () {
            $scope.errorMessages = [];
            $log.info('UserDialogController.cancel');
            $mdDialog.cancel();
        };
        $scope.save = function () {
            $scope.errorMessages = [];
            $scope.user.dateOfBirth = moment($scope.dateOfBirth).format('YYYY-MM-DD');
            $log.info('UserDialogController.save');
            var promise = $scope.newUser ? UserService.createUser($scope.user) : UserService.saveUser($scope.user);
            promise.then(function (user) {
                $log.info('user=' + JSON.stringify(user));
                $mdDialog.hide(user);
                $mdToast.show(
                    $mdToast.simple()
                        .parent(angular.element(document.body))
                        .position('bottom left')
                        .textContent($scope.newUser ? 'User Created' : 'User Saved')
                        .hideDelay(3000)
                );
            }, function (response) {
                $log.error('Error response:' + response.status + ':' + response.statusText + ':' + JSON.stringify(response.data));
                if (response.status == 409 && response.statusText == 'Conflict') {
                    $scope.userForm.userId.$setValidity('unique', false);
                } else {
                    var errorData = response.data;
                    $scope.errorMessages.push(errorData.message);
                }
            });
        };
    };

    angular.module('springDataRestDemo').controller('UserController', ['UserService', '$scope', '$q', '$mdMedia', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$mdEditDialog', '$log',
        function (UserService, $scope, $q, $mdMedia, $mdSidenav, $mdBottomSheet, $mdDialog, $mdEditDialog, $log) {
            $scope.selected = [];
            $scope.userSelected = 0;
            $scope.users = [];
            $scope.promise = null;
            $scope.selectedUser = null;
            $scope.promise = UserService.loadAllUsers();
            $scope.promise.then(function (users) {
                $log.debug('loaded ' + users.length + ' users');
                $scope.users = users;
                for (var i in users) {
                    users[i].selected = false;
                }
            }, function (response) {
                $log.error('Error response:' + response.status + ':' + response.statusText);
            });

            $scope.toggleUsersList = function () {
                $mdSidenav('left').toggle();
            };
            $scope.deleteUsers = function (ev) {
                var userMessage = 'You have selected to delete:';
                var u;
                for (u in $scope.selected) {
                    var user = $scope.selected[u];
                    userMessage = userMessage + ' ' + user.userId + ': ' + user.fullName;
                }
                // TODO refactor so that dialog shows progress and remains open until completion.
                var confirm = $mdDialog.confirm()
                    .title('Do you want to delete users?')
                    .textContent(userMessage)
                    .ariaLabel('Delete Users')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function () {
                    var promises = []
                    for (u in $scope.selected) {
                        var user = $scope.selected[u];
                        $log.debug('Deleting:' + user.userId);
                        var promise = UserService.deleteUser(user);
                        promises.push(promise);
                    }
                    $q.all(promises).then(function (data) {
                        $log.info('Deletion completed:' + data);
                        for (u in $scope.selected) {
                            var user = $scope.selected[u];
                            var index = $scope.users.indexOf(user);
                            if(index >= 0) {
                                $scope.users.splice(index, 1);
                            } else {
                                $log.warn('Could not find:' + user.userId + ' in ' + JSON.stringify($scope.users, null, 2));
                            }
                        }
                        $scope.selected = [];
                    }, function (data) {
                        $log.error('Deletion incompleted:' + data);
                    });
                }, function () {
                    $log.debug('Cancelled deletion');
                });
            };
            $scope.editUser = function (ev) {
                $scope.selectedUser = $scope.selected[0];
                $log.info('edit user :' + $scope.selectedUser.userId);
                $mdDialog.show({
                    parent: angular.element(document.body),
                    controller: UserDialogController,
                    templateUrl: 'templates/user-dialog.html',
                    targetEvent: ev,
                    bindToController: true,
                    locals: {
                        user: $scope.selectedUser,
                        newUser: false
                    }
                }).then(function (user) {
                    $log.info('updating user in array:' + JSON.stringify(user));
                    $scope.selectedUser = user;
                    for (var i in $scope.users) {
                        var item = $scope.users[i];
                        if (item.userId == user) {
                            $scope.users[i] = user;
                        }
                    }
                });
            };
            $scope.addUser = function (ev) {
                $scope.selectedUser = {fullName: '', userId: '', emailAddress: '', dateOfBirth: null};
                $log.info('adding user');
                $mdDialog.show({
                    parent: angular.element(document.body),
                    controller: UserDialogController,
                    templateUrl: 'templates/user-dialog.html',
                    targetEvent: ev,
                    bindToController: true,
                    locals: {
                        user: $scope.selectedUser,
                        newUser: true
                    }
                }).then(function (user) {
                    $log.info('adding user to array:' + JSON.stringify(user));
                    $scope.selectedUser = user;
                    $scope.users.push(user);
                });
            };
        }]);

})();