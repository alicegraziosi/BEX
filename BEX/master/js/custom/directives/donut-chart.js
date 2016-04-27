/**=========================================================
 * Module: donut-chart.js
 =========================================================*/

myApp.directive('donutChart', ["$rootScope","$timeout", function($rootScope, $timeout) {
	'use strict';

	return {
		restrict: 'E',
		templateUrl: 'app/templates/donut-chart.html', //todo: path relativo
		scope: {
			itemData: "=",
			chartId: "="
		},
		link: function(scope, element, attributes) {
			scope.parentHeight = element.parent().height();
			var colorsMap = $rootScope.colorsMap; //todo: convertire in costante

			/* per ottenere i dati sulle citazioni nel formato richiesto per il rendering del donut chart */
			var parseData = function(citActsInfo, totCitActs) {
				var data = [];
				for (var key in citActsInfo) {
					data.push({
						y: citActsInfo[key].numCitActs,
						indexLabel: citActsInfo[key].color,
						toolTipContent: "{indexLabel}: {y}",///"+totCitActs,
						color: colorsMap[citActsInfo[key]["colorURI"]]['color']
					});
				}
				return data;
			}


			scope.renderChart = function() {
				//console.log(scope.itemData.citActsInfo);
				if ($('#'+scope.chartId).length>0) {
					// configura il donut
					// parsing dei dati da visualizzare
					var citData = parseData(scope.itemData.citActsInfo, scope.itemData.totCitActs);
					var totCits = 0;
					for (var key in citData) {
						totCits += citData[key].y;
					}
					var chart = new CanvasJS.Chart(scope.chartId,
						{
							height: 230,
							//width:300,
							animationEnabled: true,
							animationDuration: 1000,
							title:{
								text: totCits.toString(),
								horizontalAlign: "center",
								verticalAlign: "center",
								fontSize: 40,
								dockInsidePlotArea: true,
								fontColor: "#656565"
							},
							data: [
								{
									type: "doughnut",
									startAngle: -90,
									indexLabelFontSize: 16,
									dataPoints: citData
								}
							]
						});

					// visualizza il donut
					chart.render();
				}
			}

			// quando le informazioni citazionali sono definite fai partire un timer di 1s per poi fare il render del chart
			scope.$watch('itemData.citActsInfo', function(newValue, oldValue) {
				if (scope.itemData.citActsInfo) {
					$timeout(scope.renderChart, 1000);
				}
			});






		}
	};

}]);
