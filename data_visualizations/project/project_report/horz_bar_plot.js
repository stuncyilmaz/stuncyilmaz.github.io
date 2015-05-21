function horz_bar(data) {

var margin = {top: 30, right: 50, bottom: 100, left: 250},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .2);

var formatter = d3.format(",");
  function xx(d) { return d['category']; }
  function measure(d) { return +d['measure']; }

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + xx(d) + "<br>Incidences: "+d3.format(",")(Math.floor(measure(d)))+  "</span>";
  });

var svg = d3.select("#horz_bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var colors =  [ ["Male", 'steelblue'],
          ["Female", 'brown'] ];

  function getColors(d) { 
    if(d.Sex==='Female'){return 'brown';}
     if(d.Sex==='Male'){return 'steelblue';}
   }

  data.sort(function(a,b){return d3.ascending(a.sum_column, b.sum_column);});
  // console.log(data);


      x.domain([d3.min(data, function(d) { 
        // console.log(d.measure);
        return -d.measure; 
      }), d3.max(data, function(d) { 
        // console.log(d.measure);
        return d.measure; 
      })             ]);


  y.domain(data.map(function(d) { return d['category']; }));

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(data.length+1);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
        .tickFormat(function (d) { 
         if (d === 0) return ''; // No label for '0'
         else if (d < 0) d = -d; // No nagative labels
         return formatter(d);
    });


svg.call(tip);
  var rect=svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return d['Sex'] === "Female" ? "bar negative" : "bar positive"; })
       .attr("x", function(d) { return d['Sex'] === "Female" ? x(Math.min(0, measure(d) )): x(Math.min(0, -measure(d) ));  }  )
      // .attr("x", function(d) { return x(Math.min(0, measure(d) )); })
      .attr("y", function(d) { return y(d['category']); })
      .attr("width", function(d) { return Math.abs(x(measure(d) ) - x(0)); })
      .attr("height", y.rangeBand())
      .on('mouseover', tip.show)    
       .on('mouseout', tip.hide)

        rect.on("click", up);



  function up(d, i) {
  
        /* update bar chart when user selects BAR_large_ce of the BAR_large_ chart */
        //updateBarChart(dataset[i].category);
        // console.log(d);
        updateBubbleChart(d.category,d.Sex);
        updateLineChart(d.category,d.Sex, getColors(d) );
         }


  var shift=height+5;
  svg.append("g")
      .attr("class", "x axis_label")
      .attr("transform", "translate(0," + shift + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis_label")
    .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y2", height);

      var trans=-10;
     var gy = svg.append("g")
     .attr("class", "y axis_label")
    // .attr("transform", "translate("+trans+"," + 0 + ")")
    .call(yAxis);

// title
svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Cancer Incidence Analysis in California for 1999-2011");

// ylabel
svg.append("text")
    .attr("x", (width / 2))
    .attr("y", height + (margin.bottom / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Total Number of Incidences Over 1999-2011");

svg.append("text")
    .attr("x", (width*0.8))
    .attr("y", height*0.1)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Click on a bar to select cancer site and sex");





// add legend   
var legend = svg.append("g")
    .attr("class", "legend")
    //.attr("x", w - 65)
    //.attr("y", 50)
    .attr("height", 100)
    .attr("width", 100)
    .attr('transform', 'translate(-20,50)');

var legendRect = legend.selectAll('rect').data(colors);

legendRect.enter()
    .append("rect")
    .attr("x", width - 65)
    .attr("width", 10)
    .attr("height", 10);

legendRect
    .attr("y", function(d, i) {
        return i * 20;
    })
    .style("fill", function(d) {
        return d[1];
    });

var legendText = legend.selectAll('text').data(colors);

legendText.enter()
    .append("text")
    .attr("x", width - 52);

legendText
    .attr("y", function(d, i) {
        return i * 20 + 9;
    })
    .text(function(d) {
        return d[0];
            });


};
