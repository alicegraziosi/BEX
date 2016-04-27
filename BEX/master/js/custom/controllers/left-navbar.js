myApp.controller('LeftNavbarController', ['ngDialog', function(ngDialog) {
    var self = this;
    self.openInfoDialog = function() {
        ngDialog.open({
            template: "app/templates/dialog-project-info.html",
            controller: ["$rootScope", "$scope", function($rootScope, $scope) {
            }]
        });
    }
}]);
