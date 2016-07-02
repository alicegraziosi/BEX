/**=========================================================
 * module: Ping.js
 * semplice servizio per controllare se i server sono contattabili
 =========================================================*/
'use strict';

// enable cors requests in AngularJS
myApp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

myApp.factory('Ping', ["$http", "$rootScope", "EndpointsManager", "ngDialog",
	function($http, $rootScope, EndpointsManager, ngDialog) {
		
		// endpoint corrente, default http://two.eelst.cs.unibo.it:8181/data/query
		var endpoint = EndpointsManager.getSelectedEndpoint(); 

		return {

			getMaxNumberOfArticles: function(){
				if($rootScope.maxNumber == "" || $rootScope.maxNumber == undefined || isNaN($rootScope.maxNumber)){
					$rootScope.maxNumber = parseInt(30);
				}
				console.log("ping max "  + $rootScope.maxNumber);
			},

			selectQueryFile: function() {
				// file di configurazione
				var endpointQueryFile = 'server/endpointQueryFile.json';
				$http.get(endpointQueryFile)
		        	.success(function(items) {
		        		angular.forEach(items, function(value, key) {
		        			if(endpoint == value.endpoint){
		        				// nome del file di query corrispondente all'endpoint corrente
								// valore letto in app.init.js
								$rootScope.queryFile = value.queryFile;
								$rootScope.datasetName = value.datasetName;
							}
						});
		            })
		            .error(function(data, status, headers, config) {
		              	ngDialog.open({template: "app/templates/dialog-error.html"});
		            });
		            
			},
		
			pingEndpoint: function() {
				var query = "ASK  { ?x ?y ?z }";
				$http({
					method:"GET",
					url: endpoint+"?format=json&query="+encodeURIComponent(query),
					timeout: 3000
				})
				.success(function(data, status, headers, config){
					console.log("ping " + endpoint + "" + $rootScope.queryFile + " "  + $rootScope.datasetName);
				})
				.error(function(data, status, headers, config){
					ngDialog.open({template: "app/templates/dialog-error.html"});
					return false;
				});
			}
		}
}]);