angular.module('app').
    service('persistenceService', [
        'firebaseRealDBService',
        'authService',
        function (
            firebaseRealDBService,
            authService
        ) {
            /** This function saves a work sesssion in the local storage or the cloud */ 
            this.saveWorkSession = function (workSession) {
                this.persistCurrentWorkingSession(workSession);
                if (authService.getCurrentUser() == null) { // If no user logged in, use local storage
                    var keyName = workSession.id;
                    if (localStorage.getItem("__workSessionCollection") == null) {
                        var workSessionCollection = {};
                        workSessionCollection[keyName] = workSession;
                        localStorage.setItem("__workSessionCollection", JSON.stringify(workSessionCollection));
                    } else {
                        var workSessionCollection = JSON.parse(localStorage.getItem("__workSessionCollection"));
                        workSessionCollection[keyName] = workSession;
                        localStorage.setItem("__workSessionCollection", JSON.stringify(workSessionCollection));
                    }
                } else { // Otherwise (meaning a user is logged in)use the firebase cloud database
                    if (workSession.cloudKey != null) {
                        firebaseRealDBService.updateNewWorkSession(workSession, workSession.cloudKey, authService.getCurrentUser().uid);
                    } else {
                        var cloudKey = firebaseRealDBService.addNewWorkSession(workSession, authService.getCurrentUser().uid);
                        workSession.cloudKey = cloudKey;
                        firebaseRealDBService.updateNewWorkSession(workSession, workSession.cloudKey, authService.getCurrentUser().uid);
                    }
                }
            }

            /** This function deletes a worksession object from the local storage or the cloud */ 
            this.deleteWorkSession = function (workSession) {
                if (authService.getCurrentUser() == null) {// If no user logged in, delete from local storage
                    if (localStorage.getItem("__workSessionCollection") != null) {
                        var workSessionCollection = JSON.parse(localStorage.getItem("__workSessionCollection"));
                        delete workSessionCollection[workSession.id];
                        localStorage.setItem("__workSessionCollection", JSON.stringify(workSessionCollection));
                    }
                } else {// Otherwise (meaning a user is logged in), delete from the cloud database
                    var cloudKey = workSession.cloudKey;
                    if (cloudKey != null) {
                        firebaseRealDBService.removeWorkSession(cloudKey, authService.getCurrentUser().uid);
                    }
                }
            }

            /** This function retrieves a workSession collection from local storage or the cloud  */ 
            this.readWorkSessionCollection = function (callbackFunction) {
                if (authService.getCurrentUser() == null) { // If no user logged in, retrieve from local storage
                    if (localStorage.getItem("__workSessionCollection") == null) {
                        callbackFunction(null);
                    } else {
                        var workSessionCollection = JSON.parse(localStorage.getItem("__workSessionCollection"));
                        var workSessionArray = [];
                        for (var key in workSessionCollection) {
                            workSessionArray.push(workSessionCollection[key]);
                        }
                        callbackFunction(workSessionArray);
                    }
                } else { // Otherwise (meaning a user is logged in), retrieve from the cloud database
                    firebaseRealDBService.retrieveWorkSessionCollection(
                        authService.getCurrentUser().uid, callbackFunction
                    )
                }
            }

            /** This function persists the current worksession object in local storage */
            this.persistCurrentWorkingSession = function (workSession) {
                sessionStorage.setItem("__currentWorkingSession", JSON.stringify(workSession));
            }

            /** This function retrieves the current worksession object from local storage */
            this.readCurrentWorkingSession = function () {
                if (sessionStorage.getItem("__currentWorkingSession") == null) {
                    return null;
                } else {
                    return JSON.parse(sessionStorage.getItem("__currentWorkingSession"));
                }
            }

        }]);