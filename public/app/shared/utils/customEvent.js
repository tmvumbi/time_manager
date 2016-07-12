/** This custom event is trigged when the enter key is pressed */
angular.module('app').directive('enterPressed', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterPressed);
                });
                event.preventDefault();
            }
        });
    };
});

/** This custom event is trigged when [shift+delete] is pressed */
angular.module('app').directive('shiftDeletePressed', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.shiftKey && event.which === 46) {
                scope.$apply(function (){
                    scope.$eval(attrs.shiftDeletePressed);
                });
                event.preventDefault();
            }
        });
    };
});