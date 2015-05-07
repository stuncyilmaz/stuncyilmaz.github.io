function scatter_func(svgid,holderid,height,width) {


	var svg = d3.select("svg#" + svgid);

    if (svg.empty()) {
        console.warn("Unable to find SVG:", svgid);
        return;
    }

    d3.select("svg#" + svgid).selectAll("*").remove();


        // ColorBrewer
    var colors = {
        "grey":   "#bbbbbb",
        "blue":   "#377eb8",
        "purple": "#984ea3",
        "green":  "#4daf4a",
        "orange": "#ff7f00"
    };

      var padding=100;


      //Width and height
      var w = width-2*padding;
      var h = height-2*padding;


// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return d['Income']; }
function y(d) { return d['Life.Exp']; }
function radius(d) { return +d['Population']; }
function color(d) { return d['region']; }
function key(d) { return d['state_name']; }

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + key(d) + "<br>Population: "+radius(d)+  "</span>";
  })

//Create SVG element
    var svg = d3.selectAll("#"+holderid).select("svg")
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding + ")");
// Create SVG element (remember use normal CSS style attributes)

svg.style("border-color", colors.grey);
svg.style("border-width", 1);
svg.style("border-style", "solid");

svg.call(tip);

// Defines a sort order so that the smallest dots are drawn on top.
function order(a, b) {
  return radius(b) - radius(a);
}


d3.csv("state.x77.csv", function(error, dataset){

      
      x_data=dataset.map(function(d) { return +x(d); });
      y_data=dataset.map(function(d) { return +y(d); });
      r_data=dataset.map(function(d) { return +radius(d); });
      col_data=dataset.map(function(d) { return +color(d); });

      //console.log(x_data);
      //console.log(dataset);
      //Create scale functions

        var rScale = d3.scale.linear()
       .domain([d3.min(r_data),d3.max(r_data)])
       .range([w/200, w/20]);

      // find radius of the most most left and bottom points to shift axis.
      minx_radius=radius(dataset.sort(function(a,b) {return - x(b) + x(a)})[1] ) 
      miny_radius=radius(dataset.sort(function(a,b) {return - y(b) + y(a)})[1] ) 
      console.log(rScale(miny_radius ) )

      var xScale = d3.scale.log()
       .domain([d3.min(x_data)-100,d3.max(x_data)])
       .range([0, w ]);


      var yScale = d3.scale.linear()
       .domain([d3.min(y_data)-1,d3.max(y_data)])
       .range([h, 0]);




      var colorScale = d3.scale.category10();


      //Define X axis
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(12, d3.format(",d"));

      //Define Y axis
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

        // Add a dot per nation. Initialize the data at 1800, and set the colors.
      var dot = svg.append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) {
            return xScale( x(d));
      })
      .attr("cy", function(d) {
            return yScale(y(d));
      })
      .style("fill", function(d) { return colorScale(color(d)); })
      .attr("r", function(d) {
            return rScale(radius(d));
      })
      .attr("data-legend",function(d) { return color(d)})
      .sort(order)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);



      legend = svg.append("g")
      .attr("class","legend")
      .attr("transform","translate(50,30)")
      .style("font-size","12px")
      .call(d3.legend);


      // Add an x-axis label.
      svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", w/2+w/5)
      .attr("y", h+h/8)
      .text("income per capita, inflation-adjusted (dollars)");

      //Add a y-axis label.
      svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -h/6)
      .attr("x", -h/6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("life expectancy (years)");


      //Create X axis
      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);
                  
      //Create Y axis
      svg.append("g")
      .attr("class", "axis")
      .call(yAxis);

      svg.append("text")
      .attr("x", (w / 2))             
      .attr("y", 0 - (padding / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text("The Wealth & Health of US States");

      });
}