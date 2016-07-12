angular.module('app').
    service('authService', [function () {
        /** This function triggers OAuth login  */
        this.login = function () {
            if (localStorage.getItem("userInfo") !== undefined) {
                return localStorage.getItem("userInfo");
            }

            var provider = new firebase.auth.GoogleAuthProvider();

            return firebase.auth().signInWithPopup(provider);
        }

        /** This function logs out the current user */
        this.logout = function () {
            localStorage.removeItem("userInfo");
        }

        /** This function returns the current user information */
        this.getCurrentUser = function () {
            if (localStorage.getItem("userInfo") !== undefined) {
                return JSON.parse(localStorage.getItem("userInfo"));
            } else {
                return null;
            }
        }
    }]);