/**=========================================================
 * Module: citing-item.js
 * elemento per le informazioni su un singolo articolo citante
 =========================================================*/

myApp.directive('citingItem', ["ngDialog", "ArticleManagerService","$rootScope","SEARCH_TYPE", function( ngDialog, ArticleManagerService, $rootScope, SEARCH_TYPE) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'app/templates/citing-item.html', //todo: path relativo
        scope: {
            citingIndex: '@',
            itemData: "=",
            citedArticleAuthors: "="
        },
        link: function(scope, element, attributes) {
            scope.$storage = {}; //todo: da rivedere: definisco storage per aggirare un possibile bug della direttiva panel-tools, vedere anche generateId()

            scope.emphasizeInTxtRefPointer = function(sentenceTxt, irpTxt) {
                var empSentence = sentenceTxt.replace(irpTxt, "<span class='irp'><b>"+irpTxt+"</b></span>")
                return empSentence;
            }

            scope.generateId = function($index){
                var elemId = "motivation_"+$index+Math.floor((Math.random() * 100000) + 1);
                var data = angular.fromJson(scope.$storage["panelState"]);
                if(!data) {
                    data = {};
                }
                data[elemId] = true;
                scope.$storage["panelState"] = angular.toJson(data);
                return elemId;
            }

            /* per ottenere l'URL dell'articolo */
            scope.getArticleLink = function() {
                var generatedURL = $rootScope.$state.href("app.article-doi", {doi: scope.itemData.doi.value}, {absolute: true});
                ngDialog.open({
                    template: "app/templates/dialog-article-url",
                    className: "ngdialog-theme-default-custom",
                    data: {
                        url: generatedURL
                    }
                });
            }

            /* per avere maggiori info sul corrente elemento citante */
            scope.exploreCitingItem = function() {
                //var strBreadCrumb = "["+scope.itemData.publicationYear+"] "+scope.itemData.title.value.substr(0,40)+"...";
                $rootScope.$state.go(
                    'app.article-doi',
                    {
	                    doi: scope.itemData.doi.value,
	                    title: scope.itemData.title
                    },
                    {
                        inherit: $rootScope.inheritUrlParams, //eureka!! bastava mettere questo a false per evitare di trascinarsi i parametri nell'url!!
                    }
                );
            }

            /* per visualizzare tutti gli articoli di un autore */
            scope.exploreAuthor = function(givenName, familyName) {
                ngDialog.closeAll();
                $rootScope.$state.go(
                    'app.author-articles',
                    {
                        newSearch: false,                                // è una nuova ricerca, quindi cancella tutti gli states e salva in sessionStorage i risultati
                        searchType: SEARCH_TYPE.authorSearch,           // è una ricerca per autore
                        searchQuery: givenName+" "+familyName,        // nome dell'autore
                        authorId:  givenName+" "+familyName
                    },
                    {
                        inherit: $rootScope.inheritUrlParams, //eureka!! bastava mettere questo a false per evitare di trascinarsi i parametri nell'url!!
                    }
                );
            }

            /* se un autore di un citing-item é anche autore dell'articolo citato, allora ritorna true, altrimenti false */
            scope.isSharedAuthor = function(author) {
                for (var i in scope.citedArticleAuthors) {
                    if (scope.citedArticleAuthors[i].fullName === author.fullName) {
                        return true;
                    }
                }
                return false;
            }

	        scope.openAbstractDialog = function() {
                ngDialog.open({
			        template: "/app/templates/dialog-abstract.html",
			        className: "ngdialog-theme-default-custom",
			        data: {
				        absText: scope.itemData.abstractTxt.value,
				        title: scope.itemData.title.value
			        }
		        });
	        }

            scope.openMotivationsDialog = function() {
                ngDialog.open({
                    template: "/app/templates/dialog-motivations-citing.html",
                    controller: ModalMotivationsCtrl,
                    className: "ngdialog-theme-default-custom",
                    data: {
                        motivations: scope.itemData.motivations,
                        title: scope.itemData.title.value
                    }
                });
            }

            var ModalMotivationsCtrl = ["$scope", function ($scope) {
                $scope.$storage = {}; //todo: da rivedere: definisco storage per aggirare un possibile bug della direttiva panel-tools, vedere anche generateId()
                $scope.empInTxtRefPointer = function(sentenceTxt, irpTxt) {
                    var empSentence = sentenceTxt.replace(irpTxt, "<span class='irp'><b>"+irpTxt+"</b></span>")
                    return empSentence;
                };
                $scope.generateId = function($index){
                    var elemId = "motivation_"+$index+Math.floor((Math.random() * 100000) + 1);
                    var data = angular.fromJson($scope.$storage["panelState"]);
                    if(!data) {
                        data = {};
                    }
                    data[elemId] = true;
                    $scope.$storage["panelState"] = angular.toJson(data);
                    return elemId;
                }
            }];
        },
        controller: ["$scope","$element", function($scope,$element) {
            $scope.citingId = "citing_"+Date.now();
        }]
    };
}]);

