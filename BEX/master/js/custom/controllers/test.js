myApp.controller('testController', ["$rootScope", "ngDialog", "ArticleManagerService", "CitationsFiltersManagerService","RequestArticlesService", "$scope", "$timeout", "$stateParams", "SEARCH_TYPE","$sessionStorage","BookmarksManagerService","ORDER_BY","ArticlesFiltersManager","$location", function($rootScope, ngDialog, ArticleManagerService, CitationsFiltersManagerService, RequestArticlesService, $scope, $timeout, $stateParams, SEARCH_TYPE, $sessionStorage, BookmarksManagerService, ORDER_BY, ArticlesFiltersManager, $location) {
	var self = this;

	self.params = $stateParams;

	console.log(self.params);

	self.changeParam = function() {
		$location.search("param0","foo");
	}
}]);