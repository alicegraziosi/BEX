myApp.controller('CitationsOrderbyController', ["CitationsFiltersManagerService","ORDER_BY","$rootScope", function(CitationsFiltersManagerService,ORDER_BY,$rootScope) {
    var self = this;

    CitationsFiltersManagerService.checkOrder();

    self.orderByF = CitationsFiltersManagerService.getOrderBy();
    self.sortF = CitationsFiltersManagerService.getSort();

    self.orderByV = self.orderByF.value;    //ordinamento di default stabilito nel service
    self.sortV = self.sortF.value;          //sort di default stabilito nel service

    //todo: rifattorizzare
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        CitationsFiltersManagerService.checkOrder();

        self.orderByV = self.orderByF.value;    //ordinamento di default stabilito nel service
        self.sortV = self.sortF.value;          //sort di default stabilito nel service

    });

	//@guide: valori del ng-value dei radio button: li metto qui (invece di usare value) così posso cambiarli semplicemente
    /* order option vars */
    self.orderOptions = [ORDER_BY.publicationYear, ORDER_BY.title, ORDER_BY.globalCitations, ORDER_BY.totCitActs];

	self.applySort = function() {
        //console.log("ordinamento: "+self.sortV);
        CitationsFiltersManagerService.setSort(self.sortV);
    }

    /* applica l'ordinamento selezionato */
    self.applyOrderBy = function() {
        CitationsFiltersManagerService.setOrderBy(self.orderByV);
    }

    self.toOptionName = function(option) {
        switch (option) {
            case ORDER_BY.publicationYear:
                return "Publication year";
            case ORDER_BY.title:
                return "Title";
            case ORDER_BY.globalCitations:
                return "Global citations";
            case ORDER_BY.totCitActs:
                return "Citations by the article (only references)";
        }

    }
}]);