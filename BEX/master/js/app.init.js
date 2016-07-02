// jQuery : loaded in base.js file
if (typeof $ === 'undefined') { 
    throw new Error('This application\'s JavaScript requires jQuery');
}


// APP START
var App = angular.module('angle', [
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'tmh.dynamicLocale',
    'ui.utils'
  ]);

App.run(["$rootScope", "$state", "$stateParams", '$window', '$templateCache', 'ArticlesInfoService', '$http',
    function ($rootScope, $state, $stateParams, $window, $templateCache, ArticlesInfoService, $http) {
        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;

        // Uncomment this to disable template cache
        /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (typeof(toState) !== 'undefined'){
              $templateCache.remove(toState.templateUrl);
            }
        });*/

        // Scope Globals
        $rootScope.app = {
            name: 'BEX',
            description: 'Web App to search and browse the contents of Semantic Lancet Triplestore',
            year: ((new Date()).getFullYear()),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isBoxed: false,
                isRTL: false,
                horizontal: false,
                isFloat: false,
                asideHover: false,
                theme: null
            },
            useFullLayout: false,
            hiddenFooter: false,
            viewAnimation: 'ng-fadeInUp'
        };

        $rootScope.authors = [];

        $rootScope.venues = [];

        $rootScope.years = [];

        $rootScope.max_cit_in = "";

        $rootScope.max_cit_out = "";

        // id="prefixes" in index.html
        var prefixes = $('#prefixes').text();

        // per caricare il file che contiene le queries in base al dataset corrente
        $rootScope.selectQueryFile = function(){
            // settato nel file ping.js
            return $rootScope.queryFile;
        };
        
        
        // solo dopo che sia completato il loading di queries.html
        $rootScope.init = function() {
            // si richiede la lista degli autori
            ArticlesInfoService.getAllAuthors().then(
                function (response) {
                    var queryResults = response.data.results.bindings;
                    for (var item in queryResults) {
                        uri = queryResults[item].person.value;  // esempio uri: <http://www.semanticlancet.eu/resource/person/ian-horrocks>
                        n = queryResults[item].givenName.value;  // esempio nome: Ian
                        s = queryResults[item].familyName.value;  // esempio cognome: Horrocks
                        fullName = n + " " + s;
                        author = {"n": n, "s": s, "fullName":fullName, "uri": uri};
                        $rootScope.authors.push(author);
                    }
                },
                //todo caso da gestire meglio
                function (errResponse) {
                    $rootScope.authors = [];
                    console.error("Error while fetching authors. " + errResponse.status + ": " + errResponse.statusText)
                }
            );

            // si richiede la lista delle venues
            ArticlesInfoService.getAllVenues().then(
                function (response) {
                    var queryResults = response.data.results.bindings;
                    angular.forEach(queryResults, function(value, key) {
                        $rootScope.venues.push(value);
                    });
                },
                //todo caso da gestire meglio
                function (errResponse) {
                    $rootScope.venues = [];
                    console.error("Error while fetching venues. " + errResponse.status + ": " + errResponse.statusText)
                }
            );

            ArticlesInfoService.getRangeAnni().then(
                function (response) {
                    queryResults = response.data.results.bindings;
                    var res = [];
                    for (var item in queryResults) {
                        res.push(parseInt(year = queryResults[item].year.value));
                    }
                    $rootScope.years = res; // 2003 - 2014
                    console.log("INIT anni");
                },
                //todo caso da gestire meglio
                function (errResponse) {
                    $rootScope.years = [];
                    console.error("Error while fetching years. " + errResponse.status + ": " + errResponse.statusText)
                }
            );

            ArticlesInfoService.getMaxOutgoing().then(
                function (response) {
                    queryResults = response.data.results.bindings;
                    if (!queryResults[0].maxOutgoing) {
                        return ;
                    }
                    $rootScope.max_cit_out = parseInt(queryResults[0].maxOutgoing.value);
                    console.log("INIT max_cit_out" + $rootScope.max_cit_out);
                },
                //todo caso da gestire meglio
                function (errResponse) {
                    $rootScope.max_cit_out = "";
                    console.error("Error while fetching max_cit_out. " + errResponse.status + ": " + errResponse.statusText)
                }
            );

            ArticlesInfoService.getMaxIncoming().then(
                function (response) {
                    queryResults = response.data.results.bindings;
                    if (!queryResults[0].maxIncoming) {
                        return ;
                    }
                    $rootScope.max_cit_in = parseInt(queryResults[0].maxIncoming.value);
                    console.log("INIT max_cit_ii" + $rootScope.max_cit_in);
                },
                //todo caso da gestire meglio
                function (errResponse) {
                    $rootScope.max_cit_in = "";
                    console.error("Error while fetching max_cit_in. " + errResponse.status + ": " + errResponse.statusText)
                }
            );
        }


        /*
        2 modo
        
        $rootScope.$on("$includeContentLoaded", function(event){
            // ...
        });

        */
}]);
