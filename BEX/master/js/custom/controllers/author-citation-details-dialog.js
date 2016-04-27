/*
    Da article-item.js riceve come parametri:

    data: {
        articles: $scope.articles,
        citDonutChartId: "donut_chart",
        citStackedChartId: "stackedColumn_chart"
    }
*/


myApp.controller('AuthorCitationDetailsDialogController', ["$scope", "$rootScope", function($scope, $rootScope) {
    var colorsMap = $rootScope.colorsMap;

    /* quante cit di tipo color ci sono state nell'anno year */
    var calcNumCites = function(year, color, citInfo) {
        var tmpObj;
        var num = 0;
        //per ogni articolo citante
        for (var key in citInfo) {
            tmpObj = citInfo[key]
            // se il citing article è stato pubblicato nell'anno year e ha citato per il motivo color
            if (tmpObj.citingPubYear == year && tmpObj.color == color) {
                num++; //allora incremento il numero di citazioni di tipo color per quell'anno
            }
        }

        return num;
    }


    /* per ogni anno Y in years, quante volte c'è una citazione di tipo color per l'anno Y in citInfo*/
    var calcDataPoints = function(years, color, citInfo) {
        var datapoints = [];
        var year;

        for (var i=0; i < years.length; i++) {
            year = years[i];
            var dataPoint = {
                label: year,
                y: calcNumCites(year, color, citInfo) //quante cit di tipo color ci sono state nell'anno year
            }

            datapoints.push(dataPoint);
        }

        return datapoints;
    }

    /* per ottenere i dati sulle citazioni nel formato richiesto per il donut chart */
    var parseDataForDonutChart = function(citInfo) {
        var colorsDuplicate = [];
        var data = [];
        var tmpLbl;
        var prev = "";

        for (var key in citInfo) {
            colorsDuplicate.push(citInfo[key].color);
        }
        colorsDuplicate.sort();

        for (var i=0; i<colorsDuplicate.length; i++) {
            tmpLbl = colorsDuplicate[i];
            if ( tmpLbl !== prev) {
                data.push({
                    indexLabel: tmpLbl,
                    y: 1,
                    toolTipContent: "{indexLabel}: {y}",
                    color: getColor(tmpLbl)
                });
            } else {
                data[data.length-1].y++;
            }

            prev = tmpLbl;
        }

        return data;
    }

    // todo: da cambiare: funzione provvisoria per trovare colore hex associato a label
    var getColor = function(colorLbl) {
        for (key in colorsMap) {
            if (colorsMap[key]["toString"] === colorLbl) {
                return colorsMap[key].color;
            }
        }

    }

    /* per ottenere i dati sulle citazioni nel formato richiesto per lo stacked column chart */
    var parseDataForStackedColumnChart = function(citInfo) {

        var colors = [];
        var colorsDuplicate = [];
        var tmpColor;
        var prev = "";

        //estraggo tutti i colori
        for (var key in citInfo) {
            colorsDuplicate.push(citInfo[key].color);
        }
        colorsDuplicate.sort(); //ordino

        //elimino i duplicati
        for (var i=0; i < colorsDuplicate.length; i++) {
            tmpColor = colorsDuplicate[i];
            if (tmpColor !== prev) {
                colors.push(tmpColor);
            }
            prev = tmpColor;
        }

        var years = [];
        var yearsDuplicate = [];
        var tmpYear;
        var prevYear = 0;

        //estraggo tutti gli anni
        for (var key in citInfo) {
            yearsDuplicate.push(citInfo[key].citingPubYear);
        }
        yearsDuplicate.sort(function(a, b){return a-b}); //ordino


        //elimino i duplicati
        for (var i=0; i < yearsDuplicate.length; i++) {
            tmpYear = yearsDuplicate[i];
            if (tmpYear !== prevYear) {
                years.push(tmpYear);
            }
            prevYear = tmpYear;
        }

        //console.log(years)

        // ho valori per l'asse x (years) e label (colors)

        var data = [];

        // per ogni colore vado a calcolare quante citazioni di quel tipo ci sono state ogni anno (anno di pubblicazione dell'articolo citante)
        for (var key in colors) {
            var dataItem = {
                type: "stackedColumn",
                name: colors[key],
                showInLegend: true,
                dataPoints: calcDataPoints(years, colors[key], citInfo),
                color: getColor(colors[key])
            }

            data.push(dataItem);
        }

        return data;
    }

    var renderCitStackedChart = function(citationsInfo) {
        // parsing dei dati da visualizzare
        var citData = parseDataForStackedColumnChart(citationsInfo);
        citData.push({}); //mia soluzione per risolvere un bug della libreria: aggiungendo un oggetto vuoto, i colori rispondono come dovrebbero nel caso di un solo tipo di citazione
        //console.log(citData);

        //configura il column stacked chart
        var chart = new CanvasJS.Chart("stacked_chart",
            {
                axisY: { title: "cit"},
                toolTip: { shared: "true"},
                legend: {
                    fontSize: 20,
                    fontFamily: "sans-serif"
                },
                //height: 200,
                //width: 350,
                //backgroundColor: "#EBECED",
                animationEnabled: true,
                animationDuration: 2000,
                data: citData
            });

        // visualizza il donut
        chart.render();
    }

    var renderCitDonutChart = function(citationsInfo) {
        // parsing dei dati da visualizzare
        var citData = parseDataForDonutChart(citationsInfo);

        //configura il donut
        var chart = new CanvasJS.Chart( "donut_chart",
            {
                //height: 170,
                //width: 350,
                //backgroundColor: "#EBECED",
                animationEnabled: true,
                animationDuration: 2000,
                data: [
                    {
                        type: "doughnut",
                        startAngle:  -90,
                        indexLabelFontSize: 15,
                        dataPoints: citData
                    }
                ]
            });

        // visualizza il donut
        chart.render();
    }


    /*$scope.$on('ngDialog.opened', function () {

        var aggregateCitationInfo;
        angular.forEach($scope.ngDialogData.articles, function(value,index){
            aggregateCitationInfo += value.citationsInfo;
        })

        angular.forEach($scope.ngDialogData.articles, function(value,index){
            if(index =="2"){
            renderCitDonutChart(value.citationsInfo);
            renderCitStackedChart(value.citationsInfo);
        }
        })
        //renderCitDonutChart($scope.ngDialogData.articles[2].citationsInfo);
        //renderCitStackedChart($scope.ngDialogData.articles[2].citationsInfo);
    });*/

    
    $scope.$on('ngDialog.opened', function () {
        renderCitDonutChart($scope.ngDialogData.articleData.citationsInfo);
        renderCitStackedChart($scope.ngDialogData.articleData.citationsInfo);
    });

}]);