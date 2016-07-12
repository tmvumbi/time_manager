/**
 * This widget defines a custom HTML element (break-widget) which displays
 * the breaks. 
 * 
 * The custom element takes an attribute (breaks) which is an array of break objects.
 * The attribute breaks allows a 2 way binding with the widget
 * making it possible to update break's comments and planned duration from the widget; or from outside the widget
 */
angular.module('app').directive('breaksWidget', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/shared/directives/breaks-widget.html',
        scope: {
            breaks: '=',
        },
        controller: function ($scope, utilService) {
            /** This variable contains the visibility status of the widget */
            $scope.visible = false;
            
            /** This function formats the duration */
            $scope.formatDuration = function (duration) {
                return utilService.formatDuration(duration);
            }

            /** This function allows displaying/hiding the widget */
            $scope.showHide = function () {
                if ($scope.visible) {
                    $scope.visible = false;
                } else {
                    $scope.visible = true;
                }
            }
            
            /** This function calculates the percentage of spent break time
             *  respective to the total time planned for the break
             */
            $scope.getPercentage = function (_break) {
                if (_break.timePlanned <= 0) {
                    return 0;
                } else {
                    return parseInt(_break.timeSpent / _break.timePlanned * 100);
                }
            }
            
            /** This function calculates the percentage for spent break time
             *  for the current break (this value is used in the progress bar
             *  inside the widget's title)
             */
            $scope.getCurrentPercentage = function () {
                if ($scope.breaks.length == 0) {
                    return 0;
                }
                var _break = $scope.breaks[$scope.breaks.length - 1];

                return $scope.getPercentage(_break);
            }

            /** This function checks if the most recent breaks is still active
             *  This value is used to display or not a progress bar inside the title
             */
            $scope.isCurrentBreakActive = function () {
                if ($scope.breaks.length == 0) {
                    return false;
                } else {
                    var _break = $scope.breaks[$scope.breaks.length - 1];
                    return _break.active;
                }
            }

        }
    }
});