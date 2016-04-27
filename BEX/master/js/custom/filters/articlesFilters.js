myApp
    .filter('afterYear', function () {
        return function (items, year) {

            // i seguenti check sono fatti per motivi di stabilità ed efficienza (todo: meglio se i filtri vengono usati nei controller)
            if (!angular.isUndefined(items) && !angular.isUndefined(year) && angular.isArray(items) ) {
                var filtered = [];
                var item;
                for (var i=0; i<items.length; i++) {
                    item = items[i]
                    if (item.publicationYear >= year) {
                        filtered.push(item);
                    }
                }
                return filtered;
            }

            return items; //se le condizioni dell'if non sono verificate, ritorno l'input (potrebbe essere undefined) originale
        };
    })
    .filter('selfcitation', function () {
        return function (items, selfcitations, exclude) {
            if (selfcitations == false) {
                return items;
            } else {
                if (!angular.isUndefined(items) && !angular.isUndefined(selfcitations)) {
                    var filtered = [];
                    var item;

                    //todo: da rifattorizzare
                    switch(exclude) {
                        case true:  //escludere le autocitazioni
                            for (var i=0; i<items.length; i++) {
                                item = items[i];


                                if (item.isSelfcitation == false) {
                                    filtered.push(item);
                                }
                            }
                            return filtered;
                            break;
                        case false: //mostrare solo le autocitazioni
                            for (var i=0; i<items.length; i++) {
                                item = items[i];


                                if (item.isSelfcitation == true) {
                                    filtered.push(item);
                                }
                            }
                            return filtered;
                            break;
                    }

                }

                return items; //se le condizioni dell'if non sono verificate, ritorno l'input (potrebbe essere undefined) originale
            }


        };
    })
    .filter('characterizations', function () {
        return function (items, colorsList) {
            if (!angular.isUndefined(items) && !angular.isUndefined(colorsList)) {
                var filtered = [];
                var item;
                var citActsInfo;
                for (var i in items) {    //per ogni item della bibliogrfia
                    item = items[i];
                    citActsInfo = item.citActsInfo;
                    //@todo: soluzione tampone: per come è strutturato attualmente il dataset, potrebbero esserci cito:cites che non hanno nessun citationAct associato
                    // quindi non si possono avere informazioni sui colori delle citazioni, quindi di default l'elemento bibliografico non verrebbe
                    // mostrato perchè il filtro sui colori (questo) lo escluderebbe da filtered
                    // con questo controllo, faccio in modo che l'elemento bibliografico senza info sui colori sia sempre incluso in filtered....soluzione temporanea
                    if ( !angular.isUndefined(citActsInfo) && citActsInfo.length > 0) {
                        for (var j in citActsInfo) {        //per ogni info citazionale
                            if (colorsList[citActsInfo[j].colorURI].checked == true) {     //se il colore dell'atto citazionale è "attivo" (true) in colorsList
                                filtered.push(item); //vuol dire che nell'item bibliografico c'è almeno una citazione di un colore che mi interessa, quindi l'item bibliografico è da mostrare
                                break; //fondamentale questo break, altrimenti nel filtered ci potrebbe finire più volte lo stesso elemento
                            }
                        }
                    } else {
                        filtered.push(item);
                    }

                }
                return filtered;
            }

            return items; //se le condizioni dell'if non sono verificate, ritorno l'input (potrebbe essere undefined) originale
        }
    })
    .filter('authors', function () {
        //enabled mi dice se devo filtrare i risultati....lo uso per non dovermi portare dietro un array di più di 900 autori nel widget dei filtri
        return function (items, authorsList, enabled) {
            if (!angular.isUndefined(items) && !angular.isUndefined(authorsList) && enabled) {
                var filtered = [];
                var item;
                var authors;
                for (var i in items) {    //per ogni item della bibliogrfia
                    item = items[i];
                    authors = item.authors;
                    for (var j in authors) {        //per ogni info citazionale
                        if (authorsList.indexOf(authors[j].fullName) > -1) {     //se in authorsList (lista degli autori da filtrare) c'è (almeno) un autore dell'elemento
                            filtered.push(item); //vuol dire che l'item bibliografico ha tra gli autori (almeno) uno di quelli che si vuole filtrare
                            break; //fondamentale questo break, altrimenti nel filtered ci potrebbe finire più volte lo stesso elemento
                        }
                    }
                }
                return filtered;
            }

            return items; //se le condizioni dell'if non sono verificate, ritorno l'input (potrebbe essere undefined) originale
        }
    })
    .filter('articleType', function () {
        return function (items, articleTypes) {
            if (!angular.isUndefined(items) && !angular.isUndefined(articleTypes)) {
                var filtered = [];
                var item;
                var type;
                for (var i in items) {    //per ogni item della bibliogrfia
                    item = items[i];
                    type = item.type;
                    //todo: type potrebbe essere temporaneamente non definito, quindi di default l'articolo senza type viene aggiunto a filtered
                    if ( !type || articleTypes.indexOf(type) != -1) {
	                    filtered.push(item);
                    }

                }
                return filtered;
            }

            return items; //se le condizioni dell'if non sono verificate, ritorno l'input (potrebbe essere undefined) originale
        }
    })