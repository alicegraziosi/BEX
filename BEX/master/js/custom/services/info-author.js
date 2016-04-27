/**=========================================================
 * module: info-authors.js
 * servizio per reperire varie informazioni relative agli autori
 =========================================================*/
'use strict';


myApp
    .factory('AuthorInfoService', ["$http", "$interpolate","$rootScope","EndpointsManager", function($http,$interpolate,$rootScope,EndpointsManager) {
        var endpoint = EndpointsManager.getSelectedEndpoint();
        //endpoint = "http://localhost:8181/data/query"; //todo: endpoint locale
        var prefixes = $('#prefixes').text();

        /* per costruire la query; query presa dallo script nell'html alla quale vengono sostituite le espressioni con ctx */
        var buildQueryURL = function(queryId,ctx) {
            var queryText = $(queryId).text();
            var query = prefixes + $interpolate(queryText)(ctx);
            var encodedquery = encodeURIComponent(query);

            return endpoint+"?format=json&query="+encodedquery;
        }

        return {
            requestAuthorArticles: function(familyN, givenN) {
                var expr = {authorFamilyName: familyN, authorGivenName: givenN};
                var queryURL = buildQueryURL('#query_authorArticles',expr);

                return $http.get(queryURL);
            },

            requestFullNameAuthorArticles: function(fullName) {
                var expr = {authorFullName: fullName};
                var queryURL = buildQueryURL('#query_FullNameAuthorArticles',expr);

                return $http.get(queryURL);
            }
        }
    }]);