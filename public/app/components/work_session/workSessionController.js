angular.module('app').controller('workSessionController',
    function ($scope,
        $state,
        $interval,
        worksessionService,
        persistenceService,
        utilService) {
            
        /**
         * TIMER PULSATION
         * ===============
         */    
        /** This function is to be called every second */
        $scope.callSecondBeat = function () {
            worksessionService.secondBeat($scope.workSession);
        }

        /**
         * INTERFACES TO
         * =============
         * utilService
         */

        /** This function translates number to letters (1 -> A, 2 -> B, etc.) */
        $scope.numberToLetter = function(number){
            return utilService.numberToLetter(number);
        }

        /** This function formats the duration
         *  the parameter 'duration' is an integer
         *  representing the duration in seconds
         */
        $scope.formatDuration = function (duration, showSec) {
            return utilService.formatDuration(duration, showSec);
        }

        /**
         * SOUND RELATED FUNCTIONS
         * ==========================
         */
        
        /** This function activates/deactivates the sound (for speech synthesis) */
        $scope.toggleSound = function () {
            return worksessionService.toggleSound();
        }
        
        /** This function returns the sound state (true if activated and false if deactivated) */
        $scope.isSoundActive = function () {
            return worksessionService.isSoundActive();
        }

        /** This function returns a text to use as tooltip for the sound button */
        $scope.getTextSoundIcon = function () {
            if ($scope.isSoundActive()){
                return "Click to mute sound";
            } else {
                return "Click to activate sound";
            }
        }

        /**
         * WORKSESSION SESSION LIFE CYCLE FUNCTIONS
         * ========================================
         */

        /** This function kicks off a new work session */
        $scope.startWork = function () {
            persistenceService.persistCurrentWorkingSession($scope.workSession);
            $interval.cancel(worksessionService.timerPromise);
            worksessionService.timerPromise = $interval($scope.callSecondBeat, 1000);
            worksessionService.startWork($scope.workSession);
        }

        /** This function kicks off the reflection time */
        $scope.startReflection = function () {
            worksessionService.startReflection($scope.workSession);
        }

        /** This function kicks off the break time */
        $scope.startBreak = function () {
            worksessionService.startBreak($scope.workSession, 123);
        }

        /** This function kicks off the interruption time */
        $scope.startInterruption = function () {
            worksessionService.startInterruption($scope.workSession);
        }

        /** This function restart the work (from a break or interruption) */
        $scope.backToWork = function () {
            worksessionService.backToWork($scope.workSession);
        }

        /** This function stops (or ends) a worksession */
        $scope.stopWork = function () {
            worksessionService.stopWork($scope.workSession);
            $interval.cancel(worksessionService.timerPromise);
            persistenceService.saveWorkSession($scope.workSession);
        }

         /**
         * CRUD OPERATIONS ON THE WORKSESSION
         * ==================================
         */
        
        /** This code loads the current worksession from local storage */
        if (persistenceService.readCurrentWorkingSession() != null) {
            $scope.workSession = persistenceService.readCurrentWorkingSession();
            if ($scope.workSession.status != "stopped") { // start the timer after a refresh, if the work session is not stopped
                $interval.cancel(worksessionService.timerPromise); // stops possible previous $interval, to avoid multiple $interval on the same session 
                worksessionService.timerPromise = $interval($scope.callSecondBeat, 1000);
            }
        }
        
        /** This function calculates the percentage of 
         *  the total working time (includes work and reflection time)
         *  divided by the planned working time
         */
        $scope.getPercentage = function (workSession) {
            return parseInt((workSession.totalWorkTime + workSession.totalReflectionTime) / workSession.plannedWorkTime * 100);
        }

        /** This function retrieves/reads the most recent break record object */
        $scope.getGetLastBreakRecord = function () {
            return worksessionService.getGetLastBreakRecord($scope.workSession);
        }

        /** This function retrieves/reads the most recent interruption record object */
        $scope.getGetLastInterruptionRecord = function () {
            return worksessionService.getGetLastInterruptionRecord($scope.workSession);
        }
        
        /** This function calculate the time remaing for break */
        $scope.getTimeRemainingBreak = function () {
            return worksessionService.getTimeRemainingBreak($scope.workSession);
        }

        
        /** This funciton adds a new time slot */
        $scope.addNewTimeSlot = function () {
            worksessionService.addTimeSlot($scope.workSession);
        }

        /** This function adds a new element to the list of achievements (done item) within a timeslot 
         * (provided as input parameter to the function) 
         */
        $scope.addDoneItem = function (timeSlot) {
            worksessionService.addDoneItem(timeSlot);
        }

        /** This function adds a new element to the list of comments within a timeslot 
         * (provided as input parameter to the function)
        */
        $scope.addCommentItem = function (timeSlot) {
            worksessionService.addCommentItem(timeSlot);
        }

        /** This function adds a new element to the list of future work (next item) within a timeslot
         *  (provided as input parameter to the function)
         */
        $scope.addNextItem = function (timeSlot) {
            worksessionService.addNextItem(timeSlot);
        }

        /** This function deletes an element (at position 'index' provided as input)
         *  from the list of achievements (done item) within a timeslot 
         */
        $scope.deleteDoneItem = function (timeSlot, index) {
            worksessionService.deleteDoneItem(timeSlot, index);
        }

        /** This function deletes an element (at position 'index' provided as input)
         *  from the list of comments within a timeslot 
         */
        $scope.deleteCommentItem = function (timeSlot, index) {
            worksessionService.deleteCommentItem(timeSlot, index);
        }

        /** This function deletes an element (at position 'index' provided as input)
         *  from the list of future works (next item) within a timeslot 
         */
        $scope.deleteNextItem = function (timeSlot, index) {
            worksessionService.deleteNextItem(timeSlot, index);
        }

        /** This function adds a new objective to the current workSession object */
        $scope.addObjective = function (workSession) {
            workSession.objectives.push({
                objective: "",
                plannedTime: 120,
                timeSpent: 0,
                workingOnThis: false,
                status: "not_started", // ["not_started","in_progress","done"]
                comments: [{
                    text: "comment 1"
                }]
            });
        }
        
        /** This function deletes an objective (at position 'index')
         *  from the current workSession
         */
        $scope.deleteObjective = function (workSession, index) {
            if (workSession.objectives.length > 1) {
                workSession.objectives.splice(index, 1);
            }
        }

        /** This function calculates the total time in the current worksession
         *  includes time for work, reflection, break, interruption and catch up
         */
        $scope.getTotalTimeInWorkSession = function () {
            return worksessionService.getTotalTimeInWorkSession($scope.workSession);
        }

        /**
         * WORKSESSION CONFIGURATION
         * ==========================
         */
        
        /** This function takes a copy of the current workSession
         *  This copy is used while changing the worksession configuration in run-time 
         *  The changes of configuration in copy are copied back when the user clicks on 'apply' 
         *  which triggers the function $scope.applyConfig
         */
        $scope.startConfig = function () {
            $scope.copyWorkSession = JSON.parse(JSON.stringify($scope.workSession));
        }
        
        /** This call triggers the copy of workSession (and populates $scope.copyWorkSession)
         *  This avoids a bug in the configuration form which requires $scope.copyWorkSession populated
         */
        $scope.startConfig();

        /** This function applies the configuration change (in $scope.copyWorkSession) 
         *  to the current live worksession ($scope.workSession)*/
        $scope.applyConfig = function () {
            $scope.workSession.workSessionCategory = $scope.copyWorkSession.workSessionCategory;
            $scope.workSession.workSessionName = $scope.copyWorkSession.workSessionName;
            $scope.workSession.plannedWorkTime = $scope.copyWorkSession.plannedWorkTime;
            $scope.workSession.numberOfTimeSlotsByBlock = $scope.copyWorkSession.numberOfTimeSlotsByBlock;
            $scope.workSession.durationTimeSlot = $scope.copyWorkSession.durationTimeSlot;
            $scope.workSession.durationReflection = $scope.copyWorkSession.durationReflection;
            $scope.workSession.catchUpTimeConfig = $scope.copyWorkSession.catchUpTimeConfig;
            $scope.workSession.objectives = $scope.copyWorkSession.objectives;

            worksessionService.saveWorkSession($scope.workSession);
        }                
        
    }); 