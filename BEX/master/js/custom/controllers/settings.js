myApp.controller('SettingsController',['$rootScope','$localStorage','$sessionStorage','EndpointsManager', function($rootScope, $localStorage, $sessionStorage,EndpointsManager){
	"use strict";
	var self = this;

	self.endpoints = EndpointsManager.getEndpoints();
	self.selectedEndpoint = EndpointsManager.getSelectedEndpoint();
	self.newEndpoint = "";

	self.isSelectedEndpoint = function(value) {
		return value === self.selectedEndpoint;
	}

	self.removeEndpoint = function(index) {
		EndpointsManager.removeEndpoint(index);
	}

	self.addEndpoint = function() {
		EndpointsManager.addEndpoint(self.newEndpoint);
		self.newEndpoint = "";
	}

	self.setSelectedEndpoint = function(index) {
		EndpointsManager.setSelectedEndpoint(index);
	}

	self.clearLocalStorage = function() {
		$localStorage.$reset();
	}

	self.clearSessionStorage = function() {
		$sessionStorage.$reset();
	}

}]);