(function () {
    'use strict';
    angular.module('springDataRestDemo').controller('ThemeController', ['$scope', '$q', '$mdMedia',
        '$mdColorPalette', '$log', '$mdSidenav',
        function ($scope, $q, $mdMedia, $mdColorPalette, $log, $mdSidenav) {
            $scope.openSidenav = function () {
                $mdSidenav('sideNav').open();
            };

            $scope.themes = [];
            $scope.themes.push({value: 'default', name: 'Default'});
            function themeIndex(selected) {
                for (var i in $scope.themes) {
                    var theme = $scope.themes[i];
                    if (theme.value == selected) {
                        return i - 0;
                    }
                }
                return -1;
            }

            var colors = Object.keys($mdColorPalette);
            $scope.selectedTheme = 'default';
            var prevColor = colors[colors.length - 1];
            var prevPrevColor = colors[colors.length - 2];
            for (var i in colors) {
                var themeColor = colors[i];
                $log.info("themeColor:" + i + ":" + themeColor + " / " + prevColor + " / " + prevPrevColor);
                var themeName = themeColor.slice(0, 1).toUpperCase() + themeColor.slice(1) +
                    ' / ' + prevColor.slice(0, 1).toUpperCase() + prevColor.slice(1) + ' / ' + prevPrevColor.slice(0,1).toUpperCase() + prevPrevColor.slice(1);
                var item = {value: themeColor, name: themeName};
                $scope.themes.push(item);
                prevPrevColor = prevColor;
                prevColor = themeColor;
            }
            $scope.nextTheme = function () {
                var current = themeIndex($scope.selectedTheme);
                $log.debug('Selected = ' + current + ':' + $scope.selectedTheme);
                if (current == $scope.themes.length - 1) {
                    current = 0;
                } else if (current >= 0) {
                    current += 1;
                }
                $log.debug('Current = ' + current);
                $scope.selectedTheme = $scope.themes[current].value;
            };
            $scope.prevTheme = function () {
                var current = themeIndex($scope.selectedTheme);
                $log.debug('Selected = ' + current + ':' + $scope.selectedTheme);
                if (current == 0) {
                    current = $scope.themes.length - 1;
                } else if (current >= 0) {
                    current -= 1;
                }
                $log.debug('Current = ' + current);
                $scope.selectedTheme = $scope.themes[current].value;
                $log.debug('Selected = ' + current + ':' + $scope.selectedTheme);
            }
        }]);

})();