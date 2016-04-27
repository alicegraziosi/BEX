myApp.controller('BookmarksController',['BookmarksManagerService','$rootScope','SEARCH_TYPE','ngDialog', function(BookmarksManagerService, $rootScope, SEARCH_TYPE, ngDialog){
	"use strict";
	var self = this;

	var bookmarksIDB = BookmarksManagerService.getBookmarksIDB();
	self.bookmarks = bookmarksIDB.values;

	function joinBookmarksDois() {
		var doiList = [];
		for (var key in self.bookmarks) {
			doiList.push(self.bookmarks[key].doi);
		}
		return doiList.join($rootScope.paramsTokensDelimiter);
	}

	self.removeAllBookmarks = function() {
		BookmarksManagerService.deleteAllBookmarks();
	}

	self.getBookmarksLink = function() {
		var generatedURL = $rootScope.$state.href(
			"app.articles-results",
			{list: joinBookmarksDois()},
			{absolute: true});

		ngDialog.open({
			template: "app/templates/dialog-article-url",
			className: "ngdialog-theme-default-custom",
			data: {
				url: generatedURL
			}
		});
	}

}]);