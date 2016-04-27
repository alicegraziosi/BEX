/**=========================================================
 * module: filters-manager.js
 * servizio per gestire i valori dei filtri impostati per le citazioni.
 * una collezione di variabili accedibili con getters e setters,
 * per permettere ad article-results (legge i filtri) e filter-offsidebar (imposta i filtri) di comunicare.
 =========================================================*/
'use strict';

myApp
    .factory('CitationsFiltersManagerService', ["ArticlesInfoService", "$stateParams", '$location', "ORDER_BY", "StatesManagerService", "$rootScope", "SORT", "FILTERS_TYPE", function(ArticlesInfoService, $stateParams, $location, ORDER_BY, StatesManagerService, $rootScope, SORT, FILTERS_TYPE) {
        var filterActivatedBool = { value: false}               //true se c'è almeno un filtro attivo, false altrimenti
		var activatedFilters = [];
		var defaultYear = 1950;
		var functionsUriPrefix = "http://purl.org/spar/cito/"

        /* default vars filtri */
        var startingPublicationYear =  { value: defaultYear};         // anno di partenza per filtri. è un oggetto perchè sto valutando di aggiungere altre property e perchè lo trovo più conveniente
        var selfcitations = { value: false, exclude:true};            // inizialmente mostro tutte le citazioni e quando il filtro viene attivato, di default vengono escluse le autocitazioni
        var characterizationsList = [
				"citesForInformation",
				"citesAsMetadataDocument",
				"citesAsDataSource",
				"citesAsAuthority",
				"obtainsSupportFrom",
				"includesExcerptFrom",
				"confirms",
				"containsAssertionFrom",
				"derides",
				"includesQuotationFrom",
				"citesAsRelated",
				"usesMethodIn",
				"documents",
				"describes",
				"usesConclusionsFrom",
				"repliesTo",
				"qualifies",
				"corrects",
				"agreesWith",
				"citesAsEvidence",
				"usesDataFrom",
				"parodies",
				"critiques",
				"compiles",
				"speculatesOn",
				"extends",
				"citesAsSourceDocument",
				"updates",
				"discusses",
				"citesAsPotentialSolution",
				"obtainsBackgroundFrom",
				"reviews",
				"supports",
				"citesAsRecommendedReading",
				"credits",
				"disagreesWith",
				"plagiarizes"
			];
		var excludedFunctions = [];
		var functions = angular.copy(characterizationsList);
		var characterizations = {
			value: {}
		};


		//todo: non è la soluzione più elegante per costruire dinamicamente l'oggetto
		for (var key in characterizationsList) {
			characterizations.value[functionsUriPrefix+characterizationsList[key]] = {};
			characterizations.value[functionsUriPrefix+characterizationsList[key]].toString  = characterizationsList[key];
			characterizations.value[functionsUriPrefix+characterizationsList[key]].valueURI = functionsUriPrefix+characterizationsList[key];
			characterizations.value[functionsUriPrefix+characterizationsList[key]].checked = true;
		}
        //var characterizationsOLD = { value:
        //    {
        //        "http://purl.org/spar/cito/citesForInformation": {
        //            toString: "cites For Information",
        //            valueURI: "http://purl.org/spar/cito/citesForInformation",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsMetadataDocument": {
        //            toString: "cites As Metadata Document",
        //            valueURI: "http://purl.org/spar/cito/citesAsMetadataDocument",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsDataSource": {
        //            toString: "cites As Data Source",
        //            valueURI: "http://purl.org/spar/cito/citesAsDataSource",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsAuthority": {
        //            toString: "cites As Authority",
        //            valueURI: "http://purl.org/spar/cito/citesAsAuthority",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/obtainsSupportFrom": {
        //            toString: "obtains Support From",
        //            valueURI: "http://purl.org/spar/cito/obtainsSupportFrom",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/includesExcerptFrom": {
        //            toString: "includes Excerpt From",
        //            valueURI: "http://purl.org/spar/cito/includesExcerptFrom",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/confirms": {
        //            toString: "confirms",
        //            valueURI: "http://purl.org/spar/cito/confirms",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/containsAssertionFrom": {
        //            toString: "contains Assertion From",
        //            valueURI: "http://purl.org/spar/cito/containsAssertionFrom",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/derides": {
        //            toString: "derides",
        //            valueURI: "http://purl.org/spar/cito/derides",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/includesQuotationFrom": {
        //            toString: "includes Quotation From",
        //            valueURI: "http://purl.org/spar/cito/includesQuotationFrom",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsRelated": {
        //            toString: "cites As Related",
        //            valueURI: "http://purl.org/spar/cito/citesAsRelated",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/usesMethodIn": {
        //            toString: "uses Method In",
        //            valueURI: "http://purl.org/spar/cito/usesMethodIn",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/documents": {
        //            toString: "documents",
        //            valueURI: "http://purl.org/spar/cito/documents",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/describes": {
        //            toString: "describes",
        //            valueURI: "http://purl.org/spar/cito/describes",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/usesConclusionsFrom": {
        //            toString: "uses Conclusions From",
        //            valueURI: "http://purl.org/spar/cito/usesConclusionsFrom",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/repliesTo": {
        //            toString: "replies To",
        //            valueURI: "http://purl.org/spar/cito/repliesTo",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/qualifies": {
        //            toString: "qualifies",
        //            valueURI: "http://purl.org/spar/cito/qualifies",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/corrects": {
        //            toString: "corrects",
        //            valueURI: "http://purl.org/spar/cito/corrects",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/agreesWith": {
        //            toString: "agrees With",
        //            valueURI: "http://purl.org/spar/cito/agreesWith",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsEvidence": {
        //            toString: "cites As Evidence",
        //            valueURI: "http://purl.org/spar/cito/citesAsEvidence",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/usesDataFrom": {
        //            toString: "uses Data From",
        //            valueURI: "http://purl.org/spar/cito/usesDataFrom",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/parodies": {
        //            toString: "parodies",
        //            valueURI: "http://purl.org/spar/cito/parodies",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/critiques": {
        //            toString: "critiques",
        //            valueURI: "http://purl.org/spar/cito/critiques",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/compiles": {
        //            toString: "compiles",
        //            valueURI: "http://purl.org/spar/cito/compiles",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/speculatesOn": {
        //            toString: "speculates On",
        //            valueURI: "http://purl.org/spar/cito/speculatesOn",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/extends": {
        //            toString: "extends",
        //            valueURI: "http://purl.org/spar/cito/extends",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsSourceDocument": {
        //            toString: "cites As Source Document",
        //            valueURI: "http://purl.org/spar/cito/citesAsSourceDocument",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/updates": {
        //            toString: "updates",
        //            valueURI: "http://purl.org/spar/cito/updates",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/discusses": {
        //            toString: "discusses",
        //            valueURI: "http://purl.org/spar/cito/discusses",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsPotentialSolution": {
        //            toString: "cites As Potential Solution",
        //            valueURI: "http://purl.org/spar/cito/citesAsPotentialSolution",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/obtainsBackgroundFrom": {
        //            toString: "obtains Background From",
        //            valueURI: "http://purl.org/spar/cito/obtainsBackgroundFrom",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/reviews": {
        //            toString: "reviews",
        //            valueURI: "http://purl.org/spar/cito/reviews",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/supports": {
        //            toString: "supports",
        //            valueURI: "http://purl.org/spar/cito/supports",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/citesAsRecommendedReading": {
        //            toString: "cites As Recommended Reading",
        //            valueURI: "http://purl.org/spar/cito/citesAsRecommendedReading",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/credits": {
        //            toString: "credits",
        //            valueURI: "http://purl.org/spar/cito/credits",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/disagreesWith": {
        //            toString: "disagrees With",
        //            valueURI: "http://purl.org/spar/cito/disagreesWith",
        //            checked: true
        //        },
        //        "http://purl.org/spar/cito/plagiarizes": {
        //            toString: "plagiarizes",
        //            valueURI: "http://purl.org/spar/cito/plagiarizes",
        //            checked: true
        //        }
        //    }
        //};                      //todo: richiederlo in modo dinamico come con gli autori

		var authors = {value: [], enabled:false}            // lista degli autori per il filtro autori, di default non ce n'è nessuno (non ci posso mettere 930 autori!)...con enabled si decide se (in biblioFilters) gli items devono essere filtrati
        var allAuthors = { value: [] };                //tutti gli autori

        /* vars order by */
        var defaultOrderByValue = ORDER_BY.publicationYear;    // l'ordinamento di default è per anno di pubblicazione
        var defaultSort = true;                      // true-> decrescente, false->crescente
        var orderBy = { value: defaultOrderByValue};    // angular.copy(defaultOrderBy, orderBy); orderBy inzializzato al default; deep copy, non assegnazione per riferimento
        var sort = { value: defaultSort};

		var restoreDefaultFilters = function() {
			filterActivatedBool.value = false;
			activatedFilters.length = 0;
			//order
			orderBy.value = defaultOrderByValue;
			sort.value = defaultSort;
			//year
			startingPublicationYear.value = defaultYear;
			//selfcitation
			selfcitations.value = false;
			selfcitations.exclude = true;
			//authors
			authors.value.length = 0;
			authors.enabled = false;
			//functions

            //todo: da completare con gli altri filtri sulle citazioni
		}

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

        var checkOrderBy = function(){
            if ($stateParams.orderCitBy && legalOrderByParam($stateParams.orderCitBy)) {
                orderBy.value = $stateParams.orderCitBy;
            } else if ($stateParams.orderCitBy && !legalOrderByParam($stateParams.orderCitBy)) {
                console.error("Invalid 'orderCitBy' parameter");
            }
        };

		var checkSort = function(){
			if ($stateParams.sortCit && legalSortParam($stateParams.sortCit)) {
				sort.value = SORT[$stateParams.sortCit];
			} else if ($stateParams.sortCit && !legalSortParam($stateParams.sortCit)) {
				console.error("Invalid 'sortCit' parameter");
			}
		};

		var checkYearFilter = function(){
			if ($stateParams[FILTERS_TYPE.Citations_afterYear] && legalAfterYearParam($stateParams[FILTERS_TYPE.Citations_afterYear])) {
				filterActivatedBool.value = true;
				activatedFilters.push(FILTERS_TYPE.Citations_afterYear);
				startingPublicationYear.value = parseInt($stateParams[FILTERS_TYPE.Citations_afterYear]);
			} else if ($stateParams[FILTERS_TYPE.Citations_afterYear] && !legalAfterYearParam($stateParams[FILTERS_TYPE.Citations_afterYear])){
				console.error("Invalid 'citAfterYear' parameter");
			}
		};

		var checkSelfCitationsFilter = function() {
			if ($stateParams[FILTERS_TYPE.Citations_selfCitations] && legalSelfCitParam($stateParams[FILTERS_TYPE.Citations_selfCitations])) {
				filterActivatedBool.value = true;
				activatedFilters.push(FILTERS_TYPE.Citations_selfCitations);
				selfcitations.value = true;
				selfcitations.exclude = $stateParams[FILTERS_TYPE.Citations_selfCitations] == "exclude"? true:false;
			} else if ($stateParams[FILTERS_TYPE.Citations_selfCitations] && !legalSelfCitParam($stateParams[FILTERS_TYPE.Citations_selfCitations])) {
				console.error("Invalid 'selfCitations' parameter");
			}
		}

		var checkAuthorsFilter = function() {
			if ($stateParams[FILTERS_TYPE.Citations_authors] && legalAuthorsParam($stateParams[FILTERS_TYPE.Citations_authors])) {
				filterActivatedBool.value = true;
				activatedFilters.push(FILTERS_TYPE.Citations_authors);
				var authorsParam = $stateParams.citAuthors.split($rootScope.paramsTokensDelimiter);
				for (var key in authorsParam) {
					authorsParam[key] = toTitleCase(authorsParam[key]);
				}
				authors.enabled = true;
				authors.value = authorsParam;
			} else if ($stateParams[FILTERS_TYPE.Citations_authors] && !legalAuthorsParam($stateParams[FILTERS_TYPE.Citations_authors])) {
				console.error("Invalid 'citAuthors' parameter");
			}
		}

		var checkFunctionsExcludedFilter = function() {
			if ($stateParams[FILTERS_TYPE.Citations_functions_exclude] && legalFunctionsParam($stateParams[FILTERS_TYPE.Citations_functions_exclude])) {
				filterActivatedBool.value = true;
				activatedFilters.push(FILTERS_TYPE.Citations_functions_exclude);
				excludedFunctions = $stateParams.citFunctionsExclude.split($rootScope.paramsTokensDelimiter);
				for (var key in excludedFunctions) {
					characterizations.value[functionsUriPrefix+excludedFunctions[key]].checked = false;
				}
			} else if ($stateParams[FILTERS_TYPE.Citations_functions_exclude] && !legalFunctionsParam($stateParams[FILTERS_TYPE.Citations_functions_exclude])) {
				console.error("Invalid 'citFunctionsExclude' parameter");
			}
		}

		var checkFunctionsFilter = function() {
			if ($stateParams[FILTERS_TYPE.Citations_functions] && legalFunctionsParam($stateParams[FILTERS_TYPE.Citations_functions])) {
				filterActivatedBool.value = true;
				activatedFilters.push(FILTERS_TYPE.Citations_functions);
				functions = $stateParams.citFunctions.split($rootScope.paramsTokensDelimiter);
				for (var key in characterizations.value) { //prima li devo disattivare tutti
					characterizations.value[key].checked = false;
				}
				for (var key in functions) {
					//characterizations.value[functionsUriPrefix+functions[key]].checked = false;
					characterizations.value[functionsUriPrefix+functions[key]].checked = true;
				}
			} else if ($stateParams[FILTERS_TYPE.Citations_functions] && !legalFunctionsParam($stateParams[FILTERS_TYPE.Citations_functions])) {
				console.error("Invalid 'citFunctions' parameter");
			}
		}

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

		function legalSelfCitParam(param) {
			return param == "exclude" || param == "isolate";
		}

		function legalAuthorsParam(param) {
			//todo: da completare
			return true;
		}

		function legalFunctionsParam(param) {
			var functions = param.split($rootScope.paramsTokensDelimiter);
			for (var x in functions) {
				var found = false;
				for (var y in characterizationsList) {
					if (characterizationsList[y] == functions[x]) {
						found = true;
						break;
					}
				}
				if (!found) {
					return false;
				}
			}
			//todo: da completare
			return true;
		}

		function toTitleCase(str)
		{
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}



		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			restoreDefaultFilters();
			//console.log("------------state change start------------","\ntoParams: ",toParams,"\nfromParams: ",fromParams)
		})

        return {
            /* getters e setters per i filtri */
            getFilterActivatedBool: function() {
                return filterActivatedBool;
            },

            setFilterActivated: function(newFilterActivated) {
                filterActivatedBool.value = newFilterActivated;
            },

            getStartingPublicationYearF: function() {
                return startingPublicationYear;
            },

            setStartingPublicationYear: function(newStartingYear) {
                startingPublicationYear.value = newStartingYear;
	            updateStateParam(FILTERS_TYPE.Citations_afterYear, newStartingYear);
            },

            // per la lista degli autori filtrati
            getAuthorsF: function() {

                return authors;
            },

            // per impostare la lista degli autori filtrati
            setAuthors: function(newAuthors) {

                authors.value = newAuthors;
	            updateStateParam(FILTERS_TYPE.Citations_authors, authors.value.join($rootScope.paramsTokensDelimiter));
                //console.log(authors.value);
            },

            setAuthorsEnabled: function(newAuthorsEnabled) {
                authors.enabled = newAuthorsEnabled;
	            if (authors.enabled) {
		            updateStateParam(FILTERS_TYPE.Citations_authors, authors.value.join($rootScope.paramsTokensDelimiter));
	            } else {
		            authors.value.length = 0;
	            }
                //console.log(authors.value);
            },

            //questo è per ottenre tutti gli autori (usato nel typeahead
            //todo: probabilmente da eliminare, ora tutti gli autori sono aggiunti nel rootscope in HomeSearchController
            getAllArticlesAuthors: function() {
                if (isEmpty(allAuthors.value)) {
                    ArticlesInfoService.getAllAuthors().then(
                        function (response) {
                            var authorsFullName = response.data.results.bindings;

                            for (var i in authorsFullName) {
                                allAuthors.value.push(authorsFullName[i].fullName.value);
                            }
                        },
                        //todo caso da gestire meglio
                        function (errResponse) {
                            //ngDialog.open({template: "app/templates/dialog-error.html"});
                            console.error("Error while fetching authors. " + errResponse.status + ": " + errResponse.statusText)
                        }
                    );
                }

                return allAuthors; //non è un problema questo return, è un riferimento
            },

            //da invocare quando che si effettua il drilldown per avere dettagli su un articolo (e quindi anche i dettagli bibliografici)
            //@guide aggiunge un autore alla lista di autori per il filtro
            //addAuthor: function(newAuthor) {
            //
            //    var existing = false // impostato a true se in articlesAuthors c'è già l'autore che si sta cercando di aggiungere ( newAuthors[i] )
            //    for (var j in articlesAuthors) {
            //        if (newAuthor == articlesAuthors.value[j]) {
            //            existing = true;
            //            break;
            //        }
            //    }
            //
            //    if (!existing) {
            //        articlesAuthors.value[newAuthor] = {checked: true};
            //    }
            //},



            getSelfCitationsF: function() {
                return selfcitations;
            },

            setSelfCitations: function(newSelfcitations, newExclude) {
                selfcitations.value = newSelfcitations;
                selfcitations.exclude = newExclude;
	            if ( selfcitations.value ) {
		            updateStateParam(FILTERS_TYPE.Citations_selfCitations, newExclude?"exclude":"isolate");
	            }

            },

            getCharacterizationsF: function() {
                return characterizations;
            },

            setCharacterizations: function(newCharacterizations) {
                characterizations.value = newCharacterizations;
	            updateStateParam(FILTERS_TYPE.Citations_functions,functions.join($rootScope.paramsTokensDelimiter))
            },

	        switchColorChecked: function(color) {
		        //if (!color.checked) {
			     //   excludedFunctions.push(color.toString);
		        //} else {
			     //   var i = excludedFunctions.indexOf(color.toString);
			     //   if (i != -1) {
				 //       excludedFunctions.splice(i,1);
			     //   }
		        //}

		        //updateStateParam(FILTERS_TYPE.Citations_functions_exclude,excludedFunctions.join($rootScope.paramsTokensDelimiter))
		        if (!color.checked) {
			        var i = functions.indexOf(color.toString);
			        if (i != -1) {
				        functions.splice(i,1);
			        }
		        } else {
			        functions.push(color.toString);
		        }

		        updateStateParam(FILTERS_TYPE.Citations_functions,functions.join($rootScope.paramsTokensDelimiter))
	        },


            /* getters e setters per l'ordinamento dei risultati */ //todo: da valutare: conviene creare un altro servizio solo per l'ordinamento?

            getOrderBy: function() {
                return orderBy;
            },

            setOrderBy: function(newOrderBy) {
                orderBy.value = newOrderBy;
	            updateStateParam("orderCitBy",newOrderBy);
            },

            getSort: function() {
                return sort;
            },

            setSort: function(newSort) {
	            sort.value = newSort;
	            for (var key in SORT) {
		            if (SORT[key] == newSort) {
			            updateStateParam("sortCit",key);
		            }
	            }
            },

            restoreDefaultOrderBy: function() {
               // orderBy = angular.copy(defaultOrderBy, orderBy); //deep copy, non assegnazione per riferimento
            },

	        addActivatedFilter: function(fil) {
		        activatedFilters.push(fil)
	        },

	        removeActivatedFilter: function(fil) {
		        activatedFilters.splice(activatedFilters.indexOf(fil),1);
		        StatesManagerService.updateCurrentStateParam(fil,undefined);

		        $location.search(fil,null);
		        switch(fil) {
			        case FILTERS_TYPE.Citations_afterYear:
				        startingPublicationYear.value = defaultYear;
				        //StatesManagerService.updateCurrentStateParam(fil,defaultYear);
				        break;
			        case FILTERS_TYPE.Citations_selfCitations:
				        selfcitations.value = false;
				        selfcitations.exclude = true;
				        //StatesManagerService.updateCurrentStateParam(fil,selfcitations.exclude?"exclude":"isolate");
				        break;
			        case FILTERS_TYPE.Citations_authors:
				        authors.enabled = false;
				        authors.value.length = 0;
				        //StatesManagerService.updateCurrentStateParam(fil,null);
				        break;
			        case FILTERS_TYPE.Citations_functions_exclude:
				        //StatesManagerService.updateCurrentStateParam(fil,[]);
				        break;
			        case FILTERS_TYPE.Citations_functions:
				        //StatesManagerService.updateCurrentStateParam(fil,[]);
				        break;
			        //todo: aggiungere altri case per gli altri filtri (vd articles-filters-manager.removeActivatedFilter)
		        }
	        },

	        getFilterActivatedList: function() {
		        return activatedFilters;
	        },



	        checkFilters: function() {
		        checkYearFilter();
		        checkSelfCitationsFilter();
		        checkAuthorsFilter();
		        checkFunctionsFilter();
		        //checkFunctionsExcludedFilter();
	        },

	        checkOrder: function() {
		        checkOrderBy();
		        checkSort();
	        }


        }
    }
]);
