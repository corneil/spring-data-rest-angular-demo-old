(function () {
    'use strict';
    angular
        .module('springDataRestDemo')
        .controller('UserController', ['UserService', '$scope', '$mdSidenav', '$mdBottomSheet', '$log',
            function (UserService, $scope, $mdSidenav, $mdBottomSheet, $log) {

                $scope.selected = null;
                $scope.users = [];

                UserService.loadAllUsers().then(function (users) {
                    $log.debug('loaded ' + users.length + ' users');
                    $scope.users = users;
                    $scope.selected = users[0];
                }, function (response) {
                    $log.error('Error response:' + response.status + ':' + response.statusText);
                });

                function toggleUsersList() {
                    $mdSidenav('left').toggle();
                }

                function selectUser(user) {
                    $scope.selected = angular.isNumber(user) ? $scope.users[user] : user;
                }
            }]);

})();