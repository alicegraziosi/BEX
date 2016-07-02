/**=========================================================
 * module: response-interceptor.js
 * servizio per effettuare dei check sulle risposte alle richieste http
 =========================================================*/

'use strict';

myApp.factory('ResponseInterceptorService', ["$q", 
    function($q) {
        return {
            responseError: function(rejection) {
                if (rejection.status === 0) {
                    console.log("server non contattabile")
                }
                return $q.reject(rejection);
            }
        }
}])
.config(["$httpProvider", 
    function($httpProvider) {
        $httpProvider.interceptors.push('ResponseInterceptorService');
}])
