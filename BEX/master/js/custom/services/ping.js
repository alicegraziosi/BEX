/**=========================================================
 * module: Ping.js
 * semplice servizio per controllare se i server sono contattabili
 =========================================================*/
'use strict';

myApp.factory('Ping',["$http","$rootScope","EndpointsManager","ngDialog", function($http,$rootScope,EndpointsManager,ngDialog) {
	
	//var endpoint = EndpointsManager.getSelectedEndpoint();  // default http://two.eelst.cs.unibo.it:8181/data/query

	var endpoint = "http://localhost:3030/myDataset/query";

	return {
		pingEndpoint: function() {
			var query = "ASK  { ?x ?y ?z }";

			$http({
				method:"GET",
				url: endpoint+"?format=json&query="+encodeURIComponent(query),
				timeout: 3000
			})
			.success(function(data, status, headers, config){
				//
			})
			.error(function(data, status, headers, config){
				ngDialog.open({template: "app/templates/dialog-error.html"});
				return false;
			});
		}
	}
}]);