myApp.controller('ArticlesResultsController', ["$rootScope", "ngDialog", "ArticleManagerService", "CitationsFiltersManagerService",
    "RequestArticlesService", "$scope", "$timeout", "$stateParams", "SEARCH_TYPE","$sessionStorage","BookmarksManagerService","ORDER_BY",
    "ArticlesFiltersManager","StatesManagerService", "PagerService", 
    function($rootScope, ngDialog, ArticleManagerService, CitationsFiltersManagerService, RequestArticlesService, $scope, $timeout, 
        $stateParams, SEARCH_TYPE, $sessionStorage, BookmarksManagerService, ORDER_BY, ArticlesFiltersManager, StatesManagerService, PagerService) {
    
    var self = this;
    var date = new Date();

    self.articles = ArticleManagerService.getArticles();
    self.pager = {};
    self.setPage = setPage;
    self.authors = [];
    self.items = [];
 
    function initController() {
        // initialize to page 1
        setPage(1);
    }
 
    function setPage(page) {
        if (page < 1 || page > self.pager.totalPages) {
            return;
        }
 
        // get pager object from service
        self.pager = PagerService.GetPager(self.articles.length, page);
 
        // get current page of items
        self.items = self.articles.slice(self.pager.startIndex, self.pager.endIndex);
    }


	$rootScope.showRefiningOptions.value = true;

    self.$storage = $sessionStorage;
	self.year = date.getFullYear();
	self.selectedArticleTypes = ArticlesFiltersManager.getSelectedArticleTypes();
	self.activatedFilters = ArticlesFiltersManager.getFilterActivatedList();
	self.activatedFiltersBool = ArticlesFiltersManager.getFilterActivatedBool();

	if (!$stateParams.noReload) {
		switch ($stateParams.searchType) {
			case SEARCH_TYPE.abstractSearch:
				ArticleManagerService.getArticlesByAbstract($stateParams.searchQuery, $stateParams.newSearch);
				break;
			case SEARCH_TYPE.titleSearch:
				ArticleManagerService.getArticlesByTitle($stateParams.searchQuery, $stateParams.newSearch);
				break;
			case SEARCH_TYPE.authorSearch:
				ArticleManagerService.getArticlesByFullNameAuthor($stateParams.searchQuery, $stateParams.newSearch);
				break;
			case SEARCH_TYPE.singleArticleDoi:
				ArticleManagerService.getSingleArticleByDoi(decodeURIComponent($stateParams.doi), decodeURIComponent($stateParams.title));
				break;
			case SEARCH_TYPE.list:
				ArticleManagerService.getArticlesFromList(decodeURIComponent($stateParams.searchQuery), $stateParams.newSearch);
				break;
		}
	}

    self.resultsStates = ArticleManagerService.getResultsStates();

	/* order option vars */
	self.publicationYear = ORDER_BY.publicationYear;
	self.title = ORDER_BY.title;
	self.globalCitations = ORDER_BY.globalCitations;
	self.totCitActs = ORDER_BY.totCitActs;

	/* citations filters */
    //todo: aggiungere prefisso "citations"
    self.publicationYearFil =  CitationsFiltersManagerService.getStartingPublicationYearF();  // prende il filtro dell'anno da applicare agli articoli mostrati nella view
    self.selfcitationsFil = CitationsFiltersManagerService.getSelfCitationsF();  // prende il filtro per le autocitazioni
    self.characterizationsFil = CitationsFiltersManagerService.getCharacterizationsF();  // prende il filtro per i colori
    self.authorsFil = CitationsFiltersManagerService.getAuthorsF();  // prende il filtro per gli autori
	self.orderByFil = CitationsFiltersManagerService.getOrderBy();  // prende l'ordinamento da applicare alla bibliografia
	self.sortFil = CitationsFiltersManagerService.getSort();  // prende il sort da applicare alla bibliografia

	/* articles results filters */
	self.articlesOrderByFil = ArticlesFiltersManager.getOrderBy();
	self.articlesSortByFil = ArticlesFiltersManager.getSort();
	self.articlesPublicationYearFil =  ArticlesFiltersManager.getStartingPublicationYearF();


    self.isRequestPending = RequestArticlesService.isRequestPending();  // I -> è in corso la richiesta all'abstractFinder?
    self.isRetrievingArticlesInfo = ArticleManagerService.isRetrievingArticlesInfo();  // II -> è in corso la richiesta delle info sugli articoli? (questa richiesta parte solo all'arrivo della risposta della richiesta I)
    self.articlesNum = {value: self.articles.length};  // numero di articoli (risultati di ricerca)
    self.completedArticles = {value: 0};  // numero di articoli completati ( = le cui info generiche sono disponibili
    self.completedPercent = {value: 0};
    self.currentState = "Results";

	var requestPendingDialog;
    // se non si stanno richiedendo info e non ci sono articoli da mostrare (di una precedente ricerca) 
    // allora mostra un dialog di avviso
    if (!self.isRequestPending && self.articles.length == 0) {
         ngDialog.open({
            template: "app/templates/dialog-empty-results.html",
            controller: ["$rootScope", "$scope", function($rootScope, $scope) {
                $scope.goToHomeSearch = function() {
                    $rootScope.$state.go('app.home-search');
                    ngDialog.close();
                }
            }]
        });
    }

    self.getSearchText = function() {
        return RequestArticlesService.getSearchString();
    }

    self.toOptionName = function(option) {
        switch (option) {
            case ORDER_BY.publicationYear:
                return "Publication year";
            case ORDER_BY.title:
                return "Title";
            case ORDER_BY.globalCitations:
                return "Global citations";
        }

    }

    //@guide http://stackoverflow.com/questions/15380140/service-variable-not-updating-in-controller
    //@guide http://stsc3000.github.io/blog/2013/10/26/a-tale-of-frankenstein-and-binding-to-service-values-in-angular-dot-js/
    $scope.$watchCollection(function() { return self.articles},
        function() {
            //console.log('ARTICOLI AGGIORNATI');
            self.articlesNum.value = ArticleManagerService.getArticlesNum(); //aggiorno il numero degli articoli
            //todo: implementazione da raffinare
        }, true); //todo:valutare se lasciare questo true

    //@guide: per essere aggiornato sullo stato delle richieste
    $scope.$watch(RequestArticlesService.isRequestPending,
        function() {
            self.isRequestPending = RequestArticlesService.isRequestPending();
            // se c'è una richiesta in sospeso visualizzo la dialog
            if (self.isRequestPending) {
                //console.log("1.1 - PENDING REQUEST");
                requestPendingDialog = ngDialog.open({
                    template: "app/templates/dialog-retrieving-results.html",
                    closeByEscape: false,
                    showClose: false,
                    closeByDocument: false
                });
            } else {
                //console.log("1.2 - REQUEST NOT PENDING");
                self.articlesNum.value = ArticleManagerService.getArticlesNum();
                if (requestPendingDialog) {
                    $timeout(requestPendingDialog.close, 1300)  //uso timeout per risolvere un problema di ngDialog (e anche per non flashare l'utente)
                }

                //se dall'abs finder non ci sono risultati mostro una notifica
                if (ArticleManagerService.getArticlesResultsState() == self.resultsStates.NO_RESULTS) {
                    self.articlesNum.value = 0;
                    ngDialog.open({
                        template: "app/templates/dialog-no-results.html"
                    });
                }

                //todo: per adesso non mi viene una soluzione migliore
                //se dall'abs finder ci sono risultati
                if (ArticleManagerService.getArticlesResultsState() == self.resultsStates.RESULTS) {
                    self.articlesNum.value = ArticleManagerService.getArticlesNum()
                }

            }
        });

    //@guide: per essere aggiornato sullo stato della richiesta delle info a fuseki
    $scope.$watch(ArticleManagerService.isRetrievingArticlesInfo,
        function() {
            self.isRetrievingArticlesInfo = ArticleManagerService.isRetrievingArticlesInfo();
            self.articlesNum.value = ArticleManagerService.getArticlesNum(); //aggiorno il numero degli articoli
            if (self.isRetrievingArticlesInfo) {
               // console.log("2.1 - RETRIEVING ARTICLES INFO");
            } else {
               // console.log("2.3 - ARTICLES INFO RETRIEVED");
            }
        });

    //@guide: per essere aggiornato sul numero di articoli completati ( = le cui info generiche sono disponibili)
    $scope.$watch(ArticleManagerService.getCompletedArticles,
        function() {
            self.completedArticles.value = ArticleManagerService.getCompletedArticles();
            self.completedPercent.value = ( self.completedArticles.value / self.articlesNum.value) * 100;
            //console.log("2.2 - completed articles: "+ self.completedArticles.value);
            if(self.completedArticles.value === self.articlesNum.value &&  self.articlesNum.value > 0){
                // se sono stati caricati tutti i dettagli di tutti gli articoli
                // allora costruzione della paginazione
                initController();
            }
        });

    self.logResults = function() {
        //console.log($stateParams);
        console.log(ArticleManagerService.getArticles());
    }

    self.logStates = function() {
        console.log(StatesManagerService.getStates());
    }
}]);
