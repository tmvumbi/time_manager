angular.module('app').
    service('worksessionService',
    ['$interval',
        'persistenceService',
        'speechService',
        function (
            $interval,
            persistenceService,
            speechService) {
                
            this.timerPromise;
                
            /**
             * SOUND RELATED FUNCTIONS
             * ==========================
             */
            
            /** This object contains the state of sound (true if activated and false if deactivated) */
            this.soundActive = {
                data: true
            }
            
            /** This function returns the sound state (true if activated and false if deactivated) */
            this.isSoundActive = function(){
                return this.soundActive.data;
            }
            
            /** This function activates/deactivates the sound (for speech synthesis) */
            this.toggleSound = function(){
                if (this.isSoundActive()){
                    this.soundActive.data = false;
                } else {
                    this.soundActive.data = true;
                }
            }

            /**
             * CRUD OPERATIONS ON THE WORKSESSION
             * ==================================
             */
            
            /** This function persists (in localstorage or cloud) the workSession in parameter */
            this.saveWorkSession = function (workSession) {
                persistenceService.saveWorkSession(workSession);
            }

            /** This function retrieves the current (or active) time slot
             *  from the worksession passed in parameter
             */
            this.getCurrentTimeSlot = function (workSession) {
                var lastTimeBlockIndex = workSession.timeBlocks.length - 1;
                var lastTimeSlotIndex = workSession.timeBlocks[lastTimeBlockIndex].timeSlots.length - 1;

                return workSession.timeBlocks[lastTimeBlockIndex].timeSlots[lastTimeSlotIndex];
            }
            
            /** This function retrieves the current (or active) time block
             *  from the worksession passed in parameter
             */            
            this.getCurrentTimeBlock = function (workSession) {
                var lastTimeBlockIndex = workSession.timeBlocks.length - 1;
                return workSession.timeBlocks[lastTimeBlockIndex];
            }

                
            /** This function calculates the total time in the worksession passed as parameter
             *  includes time for work, reflection, break, interruption and catch up
             */
            this.getTotalTimeInWorkSession = function(workSession){
                return workSession.totalWorkTime+
                     + workSession.totalReflectionTime
                     + workSession.totalBreakTime
                     + workSession.totalInterruptionTime
                     + workSession.totalCatchUpTime;
            }

            /** This function retreive the most recent break object
             *  This object contains break informations 
             *  (like planned break time, actual time spent in the break)
             */
            this.getGetLastBreakRecord = function (workSession) {
                return workSession.breaks[workSession.breaks.length - 1];
            }
            
            /** This function retreive the most recent interruption object
             *  This object contains interruption informations 
             *  (like the duration of the interruption)
             */            
            this.getGetLastInterruptionRecord = function (workSession) {
                return workSession.interruptions[workSession.interruptions.length - 1];
            }

            /** This function calculates the time remaining in the current break */
            this.getTimeRemainingBreak = function(workSession){
                var lastBreak = this.getGetLastBreakRecord(workSession);
                lastBreak.timeRemainingBreak = lastBreak.timePlanned - workSession.timeSpentCurrentBreak;
                return lastBreak.timeRemainingBreak;
            }
            
            /** This function calculates the time remaining in the current time slot */
            this.getTimeRemainingInTimeSlot = function (workSession) {
                return workSession.durationTimeSlot - workSession.timeSpentCurrentTimeSlot;
            }
            
            /** This function calculates the time remaining in the current reflection time */
            this.getTimeRemainingReflectionTime = function (workSession) {
                return workSession.durationReflection - workSession.timeSpentCurrentReflection;
            }
            
            /** This function calculates the catch time based on the break or interruption time
             *  and a configuration (contained in 'catchUpTimeConfig')
             */
            var calculateCatchUpTime = function (breakTime, catchUpTimeConfig) {
                for (var i = 0; i < catchUpTimeConfig.length; i++) {
                    if (breakTime <= catchUpTimeConfig[i].break) {
                        return catchUpTimeConfig[i].catchUp;
                    }
                }

                return 300;
            }

            /** This function clears counters */
            var reInitAllCurrentCounters = function (workSession) {
                workSession.timeSpentCurrentReflection = 0;
                workSession.timeSpentCurrentBreak = 0;
                workSession.timeSpentCurrentInterruption = 0;
                workSession.timeSpentCurrentCatchUp = 0;
                workSession.remainingCatchUpTime = 0;
            }
            
                        this.addDoneItem = function (timeSlot) {
                timeSlot.done.push({
                    smiley: null,
                    text: ""
                })
            }

            /** This function adds a new element to the list of comments within a timeslot 
             *  (provided as input parameter to the function)
             */
            this.addCommentItem = function (timeSlot) {
                timeSlot.comment.push({
                    smiley: null,
                    text: ""
                })
            }

            /** This function adds a new element to the list of future work (next item) within a timeslot
             *  (provided as input parameter to the function)
             */
            this.addNextItem = function (timeSlot) {
                timeSlot.next.push({
                    smiley: null,
                    text: ""
                })
            }

            /** This function deletes an element (at position 'index' provided as input)
             *  from the list of achievements (done item) within a timeslot 
             */
            this.deleteDoneItem = function (timeSlot, index) {
                if (timeSlot.done.length > 1) {
                    timeSlot.done.splice(index, 1);
                }
            }

            /** This function deletes an element (at position 'index' provided as input)
             *  from the list of comments within a timeslot 
             */
            this.deleteCommentItem = function (timeSlot, index) {
                if (timeSlot.comment.length > 1) {
                    timeSlot.comment.splice(index, 1);
                }
            }

            /** This function deletes an element (at position 'index' provided as input)
             *  from the list of future works (next item) within a timeslot 
             */
            this.deleteNextItem = function (timeSlot, index) {
                if (timeSlot.next.length > 1) {
                    timeSlot.next.splice(index, 1);
                }
            }

            /** This funciton adds a new time slot */
            this.addTimeSlot = function (workSession) {
                var lastTimeBlockIndex = workSession.timeBlocks.length - 1;
                var lastTimeSlotIndex = workSession.timeBlocks[lastTimeBlockIndex].timeSlots.length - 1;

                var lastTimeSlotId = workSession.timeBlocks[lastTimeBlockIndex].timeSlots[lastTimeSlotIndex].idTimeSlot;

                var nextTimeSlotId = lastTimeSlotId + 1;

                if (nextTimeSlotId > workSession.numberOfTimeSlotsByBlock) {
                    this.addTimeBlock(workSession);
                } else {
                    workSession.timeBlocks[lastTimeBlockIndex].timeSlots.push({
                        idTimeSlot: nextTimeSlotId,
                        timeSpent: 0,
                        done: [
                            {
                                text: ""
                            }
                        ],
                        comment: [
                            {
                                text: ""
                            }
                        ],
                        next: [
                            {
                                text: ""
                            }
                        ]
                    });
                }
            }

            /** This funciton adds a new time bloc */
            this.addTimeBlock = function (workSession) {
                var lastTimeBlockId = workSession.timeBlocks[workSession.timeBlocks.length - 1].idTimeBlock;
                workSession.timeBlocks.push({
                    idTimeBlock: lastTimeBlockId + 1,
                    timeSpent: 0,
                    comment: "",
                    timeSlots: [{
                        idTimeSlot: 1,
                        timeSpent: 0,
                        done: [
                            {
                                text: ""
                            }
                        ],
                        comment: [
                            {
                                text: ""
                            }
                        ],
                        next: [
                            {
                                text: ""
                            }
                        ]
                    }]
                });
            }

            /** This funciton creates and initializes a new worksession object */
            this.createNewWorkSession = function (
                category, 
            name, 
            plannedWorkTime, 
            numberOfTimeSlotsByBlock, 
            durationTimeSlot, 
            durationReflection,
            objectives,
            catchUpTimeConfig,
            timeSlotConfig
            ) {
                return {
                    id: Date.now(),
                    cloudKey: null,
                    // config data
                    workSessionCategory: category,
                    workSessionName: name,
                    plannedWorkTime: plannedWorkTime,
                    numberOfTimeSlotsByBlock: numberOfTimeSlotsByBlock,
                    durationTimeSlot: durationTimeSlot,
                    durationReflection: durationReflection,
                    timeSlotConfig: timeSlotConfig,
                    catchUpTimeConfig: catchUpTimeConfig,

                    // operational data
                    timeSpentCurrentTimeSlot: 0,
                    timeSpentCurrentReflection: 0,
                    timeSpentCurrentBreak: 0,
                    timeSpentCurrentInterruption: 0,
                    timeSpentCurrentCatchUp: 0,
                    remainingCatchUpTime: 0,

                    // persisted data
                    status: "stopped", // Can be: work,reflection,break,interruption
                    dateTimeStart: Date(),
                    dateTimeFinish: null,
                    totalWorkTime: 0,
                    totalReflectionTime: 0,
                    totalBreakTime: 0,
                    totalInterruptionTime: 0,
                    totalCatchUpTime: 0,
                    objectives: objectives,

                    breaks: [], // i.e {timePlanned: 300,timeSpent: 0, timeRemainingBreak:0, active: true,comment: ""}
                    interruptions: [], // i.e. {timeSpent: 0, comment: ""}

                    timeBlocks: [
                        {
                            idTimeBlock: 1,
                            timeSpent: 0,
                            comment: "",

                            timeSlots: [{
                                idTimeSlot: 1,
                                timeSpent: 0,
                                done: [
                                    {
                                        text: ""
                                    }
                                ],
                                comment: [
                                    {
                                        text: ""
                                    }
                                ],
                                next: [
                                    {
                                        text: ""
                                    }
                                ]
                            }]

                        }

                    ]
                }

            }
            
            /**
             * TIMER PULSATION
             * ===============
             */    
            /** This function is to be called every second */
            this.secondBeat = function (workSession) {

                /** This call allows saving the current worksession every second */
                this.saveWorkSession(workSession);

                /** This logic allows incrementing various counters, based on the workstation state */
                if (workSession.status == "work") {
                    workSession.totalWorkTime++;
                    workSession.timeSpentCurrentTimeSlot++;
                    this.getCurrentTimeBlock(workSession).timeSpent++;
                    this.getCurrentTimeSlot(workSession).timeSpent++;
                } else if (workSession.status == "reflection") {
                    workSession.totalReflectionTime++;
                    workSession.timeSpentCurrentReflection++;
                } else if (workSession.status == "break") {
                    workSession.totalBreakTime++;
                    workSession.timeSpentCurrentBreak++;
                    this.getGetLastBreakRecord(workSession).timeSpent++;
                } else if (workSession.status == "interruption") {
                    workSession.totalInterruptionTime++;
                    workSession.timeSpentCurrentInterruption++;
                    this.getGetLastInterruptionRecord(workSession).timeSpent++;
                } else if (workSession.status == "catch_up") {
                    workSession.totalCatchUpTime++;
                    workSession.timeSpentCurrentCatchUp++;
                    workSession.remainingCatchUpTime--;
                }
                
                /** This logic allows incrementing the time spent in objectives
                 *  with the status 'workingOnThis' when the worksession status
                 *  is 'work', 'reflection' or 'catch_up'
                 */
                if (workSession.status == "work" 
                    || workSession.status == "reflection"
                    || workSession.status == "catch_up"
                ) {
                    for(var i=0;i<workSession.objectives.length;i++){
                        if (workSession.objectives[i].workingOnThis){
                            workSession.objectives[i].timeSpent += 1;
                        }
                    }
                }

                /** NOTIFICATIONS
                 *  =============
                 */ 
                /** Notifications when the worksession status is 'work' */
                if (workSession.status == "work") {
                    /** Notify that half the time slot has been consumed */
                    if (workSession.timeSpentCurrentTimeSlot == Math.round(workSession.durationTimeSlot / 2)) {
                        $.notify("Half the time slot completed","success");
                        if (this.isSoundActive()){
                            speechService.playHalfTimeSlot();
                        }
                    }
                    
                    /** Notify that a minute remains in the current time slot */
                    if (this.getTimeRemainingInTimeSlot(workSession) == 60) {
                        $.notify("One minute remaining","success");
                        if (this.isSoundActive()){
                            speechService.playOneMinRemaining();
                        }
                    }
                    
                    /** Count down notification when 5 sec remains in the current work session */
                    if (this.getTimeRemainingInTimeSlot(workSession) == 5) {
                        $.notify("5","success");
                        if (this.isSoundActive()){
                            speechService.playFive();
                        }
                    } else if (this.getTimeRemainingInTimeSlot(workSession) == 4) {
                        $.notify("4","success");
                        if (this.isSoundActive()){
                            speechService.playFour();
                        }
                    } else if (this.getTimeRemainingInTimeSlot(workSession) == 3) {
                        $.notify("3","success");
                        if (this.isSoundActive()){
                            speechService.playThree();
                        }
                    } else if (this.getTimeRemainingInTimeSlot(workSession) == 2) {
                        $.notify("2","success");
                        if (this.isSoundActive()){
                            speechService.playTwo();
                        }
                    } else if (this.getTimeRemainingInTimeSlot(workSession) == 1) {
                        $.notify("1","success");
                        if (this.isSoundActive()){
                            speechService.playOne();
                        }
                    } else if (this.getTimeRemainingInTimeSlot(workSession) == 0) {
                        $.notify("Time slot completed; reflection time","success");
                        if (this.isSoundActive()){
                            speechService.playTimeSlotCompleted();
                        }
                    }
                }

                /** Notifications when the worksession status is 'reflection' */
                if (workSession.status == "reflection") {
                    /** Notify that half the refleciton time been consumed */
                    if (this.getTimeRemainingReflectionTime(workSession) == Math.round(workSession.durationReflection / 2)) {
                        $.notify("Half reflection time completed","success");
                        if (this.isSoundActive()){
                            speechService.playHalfReflectionCompleted();
                        }
                    }
                    
                    /** Count down notification when 5 sec remains in the current reflection time */
                    if (this.getTimeRemainingReflectionTime(workSession) == 5) {
                        $.notify("5","success");
                        if (this.isSoundActive()){
                            speechService.playFive();
                        }
                    } else if (this.getTimeRemainingReflectionTime(workSession) == 4) {
                        $.notify("4","success");
                        if (this.isSoundActive()){
                            speechService.playFour();
                        }
                    } else if (this.getTimeRemainingReflectionTime(workSession) == 3) {
                        $.notify("3","success");
                        if (this.isSoundActive()){
                            speechService.playThree();
                        }
                    } else if (this.getTimeRemainingReflectionTime(workSession) == 2) {
                        $.notify("2","success");
                        if (this.isSoundActive()){
                            speechService.playTwo();
                        }
                    } else if (this.getTimeRemainingReflectionTime(workSession) == 1) {
                        $.notify("1","success");
                        if (this.isSoundActive()){
                            speechService.playOne();
                        }
                    } else if (this.getTimeRemainingReflectionTime(workSession) == 0) {
                        $.notify("Back to work!","success");
                        if (this.isSoundActive()){
                            speechService.playBackToWork();
                        }
                    }
                }

                /** Notifications when the worksession status is 'break' */
                if (workSession.status == "break") {
                    /** Notify that 2 mins remains in the break time */
                    if (this.getTimeRemainingBreak(workSession)== 120) {
                        $.notify("2 minutes remaining before end of breaktime","success");
                        if (this.isSoundActive()){
                            speechService.playTwoMinRemaining();
                        }
                    }
                    
                    /** Count down notification when 5 sec remains in the current break time */
                    if (this.getTimeRemainingBreak(workSession) == 5) {
                        $.notify("5","success");
                        if (this.isSoundActive()){
                            speechService.playFive();
                        }
                    } else if (this.getTimeRemainingBreak(workSession)== 4) {
                        $.notify("4","success");
                        if (this.isSoundActive()){
                            speechService.playFour();
                        }
                    } else if (this.getTimeRemainingBreak(workSession) == 3) {
                        $.notify("3","success");
                        if (this.isSoundActive()){
                            speechService.playThree();
                        }
                    } else if (this.getTimeRemainingBreak(workSession) == 2) {
                        $.notify("2","success");
                        if (this.isSoundActive()){
                            speechService.playTwo();
                        }
                    } else if (this.getTimeRemainingBreak(workSession) == 1) {
                        $.notify("1","success");
                        if (this.isSoundActive()){
                            speechService.playOne();
                        }
                    } else if (this.getTimeRemainingBreak(workSession) == 0) {
                        $.notify("Break is over, please get back to work now","success");
                        if (this.isSoundActive()){
                            speechService.playBackToWork();
                        }
                    }

                }
                /** -- END OF NOTIFICATIONS -- */

                /** This logic allows starting reflection at the end of work time */ 
                if (workSession.timeSpentCurrentTimeSlot >= workSession.durationTimeSlot) {
                    workSession.timeSpentCurrentTimeSlot = 0;
                    if (workSession.durationReflection!=0){
                        this.startReflection(workSession); 
                    } else {
                        this.startWork(workSession); 
                    }
                    
                }

                /** This logic allows returning to 'work' status at the end of reflection time
                 *  it also creates a new time slot object
                 */ 
                if (workSession.timeSpentCurrentReflection >= workSession.durationReflection) {
                    workSession.timeSpentCurrentReflection = 0;
                    this.startWork(workSession);
                    this.addTimeSlot(workSession);
                }

                /** This logic allows to get back to work mode at the end of catch up time */
                if (workSession.status == "catch_up" && workSession.remainingCatchUpTime <= 0) {
                    workSession.timeSpentCurrentCatchUp = 0;
                    this.startWork(workSession);
                }
            }
            /** -- END OF TIMER PULSATION -- */
            
            /**
             * WORKSESSION SESSION LIFE CYCLE FUNCTIONS
             * ========================================
             */
            
            /** This function kicks off a new work session */
            this.startWork = function (workSession) {

                workSession.remainingCatchUpTime = 0;
                workSession.status = "work";
            }

            /** This function allows returning to 'work' status 
             *  from a 'break' or 'interrution' status 
             */
            this.backToWork = function (workSession) {
                /** This logic records the time spent in break or interruption */ 
                if (workSession.status == "break") {
                    var lastLastBreak = this.getGetLastBreakRecord(workSession);
                    lastLastBreak.active = false;
                    lastLastBreak.time = workSession.timeSpentCurrentBreak;
                } else {
                    var lastLastInterruption = this.getGetLastInterruptionRecord(workSession);
                    lastLastInterruption.time = workSession.timeSpentCurrentInterruption;
                }
                
                /** This logic re-initializes the counter for time spent in break and interrution
                 *  then kicks off the catch up time
                 */
                workSession.remainingCatchUpTime = calculateCatchUpTime(workSession.timeSpentCurrentBreak + workSession.timeSpentCurrentInterruption, workSession.catchUpTimeConfig);
                workSession.timeSpentCurrentBreak = 0;
                workSession.timeSpentCurrentInterruption = 0;
                this.startCatchUp(workSession);
            }
            
            /** This function kicks off the reflection time */
            this.startReflection = function (workSession) {
                workSession.status = "reflection";
            }

            /** This function kicks off the break time */
            this.startBreak = function (workSession, breakTime) {
                workSession.status = "break";
                workSession.breaks.push({
                    timePlanned: 300,
                    timeSpent: 0,
                    timeRemainingBreak:0,
                    active: true,                    
                    comment: ""
                });
            }

            /** This function kicks off the interruption time */
            this.startInterruption = function (workSession) {
                workSession.status = "interruption";
                workSession.interruptions.push({
                    timeSpent: 0,
                    comment: ""
                });
            }

            /** This function kicks off the catch up time */
            this.startCatchUp = function (workSession) {
                workSession.status = "catch_up";
            }


            
            /** This function stops (or ends) a worksession */
            this.stopWork = function (workSession) {
                workSession.status = "stopped";
                reInitAllCurrentCounters(workSession);
            }


        }]);