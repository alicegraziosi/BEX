/**=========================================================
 * Module: article-item.js
 * elemento per le informazioni su un singolo articolo
 =========================================================*/

myApp.directive('articleItem', ["ngDialog", "ArticleManagerService","$rootScope", "BookmarksManagerService", "SEARCH_TYPE", function(ngDialog, ArticleManagerService, $rootScope, BookmarksManagerService, SEARCH_TYPE) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'app/templates/article-item.html',  //todo: path relativo
        scope: {
            articleData: '=',
            articleIndex: '@',
            yearFilter: '=',                    //@guide attributo per passare il filtro per anno di pubblicazione
            orderFilter: '=',                   //@guide attributo per passare l'ordinamento da usare
            sortFilter: '=',                    //@guide attributo per passare il sort da usare
            selfcitationFilter: '=',            //@guide attributo per passare il filtro per le autocitazioni
            characterizationsFilter: '=',       //@guide attributo per passare il filtro per i colori delle citazioni
            authorsFilter: '=',                 //@guide attributo per passare il filtro per gli autori
            checkBookmark: "=",
	        showDetails: "="
        },
        link: function($scope, $element, $attributes) {
            $scope.articleIsCollapsed = true;
            var detailsAlreadyRequested = false; //todo: da cambiare: questa info deve stare in ArticleManagerService


            if ($scope.checkBookmark.value) {
	            //todo: sono costretto a farlo
	            BookmarksManagerService.checkBookmarked($scope.articleData);

            }
            
            // pannello
            $scope.toggleArticleDetails = function(articleData) {
                $scope.articleIsCollapsed = !$scope.articleIsCollapsed;
                //@guide è qui che chiedo le ulteriori info sull'articolo: nel momento in cui lui si dichiara interessato e vuole approfondire
                // se il panel non è collassato (vuol dire che pochi attimi fa era collassato, lo stato cambia qui sopra) e se le info non sono già state richieste
                if (!$scope.articleIsCollapsed) {
                    detailsAlreadyRequested = !detailsAlreadyRequested;
                    checkArticlesCitationsDetails(articleData);
                }
            }

            $scope.toggleBookmark = function(articleData) {
                if (!articleData.bookmark || articleData.bookmark == false) {
	                articleData.bookmark = true;
	                if (!articleData.citationsDetails || !articleData.biblioDetails) {
		                checkArticlesCitationsDetails(articleData);
	                } else if (articleData.citationsDetails && articleData.biblioDetails) {
		                BookmarksManagerService.saveBookmark($scope.articleData);
	                }
                } else {
	                articleData.bookmark = false;
                    BookmarksManagerService.deleteBookmark(articleData);

                }
            }

            $scope.availableIssue = function(articleData) {
                return articleData.hasOwnProperty("issueNumber") && articleData.hasOwnProperty("volumeNumber");
            }

            $scope.showCitDetails = function() {
                ngDialog.open({
                    template: "app/templates/dialog-citations-details.html",
                    controller: "CitationDetailsDialogController",
                    className: "ngdialog-theme-default-custom",
                    data: {
                        articleData: $scope.articleData,
                        citDonutChartId: "donut_chart",
                        citStackedChartId: "stackedColumn_chart"
                    }
                });
            }

            /* per visualizzare tutti gli articoli di un autore */
            $scope.exploreAuthor = function(givenName, familyName) {
                $rootScope.$state.go('app.author-articles',
	                {
	                    newSearch: false,  // è una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
	                    searchType: SEARCH_TYPE.authorSearch,  // ricerca per autore
	                    searchQuery: givenName+" "+familyName,        // nome dell'autore
		                authorId:  givenName+" "+familyName,
                        authorName: givenName,  // nome 
                        authorSurname: familyName,  // cognome
	                },
	                {
                        inherit: $rootScope.inheritUrlParams, //eureka!! bastava mettere questo a false per evitare di trascinarsi i parametri nell'url!!
	                }
                );
            }

            /* per ottenere l'URL dell'articolo */
            $scope.getArticleLink = function() {
                var generatedURL = $rootScope.$state.href("app.article-doi", {doi: $scope.articleData.doi}, {absolute: true});
                ngDialog.open({
                    template: "app/templates/dialog-article-url",
                    className: "ngdialog-theme-default-custom",
                    data: {
                        url: generatedURL
                    }
                });
            }

            $scope.getCitationsMinYear = function() {
                var minYear = $scope.articleData.biblioInfo[0].publicationYear;
                for (var key in $scope.articleData.biblioInfo) {
                    if ($scope.articleData.biblioInfo[key].publicationYear < minYear) {
	                    minYear = $scope.articleData.biblioInfo[key].publicationYear;
                    }
                }

	            return minYear;
            }

	        $scope.getCitationsMaxYear = function() {
		        var maxYear = $scope.articleData.biblioInfo[0].publicationYear;
		        for (var key in $scope.articleData.biblioInfo) {
			        if ($scope.articleData.biblioInfo[key].publicationYear > maxYear) {
				        maxYear = $scope.articleData.biblioInfo[key].publicationYear;
			        }
		        }

		        return maxYear;
	        }

            // richiede le info sulle citazioni dell' articolo
            // expression http://www.semanticlancet.eu/resource/1-s2.0-S1570826808000413/version-of-record per semantic lancet
            // expression ... per springer
            // articleData.expression === articleData.expression.value
            function checkArticlesCitationsDetails(articleData) {
                if (!articleData.citationsDetails) {
                    ArticleManagerService.getCitationsInfo(articleData.expression, articleData.authors);
                }
                if (!articleData.biblioDetails) {
                    ArticleManagerService.getBiblioInfo(articleData.expression, articleData.authors);
                }
             }


            /* se stai leggendo queste righe di codice probabilmente non stai capendo che senso abbiano...contattami*/
	        if ($scope.checkBookmark.value) {
		        $scope.$watch(function() { return $scope.articleData.biblioInfo},
			        function() {
				        if ($scope.articleData.bookmark) {
					        BookmarksManagerService.saveBookmark($scope.articleData);
				        }
			        },
			        true
		        );

		        $scope.$watch(function() { return $scope.articleData.citingArticles },
			        function() {
				        if ($scope.articleData.bookmark) {
					        BookmarksManagerService.saveBookmark($scope.articleData);
				        }
			        },
			        true
		        );
	        }


        }
    };

}]);
