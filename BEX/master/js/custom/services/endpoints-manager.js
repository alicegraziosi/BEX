/**=========================================================
 * module: endpoints-manager.js
 * servizio per gestire gli endpoints
 =========================================================*/
'use strict';

myApp.factory('EndpointsManager', ['$localStorage', '$http', function($localStorage, $http){

    // NEW
    var endpoints = [];

    var selectedEndpoint;

    if($localStorage.endpoints) {
        endpoints = $localStorage.endpoints;
    } else {
        /*
        "endpoint": "http://two.eelst.cs.unibo.it:8181/data/query",
        "queryFile": "queriesSemanticLancet.html",
        "datasetName": "Semantic Lancet"
        */
        var endpointQueryFile = 'server/endpointQueryFile.json';
        $http.get(endpointQueryFile)
            .success(function(items) {
                angular.forEach(items, function(value, key) {
                    endpoints.push(value.endpoint);
                    $localStorage.endpoints = endpoints;
                });
            })
            .error(function(data, status, headers, config) {
                ngDialog.open({template: "app/templates/dialog-error.html"});
            });
    }

    if($localStorage.selectedEndpoint) {
        selectedEndpoint = $localStorage.selectedEndpoint;
    } else {
        // imposto l'endpoint default
        $localStorage.selectedEndpoint = selectedEndpoint = {"value": "http://two.eelst.cs.unibo.it:8181/data/query"}  
    }

    return {
        getEndpoints: function(){
            return endpoints;
        },

        removeEndpoint: function(index){
            endpoints.splice(index, 1);
        },

        addEndpoint: function(newEndpoint){
            endpoints.push(newEndpoint);
        },

        setSelectedEndpoint: function(index){
            selectedEndpoint.value = endpoints[index];
        },

        getSelectedEndpoint: function() {  // richiamato in ping.js 
            return selectedEndpoint.value; 
        }
    }
}]);