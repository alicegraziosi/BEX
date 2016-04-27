myApp.controller('ArticlesOrderbyController', ["CitationsFiltersManagerService","ORDER_BY","ArticlesFiltersManager","$rootScope", function(CitationsFiltersManagerService,ORDER_BY,ArticlesFiltersManager,$rootScope) {
	var self = this;

	ArticlesFiltersManager.checkOrder();

	self.orderByF = ArticlesFiltersManager.getOrderBy();
	self.sortF = ArticlesFiltersManager.getSort();
	self.orderByV = self.orderByF.value;    //ordinamento di default stabilito nel service
	self.sortV = self.sortF.value;          //sort di default stabilito nel service

	//todo: rifattorizzare
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		ArticlesFiltersManager.checkOrder();

		self.orderByV = self.orderByF.value;    //ordinamento di default stabilito nel service
		self.sortV = self.sortF.value;          //sort di default stabilito nel service

	});

	//@guide: valori del ng-value dei radio button: li metto qui (invece di usare value) così posso cambiarli semplicemente
	/* order option vars */
	self.orderOptions = [ORDER_BY.publicationYear, ORDER_BY.title, ORDER_BY.globalCitations];

	self.applySort = function() {
		//console.log("ordinamento: "+self.sortV);
		ArticlesFiltersManager.setSort(self.sortV);
	}

	/* applica l'ordinamento selezionato */
	self.applyOrderBy = function() {
		ArticlesFiltersManager.setOrderBy(self.orderByV);
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
}]);