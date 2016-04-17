(function () {
    'use strict';
    angular.module('springDataRestDemo').controller('ThemeController', ['$scope', '$q', '$mdMedia', '$log',
        function ($scope, $q, $mdMedia, $log) {
            $scope.themes = [];
            $scope.themes.push({value: 'default', name: 'Default'});
            function themeIndex(selected) {
                for(var i in $scope.themes) {
                    var theme = $scope.themes[i];
                    if(theme.value == selected) {
                        return i - 0;
                    }
                }
                return -1;
            }
            $scope.selectedTheme = 'default';
            for (var i in themeColours) {
                var themeColor = themeColours[i];
                var themeName = themeColor.slice(0, 1).toUpperCase() + themeColor.slice(1);
                var item = {value: themeColor, name: themeName};
                $scope.themes.push(item);
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