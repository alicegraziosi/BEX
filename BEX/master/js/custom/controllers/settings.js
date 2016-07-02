myApp.controller('SettingsController',['$rootScope','$localStorage','$sessionStorage','EndpointsManager', function($rootScope, $localStorage, $sessionStorage,EndpointsManager){
	"use strict";
	var self = this;

	self.endpoints = EndpointsManager.getEndpoints();
	self.selectedEndpoint = EndpointsManager.getSelectedEndpoint();
	self.newEndpoint = "";
	self.maxNumber = "";
	
    if($rootScope.maxNumber) {
        self.maxNumber = $rootScope.maxNumber;
    } else {
    	$rootScope.maxNumber = self.maxNumber;
    }

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

	self.setMaxNumber = function(){
		$rootScope.maxNumber = parseInt(self.maxNumber);
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