myApp.controller('RightNavbarController', ["CitationsFiltersManagerService","ArticlesFiltersManager","$rootScope", function(CitationsFiltersManagerService,ArticlesFiltersManager,$rootScope) {
    var self = this;
    self.citationsFilterActivated = CitationsFiltersManagerService.getFilterActivatedBool();
    self.articlesFilterActivated = ArticlesFiltersManager.getFilterActivatedBool();
    self.showRefiningOptions = $rootScope.showRefiningOptions;

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if (toState.name == "app.articles-results") {
			self.showRefiningOptions.value = true;
		} else {
			self.showRefiningOptions.value = false;
		}
	})


	self.checkOffsidebarOverlap = function() {
        return $rootScope.offsidebarOverlap? "offsidebar-open-overlap" : "offsidebar-open";
    }
}]);
