/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils','StatesManagerService','ArticleManagerService', 'BookmarksManagerService',
  function($rootScope, $scope, $state, $http, $timeout, Utils, StatesManagerService, ArticleManagerService, BookmarksManagerService){

    var collapseList = [];

    // demo: when switch from collapse to hover, close all items
    $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
      if ( newVal === false && oldVal === true) {
        closeAllBut(-1);
      }
    });

    // Check item and children active state
    var isActive = function(item) {

      if(!item) return;

      if( !item.sref || item.sref == '#') {
        var foundActive = false;
        angular.forEach(item.submenu, function(value, key) {
          if(isActive(value)) foundActive = true;
        });
        return foundActive;
      }
      else
        return $state.is(item.sref) || $state.includes(item.sref);
    };

    // Load menu from json file
    // -----------------------------------

    $scope.getMenuItemPropClasses = function(item) {
      return (item.heading ? 'nav-heading' : '') +
          (isActive(item) ? ' active' : '');
          //+ (item.bottom == true ? 'bottom-item' : '');
    };



    $scope.getNum = function(id) {
      switch (id) {
        case "ArticlesLength":
          return ArticleManagerService.getArticles().length;
          break;
        case "BookmarksLength":
          return BookmarksManagerService.getBookmarksIDB().values.length;
          break;
      }

    };

    $scope.loadSidebarMenu = function() {

      var menuJson = 'server/sidebar-menu.json',
          menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
      $http.get(menuURL)
          .success(function(items) {
            $scope.menuItems = items;
          })
          .error(function(data, status, headers, config) {
            alert('Failure loading menu');
          });
    };

    $scope.loadSidebarMenu();

    // Handle sidebar collapse items
    // -----------------------------------

    $scope.addCollapse = function($index, item) {
      collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index, isParentItem) {


      // collapsed sidebar doesn't toggle drodopwn
      if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

      // make sure the item index exists
      if( angular.isDefined( collapseList[$index] ) ) {
        if ( ! $scope.lastEventFromChild ) {
          collapseList[$index] = !collapseList[$index];
          closeAllBut($index);
        }
      }
      else if ( isParentItem ) {
        closeAllBut(-1);
      }

      $scope.lastEventFromChild = isChild($index);

      return true;

    };

    $scope.goTo = function(sref) {
      switch(sref) {
        case "app.home-search":
          $state.go("app.home-search");
          break;
        case "app.articles-results": //todo:barbatrucco da rivedere: in realtà non vado ad app.articles, ma all'ultimo state visitato dall'utente
          var lastState = StatesManagerService.getLastState();

	      if (!lastState) {
		      $state.go("app.articles-results");
		      break;
	      }

          if(!lastState.name) {
            $state.go("app.articles-results");
          } else {
            var params = angular.copy(lastState.params);
            params.noReload = true;
            $state.go(lastState.name,params);
          }
          break;
        default :
          $state.go(sref);
          break;
      }
    }

    function closeAllBut(index) {
      index += '';
      for(var i in collapseList) {
        if(index < 0 || index.indexOf(i) < 0)
          collapseList[i] = true;
      }
    }

    function isChild($index) {
      return (typeof $index === 'string') && !($index.indexOf('-') < 0);
    }

  }]);