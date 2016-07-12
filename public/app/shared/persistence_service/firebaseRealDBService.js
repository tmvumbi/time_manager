angular.module('app').
    service('firebaseRealDBService', [function () {
        /** This variable contains the firebase real time database handle */
        var database = firebase.database();

        /** This function adds a new workSession to the cloud */ 
        this.addNewWorkSession = function (workSession, userUID) {
            var postPayload = JSON.stringify(workSession);
            var newPostKey = firebase.database().ref().child(userUID).push(postPayload).key;
            return newPostKey;
        }

        /** This function updates a workSession in the cloud  */ 
        this.updateNewWorkSession = function (workSession, cloudKey, userUID) {
            var postPayload = JSON.stringify(workSession);
            firebase.database().ref(userUID+"/"+cloudKey).set(postPayload);
        }

        /** This function removes a workSession from the cloud */
        this.removeWorkSession = function (cloudKey, userUID) {
            firebase.database().ref(userUID+"/"+cloudKey).set(null);
        }

        /** This function retrieves a collection of workSession objects from the cloud  */
        this.retrieveWorkSessionCollection = function (userUID, callbackFunction) {
            firebase.database().ref(userUID).on('value', function (snapshot) {
                var workSessionCollection = [];
                var result = snapshot.val();
                for (var prop in result) {
                    workSessionCollection.push(JSON.parse(result[prop]));
                }
                callbackFunction(workSessionCollection);
            });
        }

        /** This function retrieves a single workSession from the cloud  */ 
        this.retrieveWorkSession = function (cloudKey, userUID) {
            firebase.database().ref().child(userUID + "/" + cloudKey).forEach(function (childSnapshot) {
                console.log(childSnapshot);
            });
        }

    }]);