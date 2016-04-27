### un readme per me stesso per alcuni task noiosi, ripetitivi e/o complessi ...si potrebbe pensare di creare un task gulp (da valutare)###

### Nuovo stato + View + Controller + sidebar item

- creare nuova view in app/views
- aggiungere state in master/js/custom/custom.js
- aggiungere relativo controller in js/custom/controllers
- nuovo oggetto in server/sidebar-menu.json

### Nuovo filtro bibliografia ###

- in articlesFilters.js aggiungere nuovo filtro in articlesFilters.js (optional)
- in citations-filters-manager.js aggiungere un oggetto e assegnare alla property "value" il valore di default del nuovo filtro
- in citations-filters-manager.js aggiungere un getter e un setter (il getter ritorna l'oggetto, il setter imposta il valore di value)
- in articles-results.js aggiungere una nuova variabile per il valore del filtro: esso verrà preso dalla factory citations-filters-manager.js
- in article-item.js definire un nuovo attributo oggetto "=" (o altro in base al caso): verrà usato per passare all'articleItem il valore del filtro
- in articles-results.html, passare alla direttiva article-item, attraverso il nuovo attributo (attenzione: gobba di cammello diventa trattino) il valore del nuovo filtro nella forma: ArticlesResultsCtrl.nomeVarFiltro
- in article-item.html, nel ng-repeat della direttiva biblio-item usare il nuovo filtro passando come parametro il valore (property "value") dell'oggetto delll'attributo prima definito (trattino diventa gobba di cammello)
- in citations-filters-offsidebar.js aggiungere variabili e funzioni necessarie
- in citations-filters-offsidebar.js, per settare il valore del filtro, usare il relativo setter di CitationsFiltersManagerService
- in citations-filters-offsidebar.js aggiungere una condizione nell'if di checkCheckboxes()
- in filters-offsidebar.html aggiungere gli elementi necessari
