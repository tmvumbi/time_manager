/**
 * This widget defines a custom HTML element (interruptions-widget) which displays
 * the interruptions. 
 * 
 * The custom element takes an attribute (interruptions) which is an array of interruption objects.
 * The attribute interruptions allows a 2 way binding with the widget
 * making it possible to update interruption comment from the widget; or from outside the widget
 */
angular.module('app').directive('interruptionsWidget', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/shared/directives/interruptions-widget.html',
        scope: {
            interruptions: '=',
        },
        controller: function ($scope,utilService) {
            /** This variable contains the visibility status of the widget */
            $scope.visible = false;
            
            /** This function formats the duration */
            $scope.formatDuration = function (duration) {
                return utilService.formatDuration(duration);
            }
            
            /** This function allows displaying/hiding the widget */
            $scope.showHide = function(){
                if ($scope.visible){
                    $scope.visible = false;
                } else {
                    $scope.visible = true;
                }
            }
        }
    }
});