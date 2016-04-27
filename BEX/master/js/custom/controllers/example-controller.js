'use strict';
myApp.controller("ExampleController", "ArticlesResultsController" ['PagerService', 
    function ExampleController(PagerService, ArticlesResultsController) {
    var vm = this;
    
    vm.dummyItems = ArticlesResultsController.
    vm.pager = {};
    vm.setPage = setPage;
 
    initController();
 
    function initController() {
        // initialize to page 1
        vm.setPage(1);
    }
 
    function setPage(page) {
        if (page < 1 || page > vm.pager.totalPages) {
            return;
        }
 
        // get pager object from service
        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
 
        // get current page of items
        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex);
    }
}]);