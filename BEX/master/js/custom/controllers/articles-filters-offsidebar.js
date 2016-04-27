myApp.controller('ArticlesFiltersController', ["ArticlesFiltersManager", "$scope", "$rootScope","FILTERS_TYPE","StatesManagerService", function(ArticlesFiltersManager, $scope, $rootScope, FILTERS_TYPE, StatesManagerService) {

	var self = this;
	var date = new Date();
	self.year = date.getFullYear();


	ArticlesFiltersManager.checkFilters(); //todo: soluzione migliorabile, questo check non dovrebbe essere fatto qui, in teoria
	var activatedFiltersList = ArticlesFiltersManager.getFilterActivatedList();

	self.articleTypes = ArticlesFiltersManager.getArticleTypes();
	self.selectedArticleTypes = ArticlesFiltersManager.getSelectedArticleTypes();
	self.publicationYearF = ArticlesFiltersManager.getStartingPublicationYearF();
	self.publicationYearV = self.publicationYearF.value;


	self.checkType = activatedFiltersList.indexOf(FILTERS_TYPE.Articles_types) != -1;
	self.checkYear = activatedFiltersList.indexOf(FILTERS_TYPE.Articles_afterYear) != -1;

	//todo: rifattorizzare
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		//console.log(StatesManagerService.getStates());
		ArticlesFiltersManager.checkFilters();  //todo: soluzione migliorabile, questo check non dovrebbe essere fatto qui, in teoria
		self.publicationYearV = self.publicationYearF.value;
		/* checkboxes filters*/
		self.checkType = activatedFiltersList.indexOf(FILTERS_TYPE.Articles_types) != -1;
		self.checkYear = activatedFiltersList.indexOf(FILTERS_TYPE.Articles_afterYear) != -1;
		/*===========================*/
	})


	/* funzioni invocate all'interazione con i filtri */



	self.switchYearFilter = function() {
		if (self.checkYear) {
			ArticlesFiltersManager.addActivatedFilter(FILTERS_TYPE.Articles_afterYear);
		} else {
			ArticlesFiltersManager.removeActivatedFilter(FILTERS_TYPE.Articles_afterYear);
		}
		ArticlesFiltersManager.setFilterActivated(self.checkCheckboxes());
	}

	self.switchTypeFilter = function() {
		if (self.checkType) {
			ArticlesFiltersManager.addActivatedFilter(FILTERS_TYPE.Articles_types);
		} else {
			ArticlesFiltersManager.removeActivatedFilter(FILTERS_TYPE.Articles_types);

		}
		ArticlesFiltersManager.setFilterActivated(self.checkCheckboxes());
	}



	self.isInSelectedTypes = function(type) {
		return self.selectedArticleTypes.indexOf(type) != -1
	}



	self.switchType = function(type) {
		ArticlesFiltersManager.switchArticleType(type)
	}




	/* controlla lo stato delle checkboxes: s'è c'è almeno un filtro attivo ritorna true, false altrimenti */
	self.checkCheckboxes = function() {
		if (self.checkYear || self.checkType) {
			//console.log("c'è almeno un filtro impostato");
			return true;
		}
		return false;
	}

	/* applica il filtro per l'anno */
	self.applyYearFilter = function() {
		ArticlesFiltersManager.setStartingPublicationYear(self.publicationYearV);
	}
}]);