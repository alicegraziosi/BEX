myApp.controller("ComparisonsController", ["$rootScope", "RequestArticlesService", "ArticleManagerService", "$sessionStorage",
  function($rootScope, RequestArticlesService, ArticleManagerService, $sessionStorage) {

  	var self = this;
  	self.authors = [];

  	self.authorUno = "";
  	self.authorDue = "";

  	// $rootScope.authors = []
    self.refreshAuthors = function(str) {
        self.authors.length = 0;
        for (key in $rootScope.authors) {
            if ($rootScope.authors[key].s.toUpperCase().startsWith(str.toUpperCase())) {
                selectitem = $rootScope.authors[key].s + ", " + $rootScope.authors[key].n;
                author = {"fullName": selectitem, "n": $rootScope.authors[key].n, "s": $rootScope.authors[key].s };
                self.authors.push(author);
            }
        }
    };

 }]);