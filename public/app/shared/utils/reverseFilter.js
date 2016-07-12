/** This custom filter allows reversing an array order */
angular.module('app').filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});