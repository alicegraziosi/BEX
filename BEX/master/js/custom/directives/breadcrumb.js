/**=========================================================
 * Module: breadcrumb.js
 * elemento per il breadcrumb
 =========================================================*/

myApp.directive('breadcrumb', ["StatesManagerService", "$rootScope", "SEARCH_TYPE", function(StatesManagerService, $rootScope, SEARCH_TYPE) {
	"use strict";

	return {
		restrict: 'E',
		templateUrl: 'app/templates/breadcrumb.html',
		scope:{},
		link: function($scope){
			$scope.states = StatesManagerService.getStates();
			$scope.types = SEARCH_TYPE;

			$scope.changeState = function(stateIndex, lastBreadcrumb) {
				if (!lastBreadcrumb) {
					var newState = StatesManagerService.getState(stateIndex);
					$rootScope.$state.go(newState.name, newState.params);
				}

			}
		}
	}
}]);