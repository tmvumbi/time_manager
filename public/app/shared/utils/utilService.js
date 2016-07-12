angular.module('app').
    service('utilService', [function () {
        /** This function translates number to letters
         *  1 -> A, 2 -> B, ..., 26 -> Z, 27 -> Z1, etc.
         */
        this.numberToLetter = function(number){
            if (number>=1 && number<=26){
                return String.fromCharCode(number+64);
            } else {
                return "Z"+(number-26);
            }
        }
        
        /** This function formats the date to 'dd MMM yyyy' */
        this.formatDate = function (dateString) {
            var monthNames = [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Aug", "Sept", "Oct",
                "Nov", "Dec"
            ];

            var date = new Date(dateString);
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + ' ' + monthNames[monthIndex] + ' ' + year;
        }

        /** This function formats a duration (in second) to 'hour min sec' format 
         *   The parameter 'showSec' is a boolean flag to display or not second 
         *   for duration greater than 1 min
        */
        this.formatDuration = function (duration, showSec) {
            var hours = parseInt(duration / 3600) % 24;
            var minutes = parseInt(duration / 60) % 60;
            var secondes = parseInt(duration) % 60;

            if (duration < 60) {
                return secondes + "\"";
            } else if (duration < 60 * 60) {
                if (secondes == 0) {
                    return minutes + "'";
                } else {
                    if (showSec) {
                        return minutes + "' " + secondes + "\"";
                    } else {
                        return minutes + "'"; // + secondes + " sec";
                    }
                    
                }
            } else {
                if (minutes==0 && secondes==0){
                    return hours + " h";
                } else if (secondes==0){
                    return hours + " h " + minutes + "'";
                } else {
                    return hours + " h " + minutes + "' "; //+ secondes + " sec";
                }
            }
        }
    }])