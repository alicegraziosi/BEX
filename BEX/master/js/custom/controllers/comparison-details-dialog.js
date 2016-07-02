myApp.controller('ComparisonDetailsDialogController', ["$rootScope", "$scope", "RequestArticlesService", "ArticleManagerService", "$sessionStorage",
    function($rootScope, $scope, RequestArticlesService, ArticleManagerService, $sessionStorage) {
        var self = this;
        self.authorUno = "";
        self.authorDue = "";
        self.comparisonType =  $scope.ngDialogData.comparisonType;  // incoming o outgoing
}]);

