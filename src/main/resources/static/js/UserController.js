(function () {
    'use strict';
    function UserDialogController(user, newUser, UserService, $scope, $mdDialog, $mdToast, $log) {
        $log.info('UserDialogController:newUser=' + newUser + ':user=' + JSON.stringify(user));

        $scope.newUser = newUser;
        $scope.user = user;
        $scope.dateOfBirth = !newUser && user.dateOfBirth ? moment(user.dateOfBirth).toDate() : null;
        $scope.dialogTitle = $scope.newUser ? 'Create User' : 'Edit User';
        $log.info('scope values init:' + $scope.newUuser + ':' + $scope.dialogTitle + ':' + $scope.dateOfBirth + ':' + $scope.user);
        $scope.cancel = function () {
            $log.info('UserDialogController.cancel');
            $mdDialog.cancel();
        };
        $scope.save = function () {
            $scope.user.dateOfBirth = moment($scope.dateOfBirth).format('YYYY-MM-DD');
            $log.info('UserDialogController.save');
            var promise = $scope.newUser ? UserService.createUser($scope.user) : UserService.saveUser($scope.user);
            promise.then(function (user) {
                $log.info('user=' + JSON.stringify(user));
                $mdToast.show(
                    $mdToast.simple()
                        .position({top:true,right:true})
                        .textContent($scope.newUser ? 'User Created' : 'User Saved')
                        .hideDelay(3000)
                );
                $mdDialog.hide(user);
            }, function (response) {
                $log.error('Error response:' + response.status + ':' + response.statusText);
                $mdToast.show(
                    $mdToast.simple()
                        .position({top:true,right:true})
                        .textContent('Error:' + response.statusText)
                        .hideDelay(7000).theme('error')
                );
            });
        };
    };

    angular.module('springDataRestDemo').controller('UserController', ['UserService', '$scope', '$mdMedia', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$mdEditDialog', '$log',
        function (UserService, $scope, $mdMedia, $mdSidenav, $mdBottomSheet, $mdDialog, $mdEditDialog, $log) {
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
            $scope.editUser = function (ev) {
                $scope.selectedUser = $scope.selected[0];
                $log.info('edit user :' + $scope.selectedUser.userId);
                $mdDialog.show({
                    parent: angular.element(document.body),
                    controller: UserDialogController,
                    templateUrl: 'templates/user-dialog.html',
                    targetEvent: ev,
                    bindToController:true,
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
                    bindToController:true,
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