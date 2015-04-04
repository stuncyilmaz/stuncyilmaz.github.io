function count_func(svgid,x,height2,width2) {
    var svg = d3.select("svg#" + svgid);

    if (svg.empty()) {
        console.warn("Unable to find SVG:", svgid);
        return;
    }

    d3.select("svg").selectAll("*").remove();



    function isVowel( chr ){ return 'aeiou'.indexOf( chr[0].toLowerCase() ) !== -1 };

    x= x.replace(/[^A-Za-z]/g, "").toLowerCase();
    var dict_vowel = []; 
    var dict_vowel = []; 
    var dict = []; 
    for (i = 0; i < x.length; i++) { 
      if (x[i] in  dict) {
          dict[x[i]]++;
      } else {
          dict[x[i]]=1;
      }
    };
    // console.log(isVowel('e'));
    // console.log(dict);


    var data=[];
    for (var key in dict ){

        data.push({letter:key, frequency:dict[key],vowel:isVowel( key )});

      }

    data.sort(function(a,b){return d3.ascending(a.letter, b.letter);});

    var colors = {
        "grey":   "#bbbbbb",
        "blue":   "#377eb8",
        "purple": "#984ea3",
        "green":  "#4daf4a",
        "orange": "#ff7f00"
        };


    var margin = {top: 50, right: 20, bottom: 30, left: 80},
        width = width2 - margin.left - margin.right,
        height = height2 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(data.length+1);

    var formatxAxis = d3.format('.3f');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatxAxis)
        .ticks(5);

    var svg = d3.selectAll("#svg_holder").select("svg")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

      var gx=svg.append("g")
          .attr("class", "x axis")
          .style("fill","red")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);


     var gy = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

    gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-5.0em")
      .attr("dx", "-"+height/3)
      .style("text-anchor", "end") .style("font-size",12)
      .text("Letter Count");

    // get tick positions and grids

    var x_ticks = []
    gx.selectAll(".tick").each(function() {
      var tick = d3.select(this);
      // pull the transform data out of the tick
      var transform = d3.transform(tick.attr("transform")).translate;

    // passed in "data" is the value of the tick, transform[0] holds the X value
      console.log("each x tick", data, transform[0])
      x_ticks.push(transform[0]);
    });
    var y_ticks = []
    gy.selectAll(".tick").each(function() {
      var tick = d3.select(this);
      // pull the transform data out of the tick
      var transform = d3.transform(tick.attr("transform")).translate;

      // passed in "data" is the value of the tick, transform[0] holds the X value
      console.log("each y tick", data, transform[1])
      y_ticks.push(transform[1]);
    });

    for (i = 0; i < y_ticks.length; i++) {
        svg.append("line")          // attach a line
        .style("stroke", "grey") 
        .style("stroke-dasharray", ("3, 3")) // colour the line
        .attr("x1", 0 )     // x position of the first end of the line
        .attr("y1", y_ticks[i])      // y position of the first end of the line
        .attr("x2", width)     // x position of the second end of the line
        .attr("y2", y_ticks[i]); 
    }

    for (i = 0; i < x_ticks.length; i++) {
        svg.append("line")          // attach a line
        .style({"stroke":"grey","stroke-dasharray":("3, 3")})  // colour the line
        .attr("x1", x_ticks[i] )     // x position of the first end of the line
        .attr("y1", 0)      // y position of the first end of the line
        .attr("x2", x_ticks[i])     // x position of the second end of the line
        .attr("y2", height); 
    }

    // /////////////////////////////////////////////////
    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("vowel", function(d) { return (d.vowel); })
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); });

      svg.selectAll("rect")
    .transition()
    .delay(function(d, i) { return i*500 ; })
        .duration(600)
    .attr("y", function(d) { return y(d.frequency); })
    .attr("height", function(d) { return height - y(d.frequency); });



      // svg.selectAll(".bar")
      //     .data(data)
      //   .enter().append("rect")
      //     .attr("class", "bar")
      //     .attr("vowel", function(d) { return (d.vowel); })
      //     .attr("x", function(d) { return x(d.letter); })
      //     .attr("width", x.rangeBand())
      //     .attr("y", function(d) { return y(d.frequency); })
      //     .attr("height", function(d) { return height - y(d.frequency); });




    svg.selectAll("rect")
          .each(function(){
            if(d3.select(this).attr('vowel')==='true' ){
                d3.select(this).attr("class", "bar vowel")

            }

          } );
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Letters Bar Chart");

}

