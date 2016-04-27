/**=========================================================
 * module: request-articles.js
 * servizio per ottenere i risultati di ricerca
 * call HTTP a http://www.semanticlancet.eu/abstractfinder/
 =========================================================*/

'use strict';

// myApp : modulo
// .factory('nomedelservizio', ['..', '..', function('..', '..'){ ... }]) .factory : metodo
// NOTA: a service is a constructor function whereas a factory is no

myApp
    .factory('RequestArticlesService', ["$http",'$rootScope', 
        function($http, $rootScope) {
            var searchString = "";  // testo per la ricerca
            var acceptHead = 'application/rdf+json';
            var endpoint = 'http://www.semanticlancet.eu/abstractfinder/';
            var pendingRequest = false;

            return {
                setCompletedRequest: function() {
                    pendingRequest = false;  // no pending request
                },

                isRequestPending: function() {
                    return pendingRequest;  // true o false 
                },

                setPendingRequest: function() {
                    pendingRequest = true;  // pendig request
                },

                searchArticles: function(searchStr) {
                    pendingRequest = true;
                    searchString = searchStr;
                    var config = {
                        method: "GET",
                        params: {'query': searchString},  // p.e. http://www.semanticlancet.eu/abstractfinder/?query=web
                        headers: {'Accept': acceptHead},
                        url: endpoint
                    }
                    //guide http://nathanleclaire.com/blog/2014/01/04/5-smooth-angularjs-application-tips/
                    return $http(config);
                },

                setSearchString: function(str) {
                    searchString = str
                },

                getSearchString: function() {
                    return searchString;
                }
            }
        }
]);
