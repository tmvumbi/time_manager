/**
 * This directive defines a custom HTML element (objective-widget)
 *  which allows displaying and modifying an objective information.
 * 
 *  It uses the following custom attributes:
 *   - objective: this is the objective's object. Contains the objective's description,
 *                the planned duration, actual time spent working on the objective 
 *                and a list of comments.
 *   - on-delete-objective: allows binding a custom event that is called when the delete button
 *                          on the objective's widget is pressed.
 *   - index: the array's index where the current objective is stored (used in the title bar)
 */
angular.module('app').directive('objectiveWidget', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/shared/directives/objective-widget.html',
        scope: {
            objective: '=',
            onDeleteObjective: '&',
            index: '='
        },
        controller: function ($scope, utilService) {
            /** This variable contains the visibility status of the widget */
            $scope.visible = false;
            
            /** This function formats the duration */
            $scope.formatDuration = function (duration) {
                return utilService.formatDuration(duration);
            }

            /** This function adds a new comment to the current objective */
            $scope.addNewComment = function () {
                $scope.objective.comments.push({
                    text: ""
                });
            }

            /** This function deletes a comment (at the position 'indexComment') from the current objective */
            $scope.deleteComment = function (indexComment) {
                if ($scope.objective.comments.length > 1) {
                    $scope.objective.comments.splice(indexComment, 1);
                }

            }
            
            /** This function calculates the percentage of work done 
             *  for the current objective
             */
            $scope.getPercentageWorkDone = function () {
                if ($scope.objective.plannedTime == 0) {
                    return 0;
                } else {
                    return parseInt($scope.objective.timeSpent / $scope.objective.plannedTime * 100);
                }
            }
            
            /** This function allows signaling that the user
             *  is not working anymore on the current objective
             */
            $scope.doneClick = function () {
                if ($scope.objective.completed) {
                    $scope.objective.workingOnThis = false;
                }
            }
            
            /** This function allows signaling that the user
             *  is now working on the current objective
             */            
            $scope.workingOnThisClick = function () {
                if ($scope.objective.workingOnThis) {
                    $scope.objective.completed = false;
                }
            }
            
            /** This function allows retrieving the
             *  css class to use to color the objective 
             *  title based on the objective's state
             */
            $scope.getObjectiveForeColor = function(){
                if ($scope.objective.completed) {
                    return "green_foreground";
                } else if ($scope.objective.workingOnThis){
                    return "blue_foreground";
                } else {
                    return "black_foreground";
                }
            }
            
            /** This function allows displaying/hiding the widget */
            $scope.showHide = function(){
                if ($scope.visible){
                    $scope.visible = false;
                } else {
                    $scope.visible = true;
                }
            }
            
            /** This function is called when the delete button on 
             *  the objective is pressed, it triggered the callback
             *  function provided by the custom attribute 'on-delete-objective'
             */
            $scope._deleteObjective = function(){
                $scope.onDeleteObjective();
            }
        }
    }
});