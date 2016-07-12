'use strict';

angular.module('app').config(function($stateProvider, $urlRouterProvider){
	  /** For any unmatched url, redirect to */
	 $urlRouterProvider.otherwise("/home");

	  $stateProvider
	  .state('home', {
	      url: '/home',
	      templateUrl: 'app/components/dashboard/dashboardView.html',
	      controller: 'dashboardController'
	  })
	  
	  .state('work_session', { 
	      url: '/work_session',
	      templateUrl: 'app/components/work_session/workSessionView.html',
	      controller: 'workSessionController'
	  });
	  
});