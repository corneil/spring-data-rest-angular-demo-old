(function () {
    'use strict';
    angular.module('springDataRestDemo').controller('NavController', ['$scope', '$q', '$mdMedia', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$log',
        function ($scope, $q, $mdMedia, $mdSidenav, $mdBottomSheet, $mdDialog, $log) {
            $scope.openSidenav = function () {
                $mdSidenav('sideNav').open();
            };
            $scope.closeSidenav = function () {
                $mdSidenav('sideNav').close();
            };
            $scope.activeContent = 'templates/users.html';
            $scope.mainMenu = [
                {
                    name: 'users', title: 'Users',
                    icon: 'social:ic_person',
                    href: '/users',
                    templateName: 'templates/users.html'
                },
                {
                    name: 'groups',
                    title: 'Groups',
                    icon: 'social:ic_people',
                    href: '/groups',
                    templateName: 'templates/groups.html'
                },
                {
                    name: 'members',
                    title: 'Members',
                    icon: 'social:ic_person_add',
                    href: '/members',
                    templateName: 'templates/members.html'
                },
                {
                    name: 'themes',
                    title: 'Themes',
                    icon: 'image:ic_color_lens',
                    href: '/themes',
                    templateName: 'templates/themes.html'
                }
            ];
            $scope.adminMenu = [
                {
                    name: 'halBrower',
                    title: 'HAL Browser',
                    icon: 'social:ic_domain',
                    href: '/admin/hal-browser',
                    templateName: 'templates/hal-browser.html'
                },
                {
                    name: 'h2Console',
                    title: 'H2 Console',
                    icon: 'action:ic_dashboard',
                    href: '/admin/h2-console',
                    templateName: 'templates/h2-console.html'
                }
            ];
            $scope.showMenu = function (item) {
                $scope.activeContent = item.templateName;
                $scope.closeSidenav();
            }
        }]);
})();