myApp.controller("ComparisonsController", ["$rootScope", "RequestArticlesService", "ArticleManagerService", "$sessionStorage", "Ping",
    function($rootScope, RequestArticlesService, ArticleManagerService, $sessionStorage, Ping) {
      	
        Ping.selectQueryFile();
        Ping.pingEndpoint();

        var self = this;
      	self.authors = [];
      	self.authorUno = "";
      	self.authorDue = "";
        self.comparisonType = "incoming";  // incoming o outgoing
        
      	// $rootScope.authors = []
        self.refreshAuthors = function(str) {
            self.authors.length = 0;
            for (key in $rootScope.authors) {
                //if ($rootScope.authors[key].s.toUpperCase().startsWith(str.toUpperCase())) {
                if ($rootScope.authors[key].fullName.toLowerCase().match(str)) {
                    selectitem = $rootScope.authors[key].s + ", " + $rootScope.authors[key].n;
                    author = {"fullName": selectitem, 
                              "n": $rootScope.authors[key].n, 
                              "s": $rootScope.authors[key].s, 
                              "uri": $rootScope.authors[key].uri};
                    self.authors.push(author);
                }
            }
        };
}]);