/**=========================================================
 * module: states-manager.js
 * servizio per gestire salvataggio e recupero delle informazioni realtive agli articoli mostrati in ogni state
 =========================================================*/


/*
in articles-manager.js

var checkState = function(searchType, id, details) {
    var stateIndex = StatesManagerService.getStateIndex(searchType, id) // indice dello state, -1 se non presente

    if (stateIndex == -1) {
        StatesManagerService.saveState(searchType, id, details);
    } else {
        StatesManagerService.restoreState(stateIndex); //se lo state è già presente, lo recupero ed elimino tutti gli states successivi
    }
}


*/

'use strict';

myApp
    .factory('StatesManagerService', ["$sessionStorage", '$rootScope','$stateParams', function($sessionStorage, $rootScope, $stateParams) {
        var states = [];
        var lastState = {state: undefined, params: undefined};

        if ($sessionStorage.states) {
            states = $sessionStorage.states;
        } else {
            $sessionStorage.states = states;
        }

        if ($sessionStorage.lastState ) {
            lastState = $sessionStorage.lastState;
        } else {
            $sessionStorage.lastState = lastState;
        }

        return {
            // StatesManagerService.setState("app.article-doi", $stateParams);
            setState: function(name,params) {
                lastState.name = name;
                lastState.params = params;
            },

            updateCurrentStateParam: function(param,value) {
                states[states.length-1].params[param] = value;
            },

            /* salva uno nuovo stato */
            saveState: function(stateType, id, details) {
                if (details) {
                    lastState.details = details;
                    lastState.id = id;
                    var newState = angular.copy(lastState);
                    states.push(newState);
                }
            },

            /* recupera uno stato ed elimina tutti i successivi */
            restoreState: function(index) {
                for (var i=states.length-1; i>index; i--) {
                    states.pop();
                }
                return states[index];
            },

            getStates: function() {
                return states;
            },

            getState: function(index) {
              return states[index];
            },

            removeAllStates: function() {
                states.length = 0;
            },

            /* per recuperare l'indice di un certo stato; ritorna -1 se non trovato */
            //todo: da rivedere i parametri
            getStateIndex: function(type, id) {
                var index = -1;
                for (var key in states) {
                    if (states[key].params.searchType == type && states[key].id == id) {
                        index = key;
                        break;
                    }
                }
                return index;
            },

            getLastState: function() {
                return states[states.length-1];
            }
        }
    }]);