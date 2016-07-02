myApp.directive('dhVisualization', ["$http", "$rootScope", "EndpointsManager", "ArticlesInfoService",
  function ($http, $rootScope, EndpointsManager, ArticlesInfoService) {

    return {
        restrict: 'E',  // the directive can be invoked only by using <dh-visualization> tag in the template
        templateUrl: 'app/templates/dh-visualization.html',  //todo: path relativo
        scope: {  // attributes bound to the scope of the directive
            authorUno: '=',
            authorDue: '=',
            comparisonType: "="
        },
        link: function($scope, $element, $attributes) {

            var self = this;
            self.authorUno = $scope.authorUno;
            self.authorDue = $scope.authorDue;
            self.comparisonType = $scope.comparisonType;

            var encodeCite = $rootScope.encodeCite;
            var decodeCite = $rootScope.decodeCite;
            var arr_colors = $rootScope.arr_colors;

            // id="prefixes" in index.html
            var prefixes = $('#prefixes').text();

            var endpointURL = EndpointsManager.getSelectedEndpoint();  // default http://two.eelst.cs.unibo.it:8181/data/query

            /*
            var max_cit_in;  // 17
            var max_cit_out;  // 18

            var anni = {};
            */

            var max_cit_in = $rootScope.max_cit_in;
            var max_cit_out = $rootScope.max_cit_out;  

            var anni = $rootScope.years;

            var w = 650;
            var h = 180;

            var border = 50;
            var padding  = 10;

            var do_init = function () {

                //max_min_cit();

                //getArrayAnni()

                // SVG
                var svg = d3.select("#comparevis")
                    .append("svg")
                    //.attr("width", w+border)
                    .attr("width", '100%')
                    .attr("height", h*2+border)
                    //.attr("height", '100%')
                    .attr("id", "svg_compare")
                    .classed("bordered", true);
            }

            do_init();


            $scope.$watch('authorUno', function() {
                if($scope.authorUno != ""){
                    draw_bars($scope.authorUno.uri , "author1");
                }
            });

            $scope.$watch('authorDue', function() {
                if($scope.authorDue != ""){
                    draw_bars($scope.authorDue.uri , "author2");
                }
            })

            $scope.$watch('comparisonType', function() {
                if($scope.authorUno != ""){
                    draw_bars($scope.authorUno.uri , "author1");
                }
                if($scope.authorDue != ""){
                    draw_bars($scope.authorDue.uri , "author2");
                }
            });

            /*
            function getArrayAnni(){
                ArticlesInfoService.getRangeAnni().then(
                    function (response) {
                        queryResults = response.data.results.bindings;
                        var res = [];
                        for (var item in queryResults) {
                            res.push(parseInt(year = queryResults[item].year.value));
                        }
                        anni = res; // 2003 - 2014
                        console.log("anni");
                    }
                );
            }*/

            /*
            function max_min_cit() {
                $("#compareselect input").attr("disabled", "disabled");
                $("#compareselect select").attr("disabled", "disabled");
                ArticlesInfoService.getMaxOutgoing().then(
                    function (response) {
                        queryResults = response.data.results.bindings;
                        if (!queryResults[0].maxOutgoing) {
                            console.log("Error while fetching maxOutgoing. " + errResponse.status + ": " + errResponse.statusText)
                            return ;
                        }
                        max_cit_out = parseInt(queryResults[0].maxOutgoing.value);
                        console.log( max_cit_out );
                            if (max_cit_in != 0) {
                            $("#compareselect input").removeAttr("disabled");
                            $("#compareselect select").removeAttr("disabled");
                            $("#compareselect p.message").html("&nbsp");
                        }
                    }
                );
                ArticlesInfoService.getMaxIncoming().then(
                    function (response) {
                        queryResults = response.data.results.bindings;
                        if (!queryResults[0].maxIncoming) {
                            console.log("An error occured while trying to contact the server. Please try to reload the page later.")
                            return ;
                        }
                        max_cit_in = parseInt(queryResults[0].maxIncoming.value);
                        console.log( max_cit_in );
                        if (max_cit_out != 0) {
                            $("#compareselect input").removeAttr("disabled");
                            $("#compareselect select").removeAttr("disabled");
                            $("#compareselect p.message").html("&nbsp");
                        }
                    }
                );
            }*/
            
            function draw_bars(authorUri, author_num) {
                if ($scope.comparisonType == "incoming") {
                    ArticlesInfoService.getCiting(authorUri).then(
                    function (response) {
                        draw_bars_get_response(response, author_num)
                    });
                } else {
                    ArticlesInfoService.getCited(authorUri).then(
                    function (response) {
                        draw_bars_get_response(response, author_num)
                    });
                }
            }

            function draw_bars_get_response(json, author_num) {

                d3.select("#comparevis svg g."+author_num).remove();

                queryResults = json.data.results.bindings;

                // se non ritorna nessun risultato
                /*
                if (!queryResults[0].color){
                    draw_bars_noData(author_num);
                    return ;
                }*/

                var res = {};
                for (var item in queryResults) {
                    // alcuni anni sono NaN
                    if(queryResults[item].year){
                        year = queryResults[item].year.value;
                    } else {
                        draw_bars_noData(author_num);
                        return;
                    }

                    // non tutti i dataset hanno i motivi citazionali
                    if(queryResults[item].color){
                        color = queryResults[item].color.value;
                    } else {
                        color = "http://purl.org/spar/cito/cites";
                    }
                    counter = queryResults[item].counter.value;

                    if (!encodeCite[color]){
                        console.log("Non esiste corrispondenza per colore " + color);
                    }

                    if (!res[encodeCite[color]]) {
                        res[encodeCite[color]] = {};
                    }
                    obj = {"x": parseInt(year), "y": parseInt(counter), "color": encodeCite[color]};
                    res[encodeCite[color]][year] = obj;
                }

                var res2 = [];
                for (var colore in res) {
                    var temp = [];
                    col = res[colore];
                    for (var i in anni) {
                        if (col[anni[i]]) {
                            temp.push(col[anni[i]]);
                        } else {
                            temp.push( {
                            "x": anni[i],
                            "y": null,
                            "color": null
                            } );
                        }
                    }
                    res2.push(temp);
                }

                draw_compare_bars(res2, author_num);
            }


            function draw_compare_bars (data, author_num) {
                //Set up stack method
                var stack = d3.layout.stack();

                //Data, stacked
                stack(data); //Set up scales

                var xScale = d3.scale.ordinal()
                .domain(d3.range(data[0].length))
                .rangeRoundBands([0, w], 0.05);

                var yScale = d3.scale.linear()
                .domain([0, d3.max([max_cit_in, max_cit_out])])
                .range([0, h]);

                //Select SVG element
                var svg = d3.select("#svg_compare");

                // LA PRIMA VOLTA AGGIUNGO GLI ASSI
                //if (d3.select("#comparevis svg g.axis").empty()) {

                d3.select("#comparevis svg g.axis").remove();
                    // asse x
                    var x = d3.scale.ordinal()
                        .domain(data[0].map(function(d) { return d.x;} ) )
                        .rangeRoundBands([0, w], 0.05);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");


                    // asse y pos (max tra max tra max_cit_in  e max_cit_out)
                    var y = d3.scale.linear()
                        .domain([0, d3.max([max_cit_in, max_cit_out])])
                        .rangeRound([h, 0]);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .tickFormat(d3.format(".0f"));  // .0f no cifre decimali


                    // asse y neg (max tra max tra max_cit_in  e max_cit_out)
                    var y2 = d3.scale.linear()
                        .domain([d3.max([max_cit_in, max_cit_out]), 0])
                        .rangeRound([h, 0]);

                    var y2Axis = d3.svg.axis()
                        .scale(y2)
                        .orient("left")
                        .tickFormat(d3.format(".0f"));  // .0f no cifre decimali


                    var axis = svg.append("g")
                        .classed("axis", true);

                    axis.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate("+border+"," + (h+padding) + ")")
                        .text("Year")
                        .call(xAxis);

                    axis.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate("+border+", "+padding+")")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Number of citations");

                    axis.append("g")
                        .attr("class", "y axis")
                        .text("Year")
                        .attr("transform", "translate("+border+", "+(h+border-(2*padding))+")")
                        .call(y2Axis)
               
                /*
                } else {
                    console.log("ASSI GIA' PRESENTI");
                }
                */

                var bars = svg.append("g").classed("bars "+author_num, true);
                
                if (author_num == "author1") {
                    bars.attr("transform", "translate("+border+",0)");
                } else {
                    bars.attr("transform", "translate("+border+"," + (2*h+border-padding) + ") scale(1, -1)");
                }

                // Add a group for each row of data
                var groups = bars.selectAll("g")
                    .data(data)
                    .enter()
                    .append("g")
                    .style("fill", function(d, i) {
                      for (var i in d) {
                        if (d[i].color) {
                          return arr_colors[ d[i].color ].color;
                        }
                      }
                    });


                // Add a rect for each data value
                var rects = groups.selectAll("rect")
                    .data(function(d) { return d; })
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                      return xScale(i);
                    })
                    .attr("y", function(d) {
                      return h-(yScale(d.y0)+yScale(d.y)-padding);
                    })
                    .attr("height", function(d) {
                      return yScale(d.y);
                    })
                    .attr("width", xScale.rangeBand())
                    .append("title")
                    .text(function(d) { return d.y + " " + decodeCite[d.color] });
            }

            
            function draw_bars_noData(author_num){
                var xScale = d3.scale.ordinal()
                .rangeRoundBands([0, w], 0.05);

                var yScale = d3.scale.linear()
                .domain([0, d3.max([max_cit_in, max_cit_out])])
                .range([0, h]);

                //Select SVG element
                var svg = d3.select("#svg_compare");

                // LA PRIMA VOLTA AGGIUNGO GLI ASSI
                if (d3.select("#comparevis svg g.axis").empty()) {

                    //d3.select("#comparevis svg g.axis").remove();

                    // asse x
                    var x = d3.scale.ordinal()
                        .rangeRoundBands([0, w], 0.05);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");


                    // asse y pos (max tra max tra max_cit_in  e max_cit_out)
                    var y = d3.scale.linear()
                        .domain([0, d3.max([max_cit_in, max_cit_out])])
                        .rangeRound([h, 0]);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .tickFormat(d3.format(".0f"));  // .0f no cifre decimali


                    // asse y neg (max tra max tra max_cit_in  e max_cit_out)
                    var y2 = d3.scale.linear()
                        .domain([d3.max([max_cit_in, max_cit_out]), 0])
                        .rangeRound([h, 0]);

                    var y2Axis = d3.svg.axis()
                        .scale(y2)
                        .orient("left")
                        .tickFormat(d3.format(".0f"));  // .0f no cifre decimali


                    var axis = svg.append("g")
                        .classed("axis", true);

                    axis.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate("+border+"," + (h+padding) + ")")
                        .call(xAxis);

                    axis.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate("+border+", "+padding+")")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Number of citations");

                    axis.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate("+border+", "+(h+border-(2*padding))+")")
                        .call(y2Axis)
                
                
                } else {
                    console.log("ASSI GIA' PRESENTI");
                    //d3.select("svg").remove();
                }

                var bars = svg.append("g").classed("bars "+author_num, true);
                
                if (author_num == "author1") {
                    bars.attr("transform", "translate("+border+",0)");
                } else {
                    bars.attr("transform", "translate("+border+"," + (2*h+border-padding) + ") scale(1, -1)");
                }
            }
            
        }
    }
}]);