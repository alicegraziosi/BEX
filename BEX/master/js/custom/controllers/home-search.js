
myApp.controller('HomeSearchController', ["$rootScope", "RequestArticlesService", "ArticleManagerService","SEARCH_TYPE", "$sessionStorage","Ping",
  function($rootScope, RequestArticlesService, ArticleManagerService, SEARCH_TYPE, $sessionStorage, Ping) {
    var self = this;
    var searchType = SEARCH_TYPE.abstractSearch;

    self.authors = [];
    self.searchText = "";  // parole cercate nell'abstract
    self.searchTitle = "";  // parole cercate nel titolo
    self.searchAuthor = "";  // autore cercato

    Ping.pingEndpoint();

    // quando si clicca sul bottone 'Search'
    self.keyPressCallBack =function($event) {
        self.searchForArticles()
        $event.preventDefault();
    }

    //todo: da rifattorizzare
    self.searchForArticles = function() {
        RequestArticlesService.setSearchString(self.searchText);  //todo: rivedere a cosa serve

        switch (searchType) {
            case SEARCH_TYPE.abstractSearch:   // abstract
                if (self.searchText) {
                    $sessionStorage.searchQuery = self.searchText;
                    $rootScope.$state.go('app.articles-results', {
                        newSearch: true,                            // � una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        //searchType: SEARCH_TYPE.abstractSearch,     // � una ricerca per abstract
                        abstract: $sessionStorage.searchQuery    // testo dell'abstract search
                    });
                }
                break;
            case SEARCH_TYPE.titleSearch:     // title
                if (self.searchTitle) {
                    $sessionStorage.searchQuery = self.searchTitle;

                    $rootScope.$state.go('app.articles-results', {
                        newSearch: true,                            // � una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        //searchType: SEARCH_TYPE.titleSearch,        // � una ricerca per titolo
                        title: $sessionStorage.searchQuery    // titolo
                    });
                }

                break;
            case SEARCH_TYPE.authorSearch:     // author
                if (self.searchAuthor) {
                    $sessionStorage.searchQuery = self.searchAuthor.n + " " + self.searchAuthor.s;
                    $rootScope.$state.go('app.articles-results', {
                        newSearch: true,                                // � una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        author: $sessionStorage.searchQuery        // nome dell'autore
                    });
                }
                break;
        }
    }

    //todo: da rivedere
    self.switchSearch = function(searchT) {
        switch (searchT) {
            case 0:     // abstract
                searchType = SEARCH_TYPE.abstractSearch;
                break;
            case 1:     // title
                searchType = SEARCH_TYPE.titleSearch;
                break;
            case 2:     // author
                searchType = SEARCH_TYPE.authorSearch;
                break;
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

    //todo: da testare
    //todo: duplicato: vedi filters-manager
    var isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }


}]);
