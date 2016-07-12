angular.module('app').
    service('dashboardService',
    ['persistenceService',
        'authService',
        'worksessionService',
        function (
            persistenceService,
            authService,
            worksessionService
        ) {
            
            /** This function reads the workSession collection from either localstorage or the cloud  */
            this.getWorkSessionCollection = function (callbackFunction) {
                persistenceService.readWorkSessionCollection(callbackFunction);
            }

            /** This function creates a new workession object */
            this.createNewWorkSession = function (
                workSessionCategory,
                workSessionName,
                plannedWorkTime,
                numberOfTimeSlotsByBlock,
                durationTimeSlot,
                durationReflection,
                objectives,
                catchUpTimeConfig,
                timeSlotConfig
            ) {
                // Create the work-session object
                var workSession = worksessionService.createNewWorkSession(
                    workSessionCategory,
                    workSessionName,
                    plannedWorkTime,
                    numberOfTimeSlotsByBlock,
                    durationTimeSlot,
                    durationReflection,
                    objectives,
                    catchUpTimeConfig,
                    timeSlotConfig
                );

                // Persist the current worksession and its id
                persistenceService.saveWorkSession(workSession);
                persistenceService.persistCurrentWorkingSession(workSession);
            }

            /** This function persists the workSession object in the parameter
             *  to localstorage or the cloud
             */
            this.persistWorkSession = function (workSession) {
                persistenceService.persistCurrentWorkingSession(workSession);
            }
            
            /** This function deletes the workSession object in the parameter 
             *  from localstorage or the cloud
            */
            this.deleteWorkSession = function (workSession) {
                persistenceService.deleteWorkSession(workSession);
            }

            /** This function generates a default configuration for a new worksession */
            this.getInitialWorkSessionConfig = function () {
                return {
                    workSessionCategory: "",
                    workSessionName: "",
                    plannedWorkTime: 3600,
                    timeSlotConfig: "0",
                    numberOfTimeSlotsByBlock: 4,
                    durationTimeSlot: 300,
                    durationReflection: 60,
                    objectives: [
                        {
                            objective: "",
                            plannedTime: 0,
                            timeSpent: 0,
                            workingOnThis: false,
                            completed: false,
                            comments: [{
                                text: ""
                            }]
                        }
                    ],
                    catchUpTimeConfig: [
                        {
                            break: 300,
                            catchUp: 60
                        },
                        {
                            break: 600,
                            catchUp: 120
                        },
                        {
                            break: 24 * 3600,
                            catchUp: 300
                        }
                    ],
                }
            }
        }]);