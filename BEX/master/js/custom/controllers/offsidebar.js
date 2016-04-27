myApp.controller('OffsidebarController',["$rootScope","$localStorage", function($rootScope, $localStorage){
	var self = this;
	if (angular.isDefined($localStorage.overlap) ) {
		self.overlap = $rootScope.offsidebarOverlap = $localStorage.overlap;
	} else {
		$localStorage.overlap = self.overlap = $rootScope.offsidebarOverlap;
	}

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		$rootScope.offsidebarOverlap?$('body').removeClass('offsidebar-open-overlap'):$('body').removeClass('offsidebar-open');
	})

	self.switchOffsidebarOverlap = function() {
		$rootScope.offsidebarOverlap?$('body').removeClass('offsidebar-open-overlap'):$('body').removeClass('offsidebar-open');
		$rootScope.offsidebarOverlap = !$rootScope.offsidebarOverlap;
		$localStorage.overlap = $rootScope.offsidebarOverlap;
		//console.log($rootScope.offsidebarOverlap)
	}
}]);