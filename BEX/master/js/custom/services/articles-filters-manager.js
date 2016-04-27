/**
 * module: ArticlesFiltersManager.js
 * */
'use strict';

myApp.factory('ArticlesFiltersManager',["ORDER_BY","SORT","ARTICLE_TYPES","FILTERS_TYPE","$stateParams","$location","StatesManagerService","$rootScope", function(ORDER_BY, SORT, ARTICLE_TYPES, FILTERS_TYPE, $stateParams,$location,StatesManagerService, $rootScope) {
	var self = this;
	var filterActivatedBool = { value: false}               //true se c'è almeno un filtro attivo, false altrimenti
	var activatedFilters = [];                              //lista dei filtri attivati
	var defaultYear = 1950;

	/* vars order by */
	var defaultOrderByValue = ORDER_BY.publicationYear;     // l'ordinamento di default è per anno di pubblicazione
	var defaultSort = SORT.desc;                                 // true-> decrescente, false->crescente

	var orderBy = { value: defaultOrderByValue};            // angular.copy(defaultOrderBy, orderBy); orderBy inzializzato al default; deep copy, non assegnazione per riferimento
	var sort = { value: defaultSort};


	/* vars filters */
	var articleTypes = [ARTICLE_TYPES.JournalArticle,ARTICLE_TYPES.JournalReviewArticle, ARTICLE_TYPES.JournalEditorial, ARTICLE_TYPES.ConferencePaper, ARTICLE_TYPES.Letter, ARTICLE_TYPES.Article];
	var selectedArticleTypes = [ARTICLE_TYPES.Article,ARTICLE_TYPES.JournalArticle,ARTICLE_TYPES.JournalReviewArticle, ARTICLE_TYPES.JournalEditorial, ARTICLE_TYPES.Letter, ARTICLE_TYPES.ConferencePaper];

	var startingPublicationYear =  { value: defaultYear};

	var restoreDefaultFilters = function() {
		filterActivatedBool.value = false;
		activatedFilters.length = 0;
		orderBy.value = defaultOrderByValue;
		sort.value = defaultSort;
		startingPublicationYear.value = defaultYear;
		selectedArticleTypes.length = 0;
		for (var key in articleTypes) {
			selectedArticleTypes.push(articleTypes[key]);
		}
	}

	var checkOrderBy = function(){
		if ($stateParams.orderBy && legalOrderByParam($stateParams.orderBy)) {
			orderBy.value = $stateParams.orderBy;
		} else if ($stateParams.orderBy && !legalOrderByParam($stateParams.orderBy)) {
			console.error("Invalid 'orderBy' parameter");
		}
	};

	var checkSort = function(){
		if ($stateParams.sort && legalSortParam($stateParams.sort)) {
			sort.value = SORT[$stateParams.sort];
		} else if ($stateParams.sort && !legalSortParam($stateParams.sort)) {
			console.error("Invalid 'sort' parameter");
		}
	};

	var checkYearFilter = function(){
		if ($stateParams[FILTERS_TYPE.Articles_afterYear] && legalAfterYearParam($stateParams[FILTERS_TYPE.Articles_afterYear])) {
			filterActivatedBool.value = true;
			activatedFilters.push(FILTERS_TYPE.Articles_afterYear);
			startingPublicationYear.value = parseInt($stateParams[FILTERS_TYPE.Articles_afterYear]);
		} else if ($stateParams[FILTERS_TYPE.Articles_afterYear] && !legalAfterYearParam($stateParams[FILTERS_TYPE.Articles_afterYear])){
			console.error("Invalid 'afterYear' parameter");
		}
	};

	var checkArticleTypes = function(){
		if ($stateParams[FILTERS_TYPE.Articles_types] && legalTypes($stateParams[FILTERS_TYPE.Articles_types])) {
			filterActivatedBool.value = true;
			activatedFilters.push(FILTERS_TYPE.Articles_types);
			var types = $stateParams.type.split($rootScope.paramsTokensDelimiter);
			selectedArticleTypes.length = 0;
			for (var key in types) {
				selectedArticleTypes.push(types[key]);
			}
		} else if ($stateParams[FILTERS_TYPE.Articles_types] && !legalTypes($stateParams[FILTERS_TYPE.Articles_types])){
			console.error("Invalid 'type' parameter");
		}
	};

	/* aggiorna il parametro nell'url e nello state*/
	var updateStateParam = function(key, value) {
		$location.search(key,value);
		StatesManagerService.updateCurrentStateParam(key,value);
	}

	function legalOrderByParam(param) {
		for (var key in ORDER_BY) {
			if (ORDER_BY[key] == param) {
				return true;
			}
		}
		return false;
	}

	function legalSortParam(param) {
		for (var key in SORT) {
			if (key == param) {
				return true;
			}
		}
		return false;
	}

	function legalAfterYearParam(param) {
		return !isNaN(parseInt(param)) && parseInt(param) >= 1950 && parseInt(param) <= (new Date()).getFullYear();
	}

	function legalTypes(param) {
		var types = param.split($rootScope.paramsTokensDelimiter);
		for (var x in types) {
			var found = false;
			for (var y in ARTICLE_TYPES ) {
				if (ARTICLE_TYPES[y] == types[x]) {
					found = true;
					break;
				}
			}
			if (!found) {
				return false;
			}
		}
		return true;
	}

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		restoreDefaultFilters();
		//console.log("------------state change start------------","\ntoParams: ",toParams,"\nfromParams: ",fromParams)
	})

	//$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
	//	//console.log("------------state change success------------\n",event, toState, toParams, fromState, fromParams)
	//	checkFilters();
	//	//console.log(filterActivatedBool,activatedFilters,orderBy,sort,startingPublicationYear,selectedArticleTypes);
	//})

	return {
		getOrderBy: function() {
			return orderBy;
		},

		getSort: function() {
			return sort;
		},

		setOrderBy: function(newOrderBy) {
			orderBy.value = newOrderBy;
			updateStateParam("orderBy",newOrderBy);
		},

		setSort: function(newSort) {
			sort.value = newSort;
			for (var key in SORT) {
				if (SORT[key] == newSort) {
					updateStateParam("sort",key);
				}
			}
		},

		getArticleTypes: function() {
			return articleTypes;
		},

		getSelectedArticleTypes: function() {
			return selectedArticleTypes;
		},

		switchArticleType: function(type) {
			var index = selectedArticleTypes.indexOf(type)
			if (index == -1) {
				selectedArticleTypes.push(type)
			} else {
				selectedArticleTypes.splice(index,1);
			}

			updateStateParam(FILTERS_TYPE.Articles_types, selectedArticleTypes.join($rootScope.paramsTokensDelimiter));
		},

		getStartingPublicationYearF: function() {
			return startingPublicationYear;
		},

		setStartingPublicationYear: function(newStartingYear) {
			startingPublicationYear.value = newStartingYear;
			updateStateParam(FILTERS_TYPE.Articles_afterYear, newStartingYear);

		},

		setFilterActivated: function(newFilterActivated) {
			filterActivatedBool.value = newFilterActivated;
		},

		getFilterActivatedBool: function() {
			return filterActivatedBool;
		},

		addActivatedFilter: function(fil) {
			activatedFilters.push(fil)
		},

		removeActivatedFilter: function(fil) {
			activatedFilters.splice(activatedFilters.indexOf(fil),1);
			StatesManagerService.updateCurrentStateParam(fil,undefined);
			$location.search(fil,null);
			switch(fil) {
				case FILTERS_TYPE.Articles_types:
					selectedArticleTypes.length = 0;
					selectedArticleTypes.push.apply(selectedArticleTypes,articleTypes);
					//StatesManagerService.updateCurrentStateParam(fil,selectedArticleTypes.join($rootScope.paramsTokensDelimiter));
					break;
				case FILTERS_TYPE.Articles_afterYear:
					startingPublicationYear.value = defaultYear;
					//StatesManagerService.updateCurrentStateParam(fil,defaultYear);
					//console.log("filtro anno disattivato")
					break;
			}
		},

		getFilterActivatedList: function() {
			return activatedFilters;
		},

		checkFilters: function() {
			checkYearFilter();
			checkArticleTypes();
		},

		checkOrder: function() {
			checkOrderBy();
			checkSort();
		}

	}
}]);