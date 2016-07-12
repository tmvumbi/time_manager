/**
 * This widget defines a custom HTML element (worksession-config) which allows configuring a work session.
 * 
 *  The custom element takes an attribute (work-session) allowing to bind (2 way binding) an workSession object
 *  containing the configuration
 */
angular.module('app').directive('worksessionConfig', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/shared/directives/worksession-config.html',
        scope: {
            workSession: '='
        },
        controller: function ($scope) {
            /** This array contains bundle of configuration options 
             *  for time slot duration, reflection duration and numberOfTimeSlotsByBlock
             */
            $scope.defaultTimeSlotConfigs = [
                {
                    alias: "5' slot with 1' reflection and 10 time slots per block",
                    numberOfTimeSlotsByBlock: 10,
                    durationTimeSlot: 300,
                    durationReflection: 60
                },
                {
                    alias: "10' slot with 2' reflection and 5 time slots per block",
                    numberOfTimeSlotsByBlock: 5,
                    durationTimeSlot: 600,
                    durationReflection: 120
                },
                {
                    alias: "13' slot with 2' reflection and 4 time slots per block",
                    numberOfTimeSlotsByBlock: 4,
                    durationTimeSlot: 780,
                    durationReflection: 120
                },
                {
                    alias: "25' slot with 5' reflection and 2 time slots per block",
                    numberOfTimeSlotsByBlock: 2,
                    durationTimeSlot: 1500,
                    durationReflection: 300
                },
                {
                    alias: "Customize"
                }
            ]
            
            /** This function allows populating respectively 
             *  numberOfTimeSlotsByBlock, durationTimeSlot, durationReflection 
             *  when the list containing the configuration bundles changes
             */
            $scope.changeTimeSlotConfig = function () {
                if ($scope.workSession.timeSlotConfig != "4") {
                    $scope.workSession.numberOfTimeSlotsByBlock = $scope.defaultTimeSlotConfigs[parseInt($scope.workSession.timeSlotConfig)].numberOfTimeSlotsByBlock;
                    $scope.workSession.durationTimeSlot = $scope.defaultTimeSlotConfigs[parseInt($scope.workSession.timeSlotConfig)].durationTimeSlot;
                    $scope.workSession.durationReflection = $scope.defaultTimeSlotConfigs[parseInt($scope.workSession.timeSlotConfig)].durationReflection;
                }
            }
        }
    }
});