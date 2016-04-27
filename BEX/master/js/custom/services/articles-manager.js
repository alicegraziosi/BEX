/**=========================================================
 * module: articles-manager.js
 * servizio per gestire gli articoli
 =========================================================*/
'use strict';

myApp
    .factory('ArticleManagerService', ["RequestArticlesService", "CitationsFiltersManagerService",
                                       "ArticlesInfoService", "StatesManagerService", "AuthorInfoService",
                                       "ngDialog", "$rootScope", "$sessionStorage", "SEARCH_TYPE",
                                       "ARTICLE_TYPES",
            function(RequestArticlesService, CitationsFiltersManagerService,
                ArticlesInfoService, StatesManagerService, AuthorInfoService, ngDialog, $rootScope,
                $sessionStorage, SEARCH_TYPE, ARTICLE_TYPES) {

        var articlesResults = [];

        if (!$sessionStorage.searchResults) {
            $sessionStorage.searchResults = [];
        }

        //todo: da spostare
        var colorsMap = $rootScope.colorsMap;
        var isRetrievingArticlesInfo = false;               // indica se è in atto un'interrogazione a fuseki per avere le info sugli articoli (risultati di ricerca)
        var articlesNum = 0;                                // numero totale di articoli di cui richiedere le info
        var completedArticles = 0;     // numero di richieste completate = numero di articoli nella lista degli articoli...semplice
        //todo: non è la migliore delle soluzioni, valutare alternative
        var resultsStates = {                                      // stati dei risultati
            "NOT_AVAILABLE" : 0,    // non disponibili, non ancora richiesti: non è ancora partita una richiesta o arrivata una risposta dall'abstract finder
            "RESULTS" : 1,          // sono presenti dei risultati
            "NO_RESULTS" : 2        // non sono presenti risultati
        }
        var articlesResultsState = resultsStates.NOT_AVAILABLE;    // in che stato si trovano i risultati di ricerca


        /* utility per convertire la stringa in int */
        var stringToInt = function(str) {
            //se obj è una stringa lo converte in numero; so già che è una stringa, ma non si sa mai...
            if (angular.isString(str)) {
                return parseInt(str);
            }

            return str;
        };

        /* ottiene il tipo di articolo dal suo URI */
        var getType = function(articleData) {
            ArticlesInfoService.getArticleType(articleData.expression.value).then(
                function (response) {
                    if (response.data.results.bindings[0]) {
                        var type = response.data.results.bindings[0].type.value;
                        switch (type) {
                            case "http://purl.org/spar/fabio/JournalArticle":
                                articleData.type = ARTICLE_TYPES.JournalArticle;
                                break;
                            case "http://purl.org/spar/fabio/ConferencePaper":
                                articleData.type =  ARTICLE_TYPES.ConferencePaper;
                                break;
                            case "http://purl.org/spar/fabio/JournalReviewArticle":
                                articleData.type =  ARTICLE_TYPES.JournalReviewArticle;
                                break;
                            case "http://purl.org/spar/fabio/JournalEditorial":
                                articleData.type =  ARTICLE_TYPES.JournalEditorial;
                                break;
                            case "http://purl.org/spar/fabio/Letter":
                                articleData.type =  ARTICLE_TYPES.Letter;
                                break;
                            default:
                                articleData.type = ARTICLE_TYPES.Article;
                        }
                    } else {
                        articleData.type = ARTICLE_TYPES.Article;
                    }

                },
                //todo caso da gestire meglio
                function (errResponse) {
                    console.error("Error. " + errResponse.status + ": " + errResponse.statusText)
                }
            );

        };

        /* calcola il numero di atti citazionali da un articolo ad un altro */
        var countNumCitActs = function(citActsInfo) {
            var count = 0;
            for (var i in citActsInfo) {
                count += citActsInfo[i].numCitActs;
            }

            return count;
        }

        /* converte uri colore citazione in stringa facilmente leggibile */
        var mapColorToString = function(colorURI) {
            return colorsMap[colorURI].toString;
        }

        /* per raggruppare gli atti citazionali per colore */
        var groupCitActsInfo = function(citActsInfo) {
            var groupedCitActInfo = [];

            for (var key in citActsInfo) {
                citActsInfo[key].colorURI = citActsInfo[key].color.value;
                citActsInfo[key].color = mapColorToString(citActsInfo[key].color.value);
            }

            citActsInfo.sort(function compare(a,b) {
                if (a.color < b.color)
                    return -1;
                if (a.color > b.color)
                    return 1;
                return 0;
            });

            var tmpInfo;
            var prev = {color: ""};

            for (var i=0; i<citActsInfo.length; i++) {
                var tmpInfo = citActsInfo[i];
                if ( tmpInfo.color !== prev.color) {
                    groupedCitActInfo.push({
                        colorURI: tmpInfo.colorURI,
                        color: tmpInfo.color,
                        numCitActs: 1,
                        inTextRefPointers: [{
                            irpTxt: tmpInfo.irpTxt.value,
                            sentenceTxt: tmpInfo.sentenceTxt.value
                        }]
                    });
                } else {
                    groupedCitActInfo[groupedCitActInfo.length-1].numCitActs++;
                    groupedCitActInfo[groupedCitActInfo.length-1].inTextRefPointers.push({
                        irpTxt: tmpInfo.irpTxt.value,
                        sentenceTxt: tmpInfo.sentenceTxt.value
                    });
                }

                prev = tmpInfo;
            }
            return groupedCitActInfo;
        }

        /* per le info sui citation acts di un certo item X della bibliografia:  per ogni elemento della bibliografia, quante volte X è citato dal citingEntity per un certo motivo*/
        var getBiblioItemCitActsInfo = function(citingEntityExpression, biblioItem) {
            //I param: citing entity - II param: cited entity
            ArticlesInfoService.getCitationActsInfoNotGrouped(citingEntityExpression, biblioItem.citedExpression.value).then(
                function (response) {
                    var citActsInfoNotGrouped = response.data.results.bindings;
                    biblioItem.citActsInfo = groupCitActsInfo(citActsInfoNotGrouped);
                    biblioItem.totCitActs = countNumCitActs(biblioItem.citActsInfo);
                },
                //todo caso da gestire meglio
                function (errResponse) {
                    console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                }
            );
        }

        //todo: da migliorare
        var noData = function(res,resSetP,resultsP) {
            return  res.data == "" || !res.data[resSetP][resultsP] ;
        }

        /* cerca autori in comune tra l'articolo dei risultati di ricerca e il citato/citante:
         * - se ce n'è almeno uno allora si tratta di una autocitazione
         * - il nome di ogni autore condiviso viene aggiunto ad un array: verrà poi usato per evidenziare gli autori condivisi nel subItem*/
        var setSelfcitationInfo = function(subItem, citingArticleAuthors) {
            //fixme: potenziale problema di sincronizzazione: vengono confrontati gli autori del subItem con gli autori dell'articolo citante,
            // ma questi ultimi sono il risultato di una chiamata asincrona, quindi in teoria potrebbero non essere ancora disponibili quando si effettuano i controlli
            // per il momento se si verifica un caso del genere non faccio nessun confronto e notifico il problema, per questo il seguente if
            // prima idea per risolvere: se non ci sono i citingArticleAuthors, chiederli qui
            if(citingArticleAuthors !== undefined && subItem.authors !== undefined) {
                subItem.sharedAuthors = [];
                subItem.isSelfcitation = false;
                var tmpAuthor;

                for (var bIndex in subItem.authors) {
                    tmpAuthor = subItem.authors[bIndex];

                    for (var index in citingArticleAuthors) {

                        if (citingArticleAuthors[index].fullName === tmpAuthor.fullName) {
                            subItem.isSelfcitation = true; //si, lo reimposto a true più volte, non dovrebbe essere un problema
                            subItem.sharedAuthors.push(tmpAuthor.fullName);
                        }
                    }
                }
            } else {
                alert("Non è stato possibile stabilire se '"+subItem.title+"' sia una autocitazione");
            }
        }

        /* per recuperare gli autori di un articolo dei risultati di ricerca */
        var getArticleAuthors = function(article) {
            ArticlesInfoService.getArticleAuthors(article.authorsList.value).then(
                function (response) {
                    article.authors = response.data.results.bindings;
                    for (var i in article.authors) {
                        article.authors[i].fullName = article.authors[i].fullName.value;
                    }

                },
                //todo caso da gestire meglio
                function (errResponse) {
                    console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                }
            );
        }

        /* per la lista degli autori di un certo subItem
        * subItem: articolo citato o citante dall'/l' articolo dei risultati di ricerca*/
        //I param: subItem, II param: array autori articolo citante/citato, III param: true se gli autori vanno aggiunti alla lista degli autori per i filtri; II param serve per capire se si tratta di autocitazione
        var getSubItemAuthors = function(subItem, resultArticleAuthors, addToFilterAuthors) {
            ArticlesInfoService.getArticleAuthors(subItem.authorsList.value).then(
                function (response) {
                    subItem.authors = response.data.results.bindings;
                    for (var i in subItem.authors) {
                        subItem.authors[i].fullName = subItem.authors[i].fullName.value;

                        //per aggiungere l'autore alla lista degli autori per il filtro
                        //if (addToFilterAuthors) {
                        //    CitationsFiltersManagerService.addAuthor( subItem.authors[i].fullName);
                        //}
                    }

                    setSelfcitationInfo(subItem, resultArticleAuthors);
                },
                //todo caso da gestire meglio
                function (errResponse) {
                    console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                }
            );
        };

        var getInTextRefPointers = function(color, citingExp, citationsInfo) {
            var inTxtRefPointers = [];

            for (var key in citationsInfo) {
                if (citationsInfo[key].citingExp.value == citingExp && citationsInfo[key].color == color) {
                    inTxtRefPointers.push({
                        irpTxt: citationsInfo[key].irpTxt,
                        sentenceTxt: citationsInfo[key].sentenceTxt
                    });
                }
            }

            return inTxtRefPointers;
        }

        var setCitingArticleMotivations = function(citingArticle, citationsInfo) {
            //todo: questa funzione si può scrivere meglio, lo so....

            citingArticle.motivations = [];

            var colorsDuplicate = [];
            var tmpColor;
            var prev = "";
            var tmpC;
            var colors = [];

            // prendo tutti i colori per citing article cita
            for (var key in citationsInfo) {
                //se l'expression (citing entity) del citation act che sto considerando == l'expression dell'articolo di cui voglio sapere i motivi citazionali
                if (citationsInfo[key].citingExp.value == citingArticle.citingExp.value) {
                    colorsDuplicate.push(citationsInfo[key].color); //allora lo aggiungo alla lista
                }

            }
            colorsDuplicate.sort();


            // creo una lista di motivations con i colori unici
            for (var i=0; i<colorsDuplicate.length; i++) {
                tmpC = colorsDuplicate[i];
                if ( tmpC !== prev) {
                    citingArticle.motivations.push({
                        colorStr: tmpC,
                        inTextRefPointers : getInTextRefPointers(tmpC, citingArticle.citingExp.value, citationsInfo)
                    });
                }

                prev = tmpC;
            }

            //console.log(citingArticle.motivations);
        }

        /* per ottenere le info sugli articoli citanti, presi singolarmente */
        // expression: expression del citedArticle
        // citedArticleAuthors: lista degli autori dell'articolo citato, mi serve per vedere se ce ne sono di condivisi
        // citationsInfo: oggetto { citingExpression, annoPubCitingArticle, colore, irpTxt, sentenceTxt } per ogni citazione verso l'articolo citato, quindi con expression potenzialmente duplicati
        var getCitingArticles = function(citedArticle, expression, citedArticleAuthors, citationsInfo) {
            //todo controllare che articlesResults sia definito

            return ArticlesInfoService.requestCitingArticles(expression).then(
                // success
                function(response) {
                    citedArticle.citingArticles = response.data.results.bindings;

                    //per ogni articolo citante
                    for (var j in citedArticle.citingArticles) {
                        var citingArticle = citedArticle.citingArticles[j];
                        citingArticle.publicationYear = parseInt(citingArticle.publicationYear.value);
	                    citingArticle.globalCitations = stringToInt(citingArticle.globalCountValue.value);
	                    citingArticle.title = citingArticle.title.value;
                        getSubItemAuthors(citingArticle, citedArticleAuthors, false);  //prendo gli autori e controllo se ce ne sono di condivisi con l'articolo citato
                        setCitingArticleMotivations(citingArticle, citationsInfo);           //per ogni articolo prendo i motivi per cui cita
                    }
                },

                // error
                //todo caso da gestire meglio
                function(errResponse) {
                    console.error("Error while fetching articles. "+errResponse.status+": "+errResponse.statusText);
                }
            );
        }


        var addArticle = function(workValue, sessionSearchResults) {
            //@guide richiedo le info generali sull'articolo interrogando fuseki
            ArticlesInfoService.getArticleGeneralInfo(workValue).then(

                // http://stackoverflow.com/questions/939032/jquery-pass-more-parameters-into-callback
                function (response) {
                    var articleData = response.data.results.bindings[0];
                    articleData.publicationYear = stringToInt(articleData.publicationYear.value);
                    articleData.title = articleData.title.value;
	                articleData.doi = articleData.doi.value;

                    articleData.globalCitations = stringToInt(articleData.globalCountValue.value);

                    /* properties per check presenza dettagli su citazioni e bibliografia, inizialmente non presenti, quindi = false*/
                    articleData.citationsDetails = false;
                    articleData.biblioDetails = false;

                    /* x il sistema di bookmarking */
                    articleData.bookmark = false;

                    //@guide richiedo la lista degli autori
                    getArticleAuthors(articleData);

                    //@guide richiedo la tipologia di articolo
                    getType(articleData);

                    //@guide richiedo le info sulle citazioni (in entrata)
                    ArticlesInfoService.getArticleIncomingCitationsInfo(articleData.expression.value).then(
                        function (response) {
                            articleData.inCitActs = response.data.results.bindings[0].numCitActs.value; //numero di citation acts "in entrata"
                            articleData.inNumCites = response.data.results.bindings[0].numCites.value;  //numero di cites (<= numero di citation acts), citazioni uniche "in entrata"
                        },
                        //todo caso da gestire meglio
                        function (errResponse) {
                            console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                        }
                    );

	                //@guide richiedo le info sulle citazioni (in uscita)
	                ArticlesInfoService.getArticleOutgoingCitationsInfo(articleData.expression.value).then(
		                function (response) {
			                articleData.outCitActsNum = response.data.results.bindings[0].numCitActs.value; //numero di citation acts "in uscita"
			                articleData.citedArticlesNum = response.data.results.bindings[0].numCites.value;  //numero di articoli citati
		                },
		                //todo caso da gestire meglio
		                function (errResponse) {
			                console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
		                }
	                );

                    articlesResults.push(articleData); //aggiungo l'articolo, questo farà da trigger per il watchCollection nel controller degli articolo e la view si aggiornerà per magia (si aggiorna comunque perchè articlese è passato per riferimento, ma con il watch aggiungo del comportamento )
                    if (sessionSearchResults) {
                        $sessionStorage.searchResults.push(articleData);
                    }

                },

                //todo caso da gestire meglio
                function (errResponse) {
                    console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                }
            );

        }

        var openErrorDialog = function() {
            ngDialog.open({
                template: "app/templates/dialog-error.html",
                controller: ["$rootScope", "$scope", function($rootScope, $scope) {
                }]
            });
        }

		var checkState = function(searchType, id, details) {
			var stateIndex = StatesManagerService.getStateIndex(searchType, id) // indice dello state, -1 se non presente

			if (stateIndex == -1) {
				StatesManagerService.saveState(searchType, id, details);
			} else {
				StatesManagerService.restoreState(stateIndex); //se lo state è già presente, lo recupero ed elimino tutti gli states successivi
			}
		}


        return {
            getArticles: function() {
                return articlesResults;
            },

            getColorsMap: function() {
              return colorsMap;
            },

            isRetrievingArticlesInfo: function() {
              return isRetrievingArticlesInfo;
            },

            setCompletedRetrievingArticlesInfo: function() {
              isRetrievingArticlesInfo = false;
            },

            getArticlesNum: function() {
                return articlesNum;
            },

            getCompletedArticles: function() {
                return completedArticles = articlesResults.length;
            },

            getResultsStates: function() {
                return resultsStates;
            },

            getArticlesResultsState: function() {
                return articlesResultsState;
            },

            getCitationsInfo: function(expression, citedArticleAuthors) {
                //todo controllare che articlesResults sia definito

                return ArticlesInfoService.requestCitationsInfo(expression).then(
                    // success
                    function(response) {
                        var res = response.data.results.bindings;

                        for (var j in res) {
                            res[j].color = colorsMap[res[j].color.value].toString;
                            res[j].citingPubYear = stringToInt(res[j].citingPubYear.value);
                            res[j].irpTxt = res[j].irpTxt.value;
                            res[j].sentenceTxt = res[j].sentenceTxt.value;
                        }

                        //chiede i citing articles per un cited article
                        for (var key in articlesResults) {
                            var tmpArt = articlesResults[key];
                            if (tmpArt.expression.value == expression) {
                                tmpArt.citationsInfo = res;                                           // qui aggiungo le info citazioniali (anni, colori, etc...)
                                tmpArt.citationsDetails = true;
                                getCitingArticles(tmpArt, expression, citedArticleAuthors, res);      // qui aggiungo le info sugli articoli citanti
                                break; //almeno non me lo scorro tutto
                            }
                        }
                    },

                    // error
                    //todo caso da gestire meglio
                    function(errResponse) {

                        console.error("Error while fetching articles. "+errResponse.status+": "+errResponse.statusText)
                    }
                );
            },

            getBiblioInfo: function(citingArticleExpression, citingArticleAuthors) {
                //@guide richiedo le info sulla bibliografia
                /* @guide  parto prima dai cito:cites di un articolo (unici per definizione) in modo da interrogare il dataset
                 * una sola volta per ottenere le info generiche; in seguito chiedo le info sui citation acts (quanti e di che tipo)
                 * relativi ad ogni citazione; così facendo mi risparmio di fare interrogazioni inutili per avere info che già ho (ad esempio titolo e autori).
                 * le info le richiedo una sola volta per ogni cito:cites invece che più volte per ogni citation acts*/
                ArticlesInfoService.requestBiblioInfo(citingArticleExpression).then(
                    function(response){
                        var res = response.data.results.bindings;

                        //@guide per ogni elemento della bibliografia recupero gli autori e le info sui citation acts
                        for (var i in res) {
                            //faccio i seguenti riassegnamenti per facilitare filtri e ordinamenti dei risultati in bibliografia
                            // così le properties non sono più oggetti ma stringhe o numeri
                            //todo: ristrutturazione del'oggetto da eseguire in una funzione
                            res[i].title = res[i].title.value;
                            res[i].publicationYear = stringToInt(res[i].publicationYear.value);
                            res[i].globalCountDate = res[i].globalCountDate.value;
                            res[i].globalCitations = stringToInt(res[i].globalCountValue.value);


                            //metodi utili anche per avere uno scope isolato e non avere problemi con l'indice nelle callback
                            //@guide autori dell'articolo citato
                            getSubItemAuthors(res[i], citingArticleAuthors, true);

                            //@guide info sugli atti citazioni per ogni cito:cites (quante volte un citing entity cita un cited entity per un certo motivo (colore) )
                            getBiblioItemCitActsInfo(citingArticleExpression, res[i]);
                        }

                        for (var key in articlesResults) {
                            var tmpArt = articlesResults[key];
                            if (tmpArt.expression.value == citingArticleExpression) {
                                tmpArt.biblioInfo = res;
                                tmpArt.biblioDetails = true;
                                break; //almeno non me lo scorro tutto
                            }
                        }
                    },

                    //todo caso da gestire meglio
                    function (errResponse) {
                        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                    }
                );
            },


            /* per richiedere i risultati della ricerca per abstract */
            //  RequestArticlesService.searchArticles(searchText) :  call HTTP a http://www.semanticlancet.eu/abstractfinder/
            getArticlesByAbstract: function(searchText, newSearch) {
  	            //todo: da rifattorizzare...creare una funzione unica
  	            if (newSearch) {
    		            StatesManagerService.removeAllStates(); //svuota la lista degli stati
    		            StatesManagerService.saveState(SEARCH_TYPE.abstractSearch, searchText, searchText);
  	            } else {
  		              checkState(SEARCH_TYPE.abstractSearch, searchText, searchText);
  	            }

              return RequestArticlesService.searchArticles(searchText).then(
                  // success
                  function(response) {
                      articlesResults.length = 0;  // svuota l'array degli articoli, attenzione! non usare articlesResults = [] perchè cambia il riferimento
                      $sessionStorage.searchResults.length = 0;

                      var resSet = "http://stanbol.apache.org/ontology/entityhub/query#QueryResultSet";
                      var results = "http://stanbol.apache.org/ontology/entityhub/query#queryResult";
                      var tmpRes = null;  //conterrà gli uri dei work dei risultati (se ci sono risultati)

                      if (noData(response,resSet,results)) {
                          articlesResultsState = resultsStates.NO_RESULTS;  // non ci sono risultati
                          tmpRes = [];
                          RequestArticlesService.setCompletedRequest();  // la richiesta all'abstract finder è conclusa e lo notifico
                      } else {
                          articlesResultsState = resultsStates.RESULTS; // ci sono risultati
                          tmpRes = response.data[resSet][results];  // contiene gli uri dei work degli aricoli
                          articlesNum = tmpRes.length;  // numero totale di articoli di cui richiedere le info
                          completedArticles = articlesResults.length;  // numero di richieste completate = numero di articoli nella lista degli articoli (inizialmente zero)...semplice

                          RequestArticlesService.setCompletedRequest();  //la richiesta all'abstract finder è conclusa e lo notifico

                          isRetrievingArticlesInfo = true; //si notifica che stanno per iniziare le interrogazioni per ottenere le info sugli articoli
                          //@guide per ogni articolo, partendo dal work, richiedo tutte le informazioni generali + info bibliografiche
                          /* @guide: perchè faccio tante chiamate ajax e non una sola?
                           * perchè una query monolitica potrebbe richiedere molto tempo di caricamento, usando un for invece, appena arriva
                           * un articolo, lo aggiungo subito e vedo i risultati aggiornati nella view (grazie al watchCollection)
                           */

                            for (var key in tmpRes) {
                                // i work sono del tipo http://www.semanticlancet.eu/html/1-s2.0-S1570826807000029
                                console.log("**********" + tmpRes[key].value)
                                addArticle(tmpRes[key].value, true);

                                // se sono state richieste le info per tutti gli articoli
                                if (articlesResults.length == tmpRes.length) {
                                    isRetrievingArticlesInfo = false;
                                }
                            }

                        }

                    },

                    // error
                    //todo caso da gestire meglio
                    function(errResponse) {
                        $sessionStorage.searchResults.length = 0;
                        RequestArticlesService.setCompletedRequest(); //la richiesta è conclusa, c'è stato un errore, ma è conclusa
                        openErrorDialog();
                    }
                );
            },

            //per visualizzare le info su un solo articolo
	        //deprecated: titolo di un articolo non è necessriamente univoco
            getSingleArticle: function(artTitle/*, stateVal*/) {
                RequestArticlesService.setPendingRequest(); //todo: in futuro questo dovrà essere evitato
                checkState(SEARCH_TYPE.singleArticle, artTitle, artTitle);



                ArticlesInfoService.getArticle(artTitle).then(
                    function(response) {

                        articlesResults.length = 0;


                        if (response.data.results.bindings.length == 0) {
                            articlesResultsState = resultsStates.NO_RESULTS;           // non ci sono risultati
                            console.log("NO RESULTS!");

                            RequestArticlesService.setCompletedRequest();
                        } else {
                            articlesResultsState = resultsStates.RESULTS;
                            var art = response.data.results.bindings[0];
                            art.publicationYear = stringToInt(art.publicationYear.value);
                            art.title = artTitle;
	                        art.doi = art.doi.value;
                            art.globalCountValue = stringToInt(art.globalCountValue.value);
                            articlesResults.push(art); //aggiungo l'articolo, questo farà da trigger per il watchCollection nel controller degli articolo e la view si aggiornerà per magia (si aggiorna comunque perchè articles è passato per riferimento, ma con il watch aggiungo del comportamento )
                            articlesNum = 1;
                            completedArticles = 1;
                            RequestArticlesService.setCompletedRequest();

                            //@guide richiedo la lista degli autori
                            getArticleAuthors(art);
                            getType(art);

                            //@guide richiedo le info sulle citazioni (in entrata)
                            ArticlesInfoService.getArticleIncomingCitationsInfo(art.expression.value).then(
                                function (response) {
                                    art.inCitActs = response.data.results.bindings[0].numCitActs.value; //numero di citation acts
                                    art.inNumCites = response.data.results.bindings[0].numCites.value;  //numero di cites (<= numero di citation acts), citazioni uniche
                                },
                                //todo caso da gestire meglio
                                function (errResponse) {
                                    console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                                }
                            );

	                        //@guide richiedo le info sulle citazioni (in uscita)
	                        ArticlesInfoService.getArticleOutgoingCitationsInfo(art.expression.value).then(
		                        function (response) {
			                        art.outCitActsNum = response.data.results.bindings[0].numCitActs.value; //numero di citation acts "in uscita"
			                        art.citedArticlesNum = response.data.results.bindings[0].numCites.value;  //numero di articoli citati
		                        },
		                        //todo caso da gestire meglio
		                        function (errResponse) {
			                        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
		                        }
	                        );
                        }


                    },

                    //todo caso da gestire meglio
                    function (errResponse) {
                        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
                    }
                );
                //console.log(">>> STATES:");
                //console.log(StatesManagerService.getStates());

            },

            setArticlesResults: function(stateIndex) {
                var restoredState = StatesManagerService.restoreState(stateIndex);
                angular.copy(restoredState.articles, articlesResults);
                articlesNum = articlesResults.length;
                completedArticles = articlesResults.length;

            },

            ResetSearchResults: function() {
                angular.copy($sessionStorage.searchResults, articlesResults);
                articlesNum = articlesResults.length;
                completedArticles = articlesResults.length;
                StatesManagerService.removeAllStates(); //svuota la lista degli stati
               // StatesManagerService.saveState(ARTICLES_RESULTS.searchResults, $sessionStorage.searchQuery);
            },

            /* per risultati di ricerca a partire dal titolo */
            getArticlesByTitle: function(articleTitle, newSearch) {
                RequestArticlesService.setPendingRequest();  //todo: in futuro questo dovrà essere evitato

	              //todo: da rifattorizzare...creare una funzione unica
  	            if (newSearch) {
  		              StatesManagerService.removeAllStates(); //svuota la lista degli stati
  		                StatesManagerService.saveState(SEARCH_TYPE.titleSearch, articleTitle, articleTitle);
  	            } else {
  		              checkState(SEARCH_TYPE.titleSearch, articleTitle, articleTitle);
  	            }

                return ArticlesInfoService.requestArticlesByTitle(articleTitle).then(
                    // success
                    function(response) {
                        articlesResults.length = 0;  // svuota l'array degli articoli, attenzione! non usare articlesResults = [] perchè crea un altro array
                        $sessionStorage.searchResults.length = 0;
                        var tmpRes = null; //conterrà gli uri dei work dei risultati (se ci sono risultati)
                        if (response.data.results.bindings.length == 0) {
                            articlesResultsState = resultsStates.NO_RESULTS;           // non ci sono risultati
                            console.log("NO RESULTS!");
                            tmpRes = [];

                            RequestArticlesService.setCompletedRequest();
                        } else {
                            articlesResultsState = resultsStates.RESULTS;              // ci sono risultati
                            //console.log("RESULTS!");
                            var articleData = response.data.results.bindings;
                            tmpRes = response.data.results.bindings; //contiene gli uri dei work
                            articlesNum = articleData.length;                        // numero totale di articoli di cui richiedere le info
                            completedArticles = articlesResults.length;         // numero di richieste completate = numero di articoli nella lista degli articoli

                            RequestArticlesService.setCompletedRequest();

                            // work degli articoli: dato dall'abstractFinder
                            //@guide per ogni articolo, partendo dal work, richiedo tutte le informazioni generali + info bibliografiche
                            /* @guide: perchè faccio tante chiamate ajax e non una sola?
                             * perchè una query monolitica potrebbe richiedere molto tempo di caricamento, usando un for invece, appena arriva
                             * un articolo, lo aggiungo subito e vedo i risultati aggiornati nella view (grazie al watchCollection)
                             */
                            for (var key in tmpRes) {

                                addArticle(tmpRes[key].work.value, true);
                                console.log("********" + tmpRes[key].work.value)
                                // se sono state richieste le info per tutti gli articoli
                                if (articlesResults.length == tmpRes.length) {
                                    isRetrievingArticlesInfo = false;
                                }
                            }
                        }

                    },

                    // error
                    //todo caso da gestire meglio
                    function(errResponse) {
                        $sessionStorage.searchResults.length = 0;
                        RequestArticlesService.setCompletedRequest(); //la richiesta è conclusa, c'è stato un errore, ma è conclusa
                        openErrorDialog();
                    }
                );
            },

	        /* per risultati di ricerca a partire dal titolo */
	        getArticlesFromList: function(doisToSplit, newSearch) {
		        RequestArticlesService.setPendingRequest(); //todo: in futuro questo dovrà essere evitato
		        var list = doisToSplit.split($rootScope.paramsTokensDelimiter);
		        //RequestArticlesService.setPendingRequest(); //todo: in futuro questo dovrà essere evitato

		        //todo: da rifattorizzare...creare una funzione unica

		        var x = "List "+Math.floor((Math.random() * 10000) + 1);
		        if (newSearch) {
			        StatesManagerService.removeAllStates(); //svuota la lista degli stati

			        StatesManagerService.saveState(SEARCH_TYPE.list, x, x);
		        } else {
			        checkState(SEARCH_TYPE.list, x, x);
		        }


		        var getArticleByDoi = function(articleDoi) {
			        //todo: rifattorizzare
			        ArticlesInfoService.getArticleByDoi(articleDoi).then(
				        function(response) {

					        if (response.data.results.bindings.length == 0) {
						        articlesResultsState = resultsStates.NO_RESULTS;           // non ci sono risultati
						        console.log("NO RESULTS!");

						        //RequestArticlesService.setCompletedRequest();
					        } else {
						        articlesResultsState = resultsStates.RESULTS;
						        var art = response.data.results.bindings[0];
						        art.publicationYear = stringToInt(art.publicationYear.value);
						        art.title = art.title.value;
						        art.doi = articleDoi;
						        art.globalCountValue = stringToInt(art.globalCountValue.value);
						        articlesResults.push(art); //aggiungo l'articolo, questo farà da trigger per il watchCollection nel controller degli articolo e la view si aggiornerà per magia (si aggiorna comunque perchè articles è passato per riferimento, ma con il watch aggiungo del comportamento )

						        RequestArticlesService.setCompletedRequest();

						        //@guide richiedo la lista degli autori
						        getArticleAuthors(art);
						        getType(art);

						        //@guide richiedo le info sulle citazioni (in entrata)
						        ArticlesInfoService.getArticleIncomingCitationsInfo(art.expression.value).then(
							        function (response) {
								        art.inCitActs = response.data.results.bindings[0].numCitActs.value; //numero di citation acts
								        art.inNumCites = response.data.results.bindings[0].numCites.value;  //numero di cites (<= numero di citation acts), citazioni uniche
							        },
							        //todo caso da gestire meglio
							        function (errResponse) {
								        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
							        }
						        );

						        //@guide richiedo le info sulle citazioni (in uscita)
						        ArticlesInfoService.getArticleOutgoingCitationsInfo(art.expression.value).then(
							        function (response) {
								        art.outCitActsNum = response.data.results.bindings[0].numCitActs.value; //numero di citation acts "in uscita"
								        art.citedArticlesNum = response.data.results.bindings[0].numCites.value;  //numero di articoli citati
							        },
							        //todo caso da gestire meglio
							        function (errResponse) {
								        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
							        }
						        );
					        }


				        },

				        //todo caso da gestire meglio
				        function (errResponse) {
					        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
				        }
			        );
		        }


		        articlesResults.length = 0;
		        $sessionStorage.searchResults.length = 0;
		        articlesNum = list.length;                        // numero totale di articoli di cui richiedere le info
		        completedArticles = articlesResults.length;

		        for (var key in list) {
			        getArticleByDoi(list[key]);
		        }
	        },

	        /* per risultati di ricerca a partire dal DOI*/
            //todo: aggiungere parametro titolo per leggibilità in breadcrumb
	        getSingleArticleByDoi: function(articleDoi, articleTitle){
		        RequestArticlesService.setPendingRequest(); //todo: in futuro questo dovrà essere evitato
		        checkState(SEARCH_TYPE.singleArticleDoi, articleDoi, articleTitle!=""?articleTitle : articleDoi);


		        //todo: rifattorizzare
		        ArticlesInfoService.getArticleByDoi(articleDoi).then(
			        function(response) {

				        articlesResults.length = 0;


				        if (response.data.results.bindings.length == 0) {
					        articlesResultsState = resultsStates.NO_RESULTS;           // non ci sono risultati
					        console.log("NO RESULTS!");

					        RequestArticlesService.setCompletedRequest();
				        } else {
					        articlesResultsState = resultsStates.RESULTS;
					        var art = response.data.results.bindings[0];
					        art.publicationYear = stringToInt(art.publicationYear.value);
					        art.title = art.title.value;
					        art.doi = articleDoi;
					        art.globalCountValue = stringToInt(art.globalCountValue.value);
					        articlesResults.push(art); //aggiungo l'articolo, questo farà da trigger per il watchCollection nel controller degli articolo e la view si aggiornerà per magia (si aggiorna comunque perchè articles è passato per riferimento, ma con il watch aggiungo del comportamento )
					        articlesNum = 1;
					        completedArticles = 1;
					        RequestArticlesService.setCompletedRequest();

					        //@guide richiedo la lista degli autori
					        getArticleAuthors(art);
					        getType(art);

					        //@guide richiedo le info sulle citazioni (in entrata)
					        ArticlesInfoService.getArticleIncomingCitationsInfo(art.expression.value).then(
						        function (response) {
							        art.inCitActs = response.data.results.bindings[0].numCitActs.value; //numero di citation acts
							        art.inNumCites = response.data.results.bindings[0].numCites.value;  //numero di cites (<= numero di citation acts), citazioni uniche
						        },
						        //todo caso da gestire meglio
						        function (errResponse) {
							        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
						        }
					        );

					        //@guide richiedo le info sulle citazioni (in uscita)
					        ArticlesInfoService.getArticleOutgoingCitationsInfo(art.expression.value).then(
						        function (response) {
							        art.outCitActsNum = response.data.results.bindings[0].numCitActs.value; //numero di citation acts "in uscita"
							        art.citedArticlesNum = response.data.results.bindings[0].numCites.value;  //numero di articoli citati
						        },
						        //todo caso da gestire meglio
						        function (errResponse) {
							        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
						        }
					        );
				        }


			        },

			        //todo caso da gestire meglio
			        function (errResponse) {
				        console.error("Error while fetching articles. " + errResponse.status + ": " + errResponse.statusText)
			        }
		        );
			},

            /* per richiedere gli articoli di un autore senza effettuare una ricerca dalla homepage */
            getArticlesByAuthor: function(givenName, familyName) {
                this.getArticlesByFullNameAuthor(givenName+" "+familyName, false);
            },

            /* per mostrare gli articoli di un autore */
            getArticlesByFullNameAuthor: function(fullName, newSearch) {
                RequestArticlesService.setPendingRequest(); //todo: in futuro questo dovrà essere evitato


	            if (newSearch) {
		            StatesManagerService.removeAllStates(); //svuota la lista degli stati
		            //$sessionStorage.searchResults.length = 0;
		            StatesManagerService.saveState(SEARCH_TYPE.authorSearch, fullName, fullName);
	            } else {
		            checkState(SEARCH_TYPE.authorSearch, fullName, fullName);
	            }

                return AuthorInfoService.requestFullNameAuthorArticles(fullName).then(
                    // success
                    function(response) {

                        articlesResults.length = 0; //svuota l'array degli articoli, attenzione! non usare articlesResults = [] perchè crea un altro array


                        var tmpRes = null; //conterrà gli uri dei work dei risultati (se ci sono risultati)
                        if (response.data.results.bindings.length == 0) {
                            articlesResultsState = resultsStates.NO_RESULTS;           // non ci sono risultati
                            console.log("NO RESULTS!");

                            RequestArticlesService.setCompletedRequest();
                        } else {
                            articlesResultsState = resultsStates.RESULTS;
                            tmpRes = response.data.results.bindings;
                            articlesNum = tmpRes.length;    // numero totale di articoli di cui richiedere le info
                            completedArticles = articlesResults.length;         // numero di richieste completate = numero di articoli nella lista degli articoli (inizialmente zero)...semplice
                            RequestArticlesService.setCompletedRequest();       //la richiesta all'abstract finder è conclusa e lo notifico

                            //@guide per ogni articolo, partendo dal work, richiedo tutte le informazioni generali + info bibliografiche
                            /* @guide: perchè faccio tante chiamate ajax e non una sola?
                             * perchè una query monolitica potrebbe richiedere molto tempo di caricamento, usando un for invece, appena arriva
                             * un articolo, lo aggiungo subito e vedo i risultati aggiornati nella view (grazie al watchCollection)
                             */
                            isRetrievingArticlesInfo = true; //si notifica che stanno per iniziare le interrogazioni per ottenere le info sugli articoli
                            for (var key in tmpRes) {

                                console.log("******" + tmpRes[key].work.value);
                                // newSearch = true : è una nuova ricerca dalla homepage, si devono aggiornare i risultati di ricerca e quindi anche sessionStorage.searchArticles
                                // newSearch = false : non è una nuova ricerca dalla homepage, si aggiornano i risultati visualizzati ma non i risultati della prima ricerca (presenti in sessionStorage.searchArticles)
                                addArticle(tmpRes[key].work.value, newSearch);

                                // se sono state richieste le info per tutti gli articoli
                                if (articlesResults.length == tmpRes.length) {
                                    isRetrievingArticlesInfo = false;
                                }
                            }
                        }
                    },

                    // error
                    //todo caso da gestire meglio
                    function(errResponse) {
                        $sessionStorage.searchResults.length = 0;
                        console.error("Error while fetching articles. "+errResponse.status+": "+errResponse.statusText)
                    }
                );
            },

            //todo: soluzione provvisoria, da rivedere e rivalutare
            /* per aggiornare un singolo articolo nella collezione dei risultati di ricerca salvati nel sessionStorage */
            reloadSearchResult: function(newArticleData) {
                for (var key in articlesResults) {
                    if (articlesResults[key].doi == newArticleData.doi) {
	                    articlesResults[key] = newArticleData;
                    }
                }
            }


            //importante! se si modifica articlesResults, non riassegnare altrimenti tutti i $watch non vanno più! modificare usando angular.copy
            //@guide https://docs.angularjs.org/api/ng/function/angular.copy
            //@guide http://stackoverflow.com/questions/17995229/changed-value-on-angularjs-service-not-triggering-watch-within-directive
            /* per aggiornare gli articoli */
            //setArticles: function(newArticles) {
            //    angular.copy(newArticles, articlesResults);
            //},
            //
            ///* aggiunge un articol oalla lista di articoli */
            //addArticle: function(newArticle) {
            //    articlesResults.push(newArticle);
            //}
        }
    }]);
