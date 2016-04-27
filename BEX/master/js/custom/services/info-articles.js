/**=========================================================
 * Servizio info-articles.js  per reperire le informazioni relative agli articoli
 * il servizio si occupa di fare le chiamate all'endpoint
 =========================================================*/
'use strict';

// uso: ArticlesInfoService.getArticleGeneralInfo('blabla'); call http
// ritorna


myApp
    .factory('ArticlesInfoService', ["$http", "$interpolate", "$rootScope", "EndpointsManager",
        function($http, $interpolate, $rootScope, EndpointsManager) {

            // http://two.eelst.cs.unibo.it:8181/data/query default
            var endpoint = EndpointsManager.getSelectedEndpoint();

            // apache jena fuseki sparql endpoint locale raffaele
            // endpoint = "http://localhost:8181/data/query";

            // apache jena fuseki sparql endpoint locale alice 
    		// endpoint = "http://localhost:3030/bexDataset/query";

            endpoint = "http://localhost:3030/myDataset/query"; 

            // id="prefixes" in index.html
            var prefixes = $('#prefixes').text();

            // funzione per costruire la query
            // query presa dallo script nell'html alla quale vengono sostituite le espressioni {{}} con ctx
            var buildQueryURL = function(queryId, ctx) {
                var queryText = $(queryId).text();
                // $interpolate: servizio di AngularJS
                var query = prefixes + $interpolate(queryText)(ctx);
                var encodedquery = encodeURIComponent(query);

                return endpoint+"?format=json&query="+encodedquery;
            }


            return {
                //@guide per le info generali su un articolo
                getArticleGeneralInfo: function(workURI) {
                    var expr = {work: workURI};
                    var queryURL = buildQueryURL('#query_articleInfo',expr);

                    return $http.get(queryURL);
                },

                //@guide per le info citazionali di un articolo (di quelli mostrati nei risultati di ricerca) con expression = expressionURI
                requestCitationsInfo: function(expressionURI) {
                    var expr = {citedExpression: expressionURI};
                    var queryURL = buildQueryURL('#query_citationsInfo',expr);

                    return $http.get(queryURL);
                },

                //@guide per le info generiche sugli articoli che citano un articolo con expression = expressionURI
                requestCitingArticles: function(expressionURI) {
                    var expr = {citedExpression: expressionURI};
                    var queryURL = buildQueryURL('#query_citingArticles',expr);

                    return $http.get(queryURL);
                },

                //@guide per la lista di autori di un articolo
                getArticleAuthors: function(authorsListURI) {
                    var expr = {authorsList: authorsListURI};
                    var queryURL = buildQueryURL('#query_articleAuthors',expr);

                    return $http.get(queryURL);
                },


                getArticleIncomingCitationsInfo: function(expressionURI) {
                    var expr = {expression: expressionURI};
                    var queryURL = buildQueryURL('#query_incomingCitationsActs',expr);

                    return $http.get(queryURL);
                },

                getArticleOutgoingCitationsInfo: function(expressionURI) {
                    var expr = {expression: expressionURI};
                    var queryURL = buildQueryURL('#query_outgoingCitationsActs',expr);

                    return $http.get(queryURL);
                },

                //@guide per le info generiche sugli articoli citati da un certo articolo
                requestBiblioInfo: function(expressionURI) {
                    var expr = {expression: expressionURI};
                    var queryURL = buildQueryURL('#query_citedArticles',expr);

                    return $http.get(queryURL);
                },

                //@guide per le info aggiuntive sugli articoli citati da un certo articolo: numero di citazioni e colore (da articolo citante ad articolo citato)
                getCitationActsInfo: function(citingExp, citedExp) {
                    var expr = {artExpression: citingExp,
                                citedExpression: citedExp};
                    var queryURL = buildQueryURL('#query_citationActsInfo',expr);

                    return $http.get(queryURL);

                },

                //@guide per le info aggiuntive sugli articoli citati da un certo articolo: numero di citazioni e colore (da articolo citante ad articolo citato)
                getCitationActsInfoNotGrouped: function(citingExp, citedExp) {
                    var expr = {artExpression: citingExp,
                        citedExpression: citedExp};
                    var queryURL = buildQueryURL('#query_citationActsInfoNotGrouped',expr);

                    return $http.get(queryURL);

                },

                //@guide per ottenere tutti gli autori
                getAllAuthors: function() {
                    var queryText = $("#query_allAuthors").text();
                    var query = prefixes + queryText;
                    var encodedquery = encodeURIComponent(query);

                    return $http.get(endpoint+"?format=json&query="+encodedquery);
                    //return $http.jsonp(endpoint+"?format=json&query="+encodedquery);
                },

                //@guide per ottenere un singolo articolo
                getArticle: function(articleTitle) {
                    var expr = {title: articleTitle};
                    var queryURL = buildQueryURL('#query_singleArticle',expr);

                    return $http.get(queryURL);
                },

                //@guide per ottenere un singolo articolo (partendo dal DOI)
                getArticleByDoi: function(articleDoi) {
                    var expr = {doi: articleDoi};
                    var queryURL = buildQueryURL('#query_singleArticleByDoi',expr);

                    return $http.get(queryURL);
                },

                //@guide per ottenere work degli articoli a partire da un certo titolo
                requestArticlesByTitle: function(articleTitle) {
                    var expr = {title: articleTitle};
                    var queryURL = buildQueryURL('#query_articlesWork_fromTitle',expr);

                    return $http.get(queryURL);
                },

                //
                getArticleType: function(exp) {
                    var expr = {expression: exp};
                    var queryURL = buildQueryURL('#query_articleType',expr);

                    return $http.get(queryURL);
                }
            }
}]);
