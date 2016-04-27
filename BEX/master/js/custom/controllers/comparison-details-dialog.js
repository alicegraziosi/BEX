myApp.controller('ComparisonDetailsDialogController', ["$scope", "$rootScope", function($scope, $rootScope) {

    $scope.author1 = $scope.ngDialogData.currentAuthor;
    $scope.author2 = $scope.ngDialogData.compareWith;

    /*
      ngDialogData:

      data: {
        currentAuthor = $scope.currentAuthor;
        compareWith = $scope.compareWith;
      }
    */
    $scope.$on('ngDialog.opened', function () {
        console.log("autore corrente " + $scope.ngDialogData.currentAuthor);
        console.log("compare with" + $scope.ngDialogData.compareWith);
    });

}]);

