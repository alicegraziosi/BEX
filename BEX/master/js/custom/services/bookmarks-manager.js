myApp
	.factory('BookmarksManagerService',['ArticleManagerService','$rootScope', function(ArticleManagerService, $rootScope){
		var bookmarksIDB = {
			values: []
		};
		var BOOKMARKS_STORE_NAME = 'BookmarksStore';
		var PREFIX = 'BEX-'

		var BookmarksStore = new IDBStore(
			{
				storeName: BOOKMARKS_STORE_NAME,
				storePrefix: PREFIX,
				keyPath: 'doi',
				autoIncrement: false,
				dbVersion: 3,
				onError: function(err) {console.error(err)},
				onStoreReady: refreshBookmarks
			}
		);

		function refreshBookmarks() {
			BookmarksStore.getAll(
				function(data) {
					angular.copy(data, bookmarksIDB.values);
					//@guide: http://www.sitepoint.com/understanding-angulars-apply-digest/
					$rootScope.$apply();
				}
			)

		}

		function deleteBookmarksStore() {
			var DBDeleteRequest = window.indexedDB.deleteDatabase(PREFIX+BOOKMARKS_STORE_NAME);

			DBDeleteRequest.onerror = function(event) {
				console.log("Error deleting database.");
			};

			DBDeleteRequest.onsuccess = function(event) {
				console.log("Database deleted successfully");
			};
		}

		return{
			saveBookmark: function(articleData) {


				///* old implementation */
				//
				//bookmarks[articleData.doi] = articleData;


				/* new implementation */
				BookmarksStore.put(
					articleData,
					function() {
						refreshBookmarks();
					},
					function(err) {
						console.log(err)
					}
				)

				//console.log(bookmarks);
			},

			deleteBookmark: function(articleData) {

				function onSuccess(result){
					if(result !== false){
						refreshBookmarks();
						//console.log('DELETE success');
					}
				}
				function onError(error){
					console.error(error);
				}

				ArticleManagerService.reloadSearchResult(articleData);
				BookmarksStore.remove(articleData.doi, onSuccess, onError);
			},

			getBookmark: function(doi) {
				BookmarksStore.get(doi, function(data) {return data}, function() {return null});
			},

			getBookmarksIDB: function() {
				return bookmarksIDB;
			},


			deleteAllBookmarks: function() {
				var onsuccess = function(){
					refreshBookmarks();
					//console.log('CLEAN success!');
				}
				var onerror = function(error){
					console.log('CLEAN error', error);
				}

				for (var key in bookmarksIDB.values) {
					bookmarksIDB.values[key].bookmark = false;
					ArticleManagerService.reloadSearchResult(bookmarksIDB.values[key])

				}

				bookmarksIDB.values.length = 0; //todo: piccolo barbatrucco per velocizzare le cose
				BookmarksStore.clear(onsuccess, onerror);
			},

			checkBookmarked: function(articleData) {
				BookmarksStore.get(
					articleData.doi,
					function(data) {
						//todo: articleData non andrebbe modificato qui, ma la fun get è asincrona, soluzione tempranea
						if (data) {
							articleData.bookmark = true;
						} else {
							articleData.bookmark = false;
						}
					},
					function(err) {
						console.error(err);
						articleData.bookmark = false;
					}
				);
			},

			//todo: funzione della vecchia implementazione oon localStorage
			//replaceBookmark: function(articleData) {
			//	articleData.bookmark = true;
			//	bookmarks[articleData.doi] = articleData;
			//},

			deleteBookmarksStore: function() {
				deleteBookmarksStore();
			}
		}
	}])