/**
 * This directive allows binding a popup windows to the DOM element
 * it's applied on.
 * Note: not currently used in the project (opted to use modals instead)
 */
angular.module('app').directive('bindConfigPopup', function () {
    return function (scope, element, attrs) {
        console.log(element);
        var drop = new Drop({
            target: element.context,
            content: '<div>Text<worksession-config work-session="workSession" /></div>',
            position: 'bottom left',
            openOn: 'click'
        });
        
    };
});