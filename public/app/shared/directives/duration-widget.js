/**
 * This widget defines a custom HTML element (duration-widget) which allows capturing durations.
 * It custom element takes an attribute (duration) which allows to bind (2 ways binding) an integer variable 
 * representing the duration expressed in seconds.
 * 
 * The widget allows capturing the duration in hour-minute format, and internally translate
 * the duration to seconds
 */
angular.module('app').directive('durationWidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/shared/directives/duration-widget.html',
        scope: {
            duration: '='
        },
        controller: function ($scope) {
            /** This function retrieves the minute component (from the duration expressed in sec) */
            $scope.getMinutes = function () {
                return parseInt($scope.duration / 60) % 60;
            }
            
            /** This function retrieves the hour component (from the duration expressed in sec) */
            $scope.getHours = function () {
                return parseInt($scope.duration / 3600);
            }

            /** This code initializes the minute and hour component */
            $scope.minute = $scope.getMinutes();
            $scope.hour = $scope.getHours();

            /** This watcher is triggered every time the duration changes, 
             *  it updates the minute and hour component accordingly
             */
            $scope.$watch('duration', function (newValue, oldValue) {
                $scope.minute = $scope.getMinutes();
                $scope.hour = $scope.getHours();

            });
        },
        link: function (scope, element, attrs) {
            /** This function translates the duration expressed in hour and min to seconds */
            scope.calculateDuration = function (hr, mn) {
                if (hr * 3600 + mn * 60 >= 0) {
                    return hr * 3600 + mn * 60;
                }
            }
            
            /** This event is triggered when the input containing minutes changes
             *  It recalculates the internal duration in second
             */
            element[0].getElementsByClassName("tm_min_input")[0].onchange = function (event) {
                var hour = element[0].getElementsByClassName("tm_hour_input")[0].value;
                var min = element[0].getElementsByClassName("tm_min_input")[0].value;


                if (isNaN(min)) {
                    min = 0;
                    this.value = 0;
                }

                if (min < 0 && hour == 0) {
                    min = 0;
                    this.value = 0;
                }

                scope.duration = scope.calculateDuration(hour, min);
                scope.$apply();
            };

            /** This event is triggered when the input containing hours changes
             *  It recalculates the internal duration in second
             */
            element[0].getElementsByClassName("tm_hour_input")[0].onchange = function (event) {
                var hour = element[0].getElementsByClassName("tm_hour_input")[0].value;
                var min = element[0].getElementsByClassName("tm_min_input")[0].value;

                if (isNaN(hour)) {
                    hour = 0;
                    this.value = 0;
                }

                if (hour < 0) {
                    hour = 0;
                    this.value = 0;
                }

                scope.duration = scope.calculateDuration(hour, min);
                scope.$apply();
            };

            /** This event is triggered when the hour input receives a focus
             *  It selects the text in the input
             */
            element[0].getElementsByClassName("tm_hour_input")[0].onfocus = function (event) {
                this.select();
            }

            /** This event is triggered when the minute input receives a focus
             *  It selects the text in the input
             */
            element[0].getElementsByClassName("tm_min_input")[0].onfocus = function (event) {
                this.select();
            }

            /** This event is triggered when a key is pressed down on the hour input
             *  Up arrow increments hours, Down arrow decrements hours, 
             *  Enter move the focus to the minute input
             */
            element[0].getElementsByClassName("tm_hour_input")[0].onkeydown = function (event) {
                if (event.keyCode == '38') { // key up pressed
                    scope.duration += 3600;
                }
                if (event.keyCode == '40' && scope.duration > 3600) { // key down pressed
                    scope.duration -= 3600;
                }
                if (scope.duration < 0) { // This avoid to have a negative duration
                    scope.duration = 0;
                }

                if (event.keyCode == '13') { // Enter pressed
                    element[0].getElementsByClassName("tm_min_input")[0].select();
                }

                scope.$apply();
            }

            /** This event is triggered when a key is pressed down on the minute input
             *  Up arrow increments minutes, Down arrow decrements minutes
             */
            element[0].getElementsByClassName("tm_min_input")[0].onkeydown = function (event) {
                if (event.keyCode == '38') { // key up pressed
                    scope.duration += 60;
                }
                if (event.keyCode == '40') { // key down pressed
                    scope.duration -= 60;
                }
                if (scope.duration < 0) { // This avoid to have a negative duration
                    scope.duration = 0;
                }

                scope.$apply();
            }

            /** This event is triggered when a key is released on the hour input
             *  When 2 digits have been entered for hour, the focus is moved to minute input
             */
            element[0].getElementsByClassName("tm_hour_input")[0].onkeyup = function (event) {
                var min = element[0].getElementsByClassName("tm_hour_input")[0].value;

                if (min.length == 2) {
                    element[0].getElementsByClassName("tm_min_input")[0].select();
                }
            }


        }
    }
});