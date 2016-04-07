(function () {
    'use strict';
    angular
        .module('springDataRestDemo')
        .controller('UserController', ['UserService', '$scope', '$mdSidenav', '$mdBottomSheet', '$log',
            function (UserService, $scope, $mdSidenav, $mdBottomSheet, $log) {

                $scope.selected = [];
                $scope.userSelected = 0;
                $scope.users = [];
                $scope.promise = null;

                $scope.promise = UserService.loadAllUsers();
                $scope.promise.then(function (users) {
                    $log.debug('loaded ' + users.length + ' users');
                    $scope.users = users;
                    for(var i in users) {
                        users[i].selected = false;
                    }
                }, function (response) {
                    $log.error('Error response:' + response.status + ':' + response.statusText);
                });

                $scope.toggleUsersList = function () {
                    $mdSidenav('left').toggle();
                }
                $scope.checkSelected = function () {
                    var selectedCount = 0;
                    $scope.selected = null;
                    for(var i in $scope.users) {
                        if($scope.users[i].selected) {
                            if($scope.selected == null) {
                                $scope.selected = $scope.users[i];
                            }
                            selectedCount += 1;
                        }
                    }
                    // Only one item will be assigned to selected
                    if(selectedCount > 1) {
                        $scope.selected = null;
                    }
                    $scope.userSelected = selectedCount;
                    $log.debug('checkSelected:' + selectedCount);
                    return selectedCount;
                }
                $scope.toggleUser = function(user) {
                    $log.debug('toggle:start:' + user.userId + ':' + user.selected);
                    user.selected = !user.selected;
                    $scope.checkSelected();
                    $log.debug('toggle:end:' + user.userId + ':' + user.selected);
                }
            }]);

})();