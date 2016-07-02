/**=========================================================
 * module: info-authors.js
 * servizio per reperire varie informazioni relative agli autori
 =========================================================*/
'use strict';


myApp
    .factory('AuthorInfoService', ["$http", "$interpolate","$rootScope","EndpointsManager", function($http,$interpolate,$rootScope,EndpointsManager) {
        var endpoint = EndpointsManager.getSelectedEndpoint();
        var prefixes = $('#prefixes').text();

        /* per costruire la query; query presa dallo script nell'html alla quale vengono sostituite le espressioni con ctx */
        var buildQueryURL = function(queryId,ctx) {
            var queryText = $(queryId).text();
            var query = prefixes + $interpolate(queryText)(ctx);
            var encodedquery = encodeURIComponent(query);

            return endpoint+"?format=json&query="+encodedquery;
        }

        return {
            //@guide ottenere articoli di un autore in base al nome(=givenName) e cognome(=familyName)
            requestAuthorArticles: function(givenName, familyName) {
                var expr = {givenName: givenName, familyName: familyName};
                var queryURL = buildQueryURL('#query_authorArticles',expr);

                return $http.get(queryURL);
            },

            //@guide ottenere articoli di un autore in base al nome completo (=fullname)
            // non usata
            /*
            requestFullNameAuthorArticles: function(fullName) {
                var expr = {authorFullName: fullName};
                var queryURL = buildQueryURL('#query_FullNameAuthorArticles',expr);

                return $http.get(queryURL);
            }
            */
        }
    }]);