/**=========================================================
 * module: endpoints-manager.js
 * servizio per gestire gli endpoints
 =========================================================*/
'use strict';

myApp.factory('EndpointsManager', ['$localStorage',function($localStorage){

 var endpoints;
 var selectedEndpoint;

 if($localStorage.endpoints) {
  endpoints = $localStorage.endpoints;
 } else {
  $localStorage.endpoints = endpoints = [
   "http://two.eelst.cs.unibo.it:8181/data/query" //in prima posizione c'è l'endpoint default
  ];
 }

 if($localStorage.selectedEndpoint) {
  selectedEndpoint = $localStorage.selectedEndpoint;
 } else {
  $localStorage.selectedEndpoint = selectedEndpoint = {"value":endpoints[0]} //imposto l'endpoint default
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

  getSelectedEndpoint: function() {
   return selectedEndpoint.value; // richiamato in ping.js
  }

 }
}]);