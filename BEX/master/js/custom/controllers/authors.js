myApp.controller("AuthorsController",["$rootScope", "RequestArticlesService", "ArticleManagerService", "$sessionStorage",
  function($rootScope, RequestArticlesService, ArticleManagerService, $sessionStorage) {
  	var self = this;
    self.searchText = "";
  	self.authors = [];
    self.searchAuthor = "";  // autore cercato

  	self.searchForArticles = function() {
        RequestArticlesService.setSearchString(self.searchText); //todo: rivedere a cosa serve
        if (self.searchAuthor) {
            $sessionStorage.searchQuery = self.searchAuthor.n + " " + self.searchAuthor.s;
            $rootScope.$state.go('app.author-results', {
                newSearch: true,                                // � una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                author: $sessionStorage.searchQuery        // nome dell'autore
            });
        }
        
    }

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


    self.keyPressCallBack = function($event) {
        self.searchForArticles()
        $event.preventDefault();
    }
  }
]);
