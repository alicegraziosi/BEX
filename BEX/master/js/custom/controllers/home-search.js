
myApp.controller('HomeSearchController', ["$rootScope", "RequestArticlesService", "ArticleManagerService","SEARCH_TYPE", "$sessionStorage","Ping",
  function($rootScope, RequestArticlesService, ArticleManagerService, SEARCH_TYPE, $sessionStorage, Ping) {
    
    var self = this;

    Ping.selectQueryFile();
    Ping.pingEndpoint();
    Ping.getMaxNumberOfArticles();

    //current dataset
    self.datasetName = $rootScope.datasetName;

    self.authors = [];  // --> $rootScope.authors = [];
    self.venues = []  // --> $rootScope.venues = [];
    
    self.refreshAuthors = function(str) {
        self.authors.length = 0;
        for (key in $rootScope.authors) {
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

    self.refreshVenues = function(str) {
        self.venues.length = 0;
        for (key in $rootScope.venues) {
            if ($rootScope.venues[key].journalTitle.value.toUpperCase().startsWith(str.toUpperCase())) {
                venue = $rootScope.venues[key].journalTitle.value;
                self.venues.push(venue);
            }
        }
    };

    var searchType = "";
    // todo: da rivedere
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
            case 3:     // venue
                searchType = SEARCH_TYPE.venueSearch;
                break;
        }
    }

    self.searchText = "";  // parole cercate nell'abstract
    self.searchTitle = "";  // parole cercate nel titolo
    self.searchAuthor = "";  // autore cercato
    self.searchVenue = "";  // venue cercata

    // quando si clicca sul bottone 'Search'
    self.keyPressCallBack =function($event) {
        self.searchForArticles()
        $event.preventDefault();
    }

    // quando si clicca sul bottone 'Search'
    //todo: da rifattorizzare
    self.searchForArticles = function() {
        RequestArticlesService.setSearchString(self.searchText);  //todo: rivedere a cosa serve
        switch (searchType) {
            case SEARCH_TYPE.abstractSearch:  // abstract
                if (self.searchText) {
                    $sessionStorage.searchQuery = self.searchText;  // searchQuery: sessione
                    // $stateParams:
                    $rootScope.$state.go('app.articles-results', {
                        newSearch: true,  // nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        searchType: SEARCH_TYPE.abstractSearch,  // ricerca per abstract
                        abstract: $sessionStorage.searchQuery  // testo dell'abstract search
                    });
                }
                break;
            case SEARCH_TYPE.titleSearch:  // title
                if (self.searchTitle) {
                    $sessionStorage.searchQuery = self.searchTitle;  // searchQuery: sessione
                    // $stateParams:
                    $rootScope.$state.go('app.articles-results', {
                        newSearch: true,  // una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        searchType: SEARCH_TYPE.titleSearch,  // ricerca per titolo
                        title: $sessionStorage.searchQuery  // parole cercate nel titolo
                    });
                }
                break;
            case SEARCH_TYPE.authorSearch:  // author
                if (self.searchAuthor) {
                    $sessionStorage.searchQuery = self.searchAuthor.n + " " + self.searchAuthor.s;
                    $sessionStorage.authorUri = self.searchAuthor.uri;
                    $rootScope.$state.go('app.author-results', {
                        newSearch: true,  // una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        searchType: SEARCH_TYPE.authorSearch,  // ricerca per autore
                        author: $sessionStorage.searchQuery,  // nome e cognome dell'autore
                        authorName: self.searchAuthor.n,  // nome 
                        authorSurname: self.searchAuthor.s,  // cognome
                        authorUri: $sessionStorage.authorUri  // uri dell'autore
                    });
                }
                break;
            case SEARCH_TYPE.venueSearch:  // venue
                if (self.searchVenue) {
                    $sessionStorage.searchQuery = self.searchVenue;
                    $rootScope.$state.go('app.articles-results', {
                        newSearch: true,  // una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        searchType: SEARCH_TYPE.venueSearch,  // ricerca per venue
                        venue: $sessionStorage.searchQuery  // nome della venue
                    });
                }
            break;

        }
    }

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