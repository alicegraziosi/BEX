myApp.controller('CitationsFiltersController', ["CitationsFiltersManagerService", "$scope", "$rootScope", "FILTERS_TYPE", function(CitationsFiltersManagerService, $scope, $rootScope, FILTERS_TYPE) {
    var self = this;

    /* filters and order objs: oggetti {value: ...} di filterManagerService */ //'F' -> convenzione per Filter
    self.publicationYearF = CitationsFiltersManagerService.getStartingPublicationYearF();
    self.selfcitationsF = CitationsFiltersManagerService.getSelfCitationsF();
    self.characterizationsF = CitationsFiltersManagerService.getCharacterizationsF();
    self.authorsF = CitationsFiltersManagerService.getAuthorsF();        //con questo prendo la lista di autori del filtro
    self.allAuthors = $rootScope.authors;
    self.selectedAuthor = ""; //
    self.authorAlreadyInList = false;
    self.inputNotValid = false;

    var date = new Date();
    self.year = date.getFullYear();

	CitationsFiltersManagerService.checkFilters(); //todo: soluzione migliorabile, questo check non dovrebbe essere fatto qui, in teoria
	var activatedFiltersList = CitationsFiltersManagerService.getFilterActivatedList();

    /* values: valori dei filtri in html */ //'V' -> convenzione per Value
    self.publicationYearV = self.publicationYearF.value;
    self.selfcitationsV =  self.selfcitationsF.value;
    self.excludeSelfcitationsV = self.selfcitationsF.exclude;
    self.characterizationsV = self.characterizationsF.value;
    self.authorsV = self.authorsF.value;

    /* checkboxes filters*/
	function checkActivatedFilters() {
		self.checkYear = activatedFiltersList.indexOf(FILTERS_TYPE.Citations_afterYear) != -1;
		self.checkSelfcitations  = activatedFiltersList.indexOf(FILTERS_TYPE.Citations_selfCitations) != -1;
		self.checkAuthors = activatedFiltersList.indexOf(FILTERS_TYPE.Citations_authors) != -1;
		self.checkCharacterizations = activatedFiltersList.indexOf(FILTERS_TYPE.Citations_functions) != -1;
		//self.checkCharacterizations = activatedFiltersList.indexOf(FILTERS_TYPE.Citations_functions_exclude) != -1;
	}

	checkActivatedFilters();

    //todo: rifattorizzare
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        CitationsFiltersManagerService.checkFilters();  //todo: soluzione migliorabile, questo check non dovrebbe essere fatto qui, in teoria
	    checkActivatedFilters();
	    self.publicationYearV = self.publicationYearF.value;
	    self.authorsV = self.authorsF.value;
    })

    /* funzioni invocate all'interazione con i filtri */

    self.setColorsAllChecked = function(bool) {

        for (var i in self.characterizationsV) {
            self.characterizationsV[i].checked = bool;
	        CitationsFiltersManagerService.switchColorChecked(self.characterizationsV[i]);
        }
    }

    self.switchColorsFilter = function() {
        if (self.checkCharacterizations) {
	        //CitationsFiltersManagerService.addActivatedFilter(FILTERS_TYPE.Citations_functions_exclude);
	        CitationsFiltersManagerService.setCharacterizations(self.characterizationsV);
	        CitationsFiltersManagerService.addActivatedFilter(FILTERS_TYPE.Citations_functions);
        } else {
	        self.setColorsAllChecked(true);
	        //CitationsFiltersManagerService.removeActivatedFilter(FILTERS_TYPE.Citations_functions_exclude);
	        CitationsFiltersManagerService.setCharacterizations(self.characterizationsV);
	        CitationsFiltersManagerService.removeActivatedFilter(FILTERS_TYPE.Citations_functions);

        }

        CitationsFiltersManagerService.setFilterActivated(self.checkCheckboxes());
    }

	self.switchColorChecked = function (color) {
		CitationsFiltersManagerService.switchColorChecked(color);
	}

    self.switchYearFilter = function() {
        if (self.checkYear) {
	        CitationsFiltersManagerService.addActivatedFilter(FILTERS_TYPE.Citations_afterYear);
        } else {
	        CitationsFiltersManagerService.removeActivatedFilter(FILTERS_TYPE.Citations_afterYear);
        }
        CitationsFiltersManagerService.setFilterActivated(self.checkCheckboxes());
    }

    self.switchSelfcitations = function() {
        if (self.checkSelfcitations) {
            //console.log('filtro solo autocitazioni attivato');
            self.selfcitationsV = true;
	        CitationsFiltersManagerService.addActivatedFilter(FILTERS_TYPE.Citations_selfCitations);
        } else {
            //console.log('filtro solo autocitazioni disattivato');
            self.selfcitationsV = false;
	        CitationsFiltersManagerService.removeActivatedFilter(FILTERS_TYPE.Citations_selfCitations);
        }
        CitationsFiltersManagerService.setSelfCitations(self.selfcitationsV,self.excludeSelfcitationsV);
        CitationsFiltersManagerService.setFilterActivated(self.checkCheckboxes());
    }

    self.switchAuthors = function() {
        if (self.checkAuthors) {
            //console.log('filtro autori attivato');
            CitationsFiltersManagerService.setAuthorsEnabled(true);
	        CitationsFiltersManagerService.addActivatedFilter(FILTERS_TYPE.Citations_authors);
        } else {
            //console.log('filtro autori disattivato');
            CitationsFiltersManagerService.setAuthorsEnabled(false);
	        CitationsFiltersManagerService.removeActivatedFilter(FILTERS_TYPE.Citations_authors);
        }
        CitationsFiltersManagerService.setFilterActivated(self.checkCheckboxes());
    }



    /* controlla lo stato delle checkboxes: se c'è almeno un filtro attivo ritorna true, false altrimenti */
    //chiunque legga mi scusi, non ho resistito alla tentazione di chiamarla così
    self.checkCheckboxes = function() {
        if (self.checkYear || self.checkSelfcitations || self.checkCharacterizations || self.checkAuthors) {
            //console.log("c'è almeno un filtro impostato");
            return true;
        }
        return false;
    }

    /* applica il filtro per l'anno */
    self.applyYearFilter = function() {
        CitationsFiltersManagerService.setStartingPublicationYear(self.publicationYearV);
    }

    //todo: controlli da rivedere
    self.updateAuthorFilter = function() {
        if (alreadyInList(self.selectedAuthor)) {
            self.authorAlreadyInList = true;
            console.log("autore già in lista")
        } else if (!validInput(self.selectedAuthor)) {
            self.inputNotValid = true;
            console.log("input non valido")
        } else {
            self.inputNotValid = false;
            self.authorAlreadyInList = false;
            self.authorsV.push(self.selectedAuthor);
            CitationsFiltersManagerService.setAuthors(self.authorsV);
        }
    }

    self.removeAuthorFromFilter = function(author) {
        for (var i in self.authorsV) {
            if (self.authorsV[i] == author) {
                self.authorsV.splice(i, 1);

            }
        }
        CitationsFiltersManagerService.setAuthors(self.authorsV);
    }

    //todo: da rifattorizzare, non è il massimo dell'eleganza
    //excludeRadio = true se invocato da radioButton exclude
    self.checkExcludeSelfCitations = function(excludeRadio) {
        if (excludeRadio && self.excludeSelfcitationsV) {
            return true;
        } else if (excludeRadio && !self.excludeSelfcitationsV) {
            return false;
        } else if (!excludeRadio && self.excludeSelfcitationsV) {
            return false;
        } else if (!excludeRadio && !self.excludeSelfcitationsV) {
            return true;
        }
    }

    /* applica il filtro autocitazioni */
    self.switchExcludeSelfcitations = function(exclude) {
        self.excludeSelfcitationsV = exclude;
        CitationsFiltersManagerService.setSelfCitations(true,self.excludeSelfcitationsV);
    }

	self.noCamelCase = function(str) {
		return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
	}

    var alreadyInList = function(author) {
        for (var i in self.authorsV) {
            if (self.authorsV[i] == author) {
                return true;
            }
        }
        return false;
    }

    var validInput = function(text) {
        //essendoci typeahead-editable="false", se non si seleziona un autore dalla lista, text (selected) == undefined
        return angular.isDefined(text) && text != "";
    }
}]);