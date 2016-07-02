/**=========================================================
 * module: request-articles.js
 * servizio per ottenere i risultati di ricerca sull'abstract finder
 * (http://www.semanticlancet.eu/abstractfinder/)
 =========================================================*/

'use strict';
myApp
    .factory('RequestArticlesService', ["$http",'$rootScope', 
        function($http, $rootScope) {
            var searchString = "";  // testo per la ricerca
            var acceptHead = 'application/rdf+json';
            var endpoint = 'http://www.semanticlancet.eu/abstractfinder/';
            var pendingRequest = false;  // no pending request

            return {
        
                setPendingRequest: function() {
                    pendingRequest = true;  // pendig request
                },

                setCompletedRequest: function() {
                    pendingRequest = false;  // no pending request
                },

                isRequestPending: function() {
                    return pendingRequest;  // true o false 
                },

                setSearchString: function(str) {
                    searchString = str
                },

                getSearchString: function() {
                    return searchString;
                },

                searchArticles: function(searchStr) {
                    pendingRequest = true;
                    searchString = searchStr;  // testo per la ricerca
                    var config = {
                        method: "GET",
                        params: {'query': searchString},  // p.e. http://www.semanticlancet.eu/abstractfinder/?query=web
                        headers: {'Accept': acceptHead},
                        url: endpoint  // http://www.semanticlancet.eu/abstractfinder
                    }
                    //guide http://nathanleclaire.com/blog/2014/01/04/5-smooth-angularjs-application-tips/
                    return $http(config);
                }
            }
        }
]);
