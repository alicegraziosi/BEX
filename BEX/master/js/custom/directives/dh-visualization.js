myApp.directive('dhVisualization', ["$http","$rootScope","EndpointsManager", 
  function ($http, $rootscope, EndpointsManager) {

    return {
        restrict: 'E',  // the directive can be invoked only by using <dh-visualization> tag in the template
        templateUrl: 'app/templates/dh-visualization.html',  //todo: path relativo
        scope: {  // attributes bound to the scope of the directive
            authorUno: '=',
            authorDue: '='
        },
        link: function($scope, $element, $attributes) {

            console.log("autore uno " + $scope.authorUno.n + " " + $scope.authorUno.s);
            console.log("autore due " + $scope.authorDue.n + " " + $scope.authorDue.s);

            var encodeCite = $rootscope.encodeCite;
            var decodecite = $rootscope.decodecite;
            var arr_colors = $rootscope.arr_colors;

            var prefixes = "PREFIX fabio: <http://purl.org/spar/fabio/> \
                            PREFIX cito: <http://purl.org/spar/cito/> \
                            PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                            PREFIX frbr: <http://purl.org/vocab/frbr/core#> \
                            PREFIX co: <http://purl.org/co/> \
                            PREFIX dc: <http://purl.org/dc/terms/> \
                            PREFIX doi: <http://prismstandard.org/namespaces/basic/2.0/> \
                            PREFIX biro: <http://purl.org/spar/biro/> \
                            PREFIX c4o: <http://purl.org/spar/c4o/>";

            var endpointURL = EndpointsManager.getSelectedEndpoint();  // default http://two.eelst.cs.unibo.it:8181/data/query

            // venue : rivista
            var venue = "<http://www.semanticlancet.eu/resource/web-semantics-science-services-and-agents-on-the-world-wide-web>";

            var max_cit_in = 0;  // 17
            var max_cit_out = 0;  // 18

            var anni = {};
            var authors = {};

            var w = 650;
            var h = 180;

            var border = 50;
            var padding  = 10;


            var do_init = function () {

                max_min_cit(venue);

                // ANNI
                var queryAnni = prefixes + " \
                SELECT DISTINCT ?year { \
                  ?exp a fabio:Expression ;  \
                  fabio:hasPublicationYear ?year ; \
                  (^frbr:part)+ " + venue + " . \
                } ORDER BY ASC(?year)";

                var encodedquery = encodeURIComponent(queryAnni);
                var queryUrl = endpointURL + "?query=" + encodedquery + "&format=" + "json";
                $.ajax({dataType:"jsonp" , url:queryUrl , success:getArrayAnni});

                
                //AUTORI  
                var queryAutori = prefixes + "\
                SELECT distinct ?author ?n ?s { \
                  ?expression ^frbr:realization ?work ; \
                  (^frbr:part)+ <http://www.semanticlancet.eu/resource/web-semantics-science-services-and-agents-on-the-world-wide-web> . \
                  ?work a fabio:Work ; \
                  frbr:creator ?authors . \
                  ?authors co:item / co:itemContent ?author . \
                  ?author foaf:givenName ?n ; \
                  foaf:familyName ?s . \
                } ORDER BY ASC(?s) ASC(?n)";

                
                var encodedquery = encodeURIComponent(queryAutori);
                var queryUrl = endpointURL + "?query=" + encodedquery + "&format=" + "json";
                $.ajax({dataType:"jsonp" , url:queryUrl , success:getArrayAutori});

                
                getArrayAutori2();

                // SVG
                var svg = d3.select("#comparevis")
                  .append("svg")
                  //.attr("width", w+border)
                  .attr("width", '100%')
                  .attr("height", h*2+border)
        	        //.attr("height", '100%')
                  .attr("id", "svg_compare")
                  .classed("bordered", true);

                // SCELTA AUTORI
                d3.select('#author1').on('change',function() {
                  selected = this.options[this.selectedIndex].value;
                  console.log("autore1: " + selected);
                  draw_bars(selected, "author1");
                });
                d3.select('#author2').on('change',function() {
                  selected = this.options[this.selectedIndex].value;
                  console.log("autore2: " + selected);
                  draw_bars(selected, "author2")
                });
                d3.selectAll('#compareSelect input[name="compareType_A"]').on('change',function() {
                  selected = $('#author1').val();
                  draw_bars(selected, "author1");
                });
                  d3.selectAll('#compareSelect input[name="compareType_B"]').on('change',function() {
                  selected = $('#author2').val();
                  draw_bars(selected, "author2");
                });
            }

            do_init();

            function getArrayAnni(json) {
              queryResults = json.results.bindings;
              var res = [];
              for (var item in queryResults) {
                res.push(parseInt(year = queryResults[item].year.value));
              }
              anni = res; // 2003 - 2014
            }

            function getArrayAutori(json) {
              var authors  = $rootscope.authors;
              // author = {"n": n, "s": s, "fullName":fullName, "uri": uri};

              var auth = d3.select('#author1');
              auth.selectAll("option")
              .data(authors)
              .enter().append('option')
              .attr('value',function(d){return d.uri})  // uri
              .text(function(d){return d.s + ", " + d.n});  // cognome, nome

              var auth = d3.select('#author2');
              auth.selectAll("option")
              .data(authors)
              .enter().append('option')
              .attr('value',function(d){return d.uri})
              .text(function(d){return d.s + ", " + d.n});
            }

            function getArrayAutori2() {
              var authors  = $rootscope.authors;
              // author = {"n": n, "s": s, "fullName":fullName, "uri": uri};

              var auth = d3.select('#author1');
              auth.selectAll("option")
              .data(authors)
              .enter().append('option')
              .attr('value',function(d){return d.uri})  // uri
              .text(function(d){return d.s + ", " + d.n});  // cognome, nome

              var auth = d3.select('#author2');
              auth.selectAll("option")
              .data(authors)
              .enter().append('option')
              .attr('value',function(d){return d.uri})
              .text(function(d){return d.s + ", " + d.n});
            }
    
            function max_min_cit(venue) {

                $("#compareselect input").attr("disabled", "disabled");
                $("#compareselect select").attr("disabled", "disabled");

                var query_maxout = "\
                  PREFIX fabio: <http://purl.org/spar/fabio/> \
                  PREFIX cito: <http://purl.org/spar/cito/> \
                  PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                  PREFIX frbr: <http://purl.org/vocab/frbr/core#> \
                  PREFIX co: <http://purl.org/co/> \
                  PREFIX dc: <http://purl.org/dc/terms/> \
                  PREFIX doi: <http://prismstandard.org/namespaces/basic/2.0/> \
                  PREFIX biro: <http://purl.org/spar/biro/> \
                  PREFIX c4o: <http://purl.org/spar/c4o/> \
                  \
                  SELECT (MAX(?counter) as ?maxOutgoing) { \
                    SELECT ?author ?year (COUNT(?in_ca) AS ?counter) { \
                      ?author a foaf:Person ; \
                      ^co:itemContent / ^co:item / ^frbr:creator / frbr:realization ?expression . \
                      ?expression ^cito:hasCitingEntity ?in_ca ; \
                      (^frbr:part)+ " + venue + " . \
                      ?in_ca a cito:CitationAct ; \
                      cito:hasCitedEntity ?cited . \
                      ?cited (^frbr:part)+ " + venue + " ; \
                      fabio:hasPublicationYear ?year . \
                  } GROUP BY ?author ?year \
                  ORDER BY ?counter \
                  }";

                var query_maxin = "\
                  PREFIX fabio: <http://purl.org/spar/fabio/> \
                  PREFIX cito: <http://purl.org/spar/cito/> \
                  PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                  PREFIX frbr: <http://purl.org/vocab/frbr/core#> \
                  PREFIX co: <http://purl.org/co/> \
                  PREFIX dc: <http://purl.org/dc/terms/> \
                  PREFIX doi: <http://prismstandard.org/namespaces/basic/2.0/> \
                  PREFIX biro: <http://purl.org/spar/biro/> \
                  PREFIX c4o: <http://purl.org/spar/c4o/> \
                  \
                  SELECT (MAX(?counter) as ?maxIncoming) { \
                    SELECT ?author ?year (COUNT(?in_ca) AS ?counter) { \
                      ?author a foaf:Person ; \
                      ^co:itemContent / ^co:item / ^frbr:creator / frbr:realization ?expression . \
                      ?expression ^cito:hasCitedEntity ?in_ca ; \
                      (^frbr:part)+ " + venue + " . \
                      ?in_ca a cito:CitationAct ; \
                      cito:hasCitingEntity ?cited . \
                      ?cited (^frbr:part)+ " + venue + " ; \
                      fabio:hasPublicationYear ?year . \
                  } GROUP BY ?author ?year \
                  ORDER BY ?counter \
                }";

                var encodedquery = encodeURIComponent(query_maxout);
                var queryUrl = endpointURL + "?query=" + encodedquery + "&format=" + "json";
                $.ajax({
                    dataType:"jsonp" ,
                    url:queryUrl ,
                    success:function(data){
                      queryResults = data.results.bindings;
                      if (!queryResults[0].maxOutgoing) {
                        alert("An error occured while trying to contact the server. Please try to reload the page later.")
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
                });

                var encodedquery = encodeURIComponent(query_maxin);
                var queryUrl = endpointURL + "?query=" + encodedquery + "&format=" + "json";
                $.ajax({
                    dataType:"jsonp",
                    url:queryUrl,
                    success:function(data){
                        queryResults = data.results.bindings;
                        if (!queryResults[0].maxIncoming) {
                            alert("An error occured while trying to contact the server. Please try to reload the page later.")
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
                });
            }

            function draw_bars(selected, author_num) {
                var query_get_cited = prefixes + " \
                  SELECT ?year ?color (COUNT(?color) AS ?counter) { \
                    <" + selected + "> ^co:itemContent / ^co:item / ^frbr:creator / frbr:realization ?expression . \
                    \
                    ?expression  \
                    ^cito:hasCitingEntity ?in_ca . \
                    ?in_ca a cito:CitationAct ; \
                    cito:hasCitationCharacterization ?color ; \
                    cito:hasCitedEntity / fabio:hasPublicationYear ?year . \
                  } GROUP BY ?year ?color \
                  ORDER BY ?color ?year ASC(?color)";

                var query_get_citing = prefixes + " \
                  SELECT ?year ?color (COUNT(?color) AS ?counter) { \
                    <" + selected + "> ^co:itemContent / ^co:item / ^frbr:creator / frbr:realization ?expression . \
                    \
                    ?expression  \
                    ^cito:hasCitedEntity ?in_ca . \
                    ?in_ca a cito:CitationAct ; \
                    cito:hasCitationCharacterization ?color ; \
                    cito:hasCitingEntity / fabio:hasPublicationYear ?year . \
                  } GROUP BY ?year ?color \
                  ORDER BY ?color ?year ASC(?color)";

                if (author_num == "author1") {
                    citation_type = $('input[name="compareType_A"]:checked').val();
                } else {
                    citation_type = $('input[name="compareType_B"]:checked').val();
                }
                if (citation_type == "incoming") {
                    query_citation = query_get_citing; 
                } else {
                  query_citation = query_get_cited;
                }
                var encodedquery = encodeURIComponent(query_citation);
                var queryUrl = endpointURL + "?query=" + encodedquery + "&format=" + "json";
                $.ajax({dataType:"jsonp" , url:queryUrl , success:function(data){
                  draw_bars_get_response(data, author_num)}
                });
            }

            function draw_bars_get_response(json, author_num) {

                d3.select("#comparevis svg g."+author_num).remove();

                queryResults = json.results.bindings;

                // se non ritorna nessun risultato
                if (!queryResults[0].color)
                    return ;

                var res = {}
                for (var item in queryResults) {
                    year = queryResults[item].year.value;
                    color = queryResults[item].color.value;
                    counter = queryResults[item].counter.value;

                    if (!encodeCite[color])
                        alert("Non esiste corrispondenza per colore " + color);

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

                console.log("author_num: " + author_num);

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
                  if (d3.select("#comparevis svg g.axis").empty()) {

                    var x = d3.scale.ordinal()
                    .domain( data[0].map(function(d) { return d.x;} ) )
                    .rangeRoundBands([0, w], 0.05);

                    var y = d3.scale.linear()
                    .domain([0, d3.max([max_cit_in, max_cit_out])])
                    .rangeRound([h, 0]);

                    console.log(d3.max([max_cit_in, max_cit_out]));

                    var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                    var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(d3.format(".2s"));

                    var y2 = d3.scale.linear()
                    .domain([d3.max([max_cit_in, max_cit_out]), 0])
                    .rangeRound([h, 0]);

                    var y2Axis = d3.svg.axis()
                    .scale(y2)
                    .orient("left")
                    .tickFormat(d3.format(".2s"));

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
                    .text("# cit.");

                    axis.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate("+border+", "+(h+border-(2*padding))+")")
                    .call(y2Axis)
                } else {
                    console.log("CE STANNO gli assi");
                }

                var bars = svg.append("g") .classed("bars "+author_num, true);
                
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
                  //return colors(i);
                  for (var i in d) {
                    if (d[i].color) {
                      return arr_colors[ d[i].color ].color;
                    }
                  }
                }); //.attr("transform", "translate("+border+",0)");


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
        }
      }
}]);