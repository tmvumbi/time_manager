/** This widget allows OAuth authentication, using a google account */
angular.module('app').directive('authWidget', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/shared/directives/auth-widget.html',

        controller: function ($scope, authService) {
            /** This variable contains the user infos */
            $scope.userInfo = authService.getCurrentUser();
            
            /** This variable contains the auth error */
            $scope.error = null;
            
            /** This function triggers OAuth authentication
             *  it opens the google's log-in popup windows
             *  after login, the user can select to allow Time Manager to use google authentication
             */
            $scope.login = function () {
                var provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithPopup(provider).
                then(function (result) { // This promise in triggered when auth has been successfull
                    /** This variable contains the Google's Access Token. 
                     * It can be used to access the Google's API.
                     */ 
                    var token = result.credential.accessToken;
                    
                    /** This code reads the user info */
                    var user = result.user;
                    
                    /** This code copies only the user infomation needed by Time Manager */
                    var userInfo = {
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        uid: user.uid
                    }

                    /** This code caches the user info */
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));

                    /** This code copies the user info to the $scope var 
                     *  to make them available to the view */                   
                    $scope.userInfo = userInfo;
                    $scope.error = null;
                    $scope.$apply();
                    
                    /** This code reloads the page at the end of authentication */
                    location.reload();

                }).catch(function (error) { // This promise in triggered when auth has failed
                    /** This code populates the error object */
                    $scope.error = {
                        errorCode: error.code,
                        errorMessage: error.message
                    };
                    
                    /** This code empties the userInfo variable */
                    $scope.userInfo = null;
                });

            }
            
            /** This function logs out the current user */
            $scope.logout = function () {
                authService.logout();
                $scope.userInfo = null;
                
                /** This code reloads the page at the end of logout*/
                location.reload();
            }
        }
    }
});